import { db } from './index.js';
import { medicationReports, type NewMedicationReport } from './schema.js';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { createHash } from 'crypto';
import { getCachedData, setCachedData, invalidateCache } from './cache.js';
import { env } from '$env/dynamic/private';

const STATS_CACHE_KEY = 'report_statistics';
const MED_STATS_CACHE_KEY = 'medication_statistics';
const CACHE_TTL = 3600; // 1 hour

/**
 * Anonymize IP address by hashing it
 */
export function hashIpAddress(ip: string): string {
	const salt = env.IP_SALT;

	if (!salt) {
		// In production, we must fail secure
		if (process.env.NODE_ENV === 'production') {
			throw new Error(
				'SECURITY CRITICAL: IP_SALT environment variable is not set. Cannot securely hash IP addresses.'
			);
		}
		// In development, warn but allow
		console.warn(
			'SECURITY WARNING: IP_SALT environment variable is not set. Using insecure default salt. Do NOT use this in production.'
		);
		return createHash('sha256')
			.update(ip + 'default-salt')
			.digest('hex');
	}

	// Verify salt strength in production
	if (process.env.NODE_ENV === 'production' && salt.length < 32) {
		throw new Error(
			'SECURITY CRITICAL: IP_SALT is too short. It must be at least 32 characters long for secure hashing.'
		);
	}

	return createHash('sha256')
		.update(ip + salt)
		.digest('hex');
}

/**
 * Create a new medication report
 */
export async function createReport(data: NewMedicationReport) {
	const [report] = await db
		.insert(medicationReports)
		.values({
			...data,
			isAnonymized: true,
			updatedAt: new Date()
		})
		.returning();

    // Invalidate caches when new data is added
    await invalidateCache(STATS_CACHE_KEY);
    await invalidateCache(MED_STATS_CACHE_KEY);

	return report;
}

/**
 * Get a report by ID
 */
export async function getReportById(id: number) {
	const [report] = await db
		.select()
		.from(medicationReports)
		.where(eq(medicationReports.id, id));
	return report;
}

/**
 * Get all reports with optional filters
 */
export interface ReportFilters {
	gender?: string;
	minAge?: number;
	maxAge?: number;
	minSeverity?: number;
	maxSeverity?: number;
	medicationName?: string;
	isVerified?: boolean;
	limit?: number;
	offset?: number;
}

export async function getReports(filters: ReportFilters = {}) {
	let query = db.select().from(medicationReports);

	const conditions = [];

	if (filters.gender) {
		conditions.push(eq(medicationReports.gender, filters.gender));
	}

	if (filters.minAge !== undefined) {
		conditions.push(gte(medicationReports.age, filters.minAge));
	}

	if (filters.maxAge !== undefined) {
		conditions.push(lte(medicationReports.age, filters.maxAge));
	}

	if (filters.minSeverity !== undefined) {
		conditions.push(gte(medicationReports.severity, filters.minSeverity));
	}

	if (filters.maxSeverity !== undefined) {
		conditions.push(lte(medicationReports.severity, filters.maxSeverity));
	}

	if (filters.medicationName) {
		conditions.push(sql`${medicationReports.medicationName} ILIKE ${`%${filters.medicationName}%`}`);
	}

	if (filters.isVerified !== undefined) {
		conditions.push(eq(medicationReports.isVerified, filters.isVerified));
	}

	if (conditions.length > 0) {
		query = query.where(and(...conditions)) as any;
	}

	query = query.orderBy(desc(medicationReports.createdAt)) as any;

	if (filters.limit) {
		query = query.limit(filters.limit) as any;
	}

	if (filters.offset) {
		query = query.offset(filters.offset) as any;
	}

	return await query;
}

/**
 * Update a report
 */
export async function updateReport(id: number, data: Partial<NewMedicationReport>) {
	const [report] = await db
		.update(medicationReports)
		.set({
			...data,
			updatedAt: new Date()
		})
		.where(eq(medicationReports.id, id))
		.returning();

    // Invalidate caches
    await invalidateCache(STATS_CACHE_KEY);
    await invalidateCache(MED_STATS_CACHE_KEY);

	return report;
}

/**
 * Delete a report
 */
export async function deleteReport(id: number) {
	const [report] = await db
		.delete(medicationReports)
		.where(eq(medicationReports.id, id))
		.returning();

    // Invalidate caches
    await invalidateCache(STATS_CACHE_KEY);
    await invalidateCache(MED_STATS_CACHE_KEY);

	return report;
}

/**
 * Get statistics about reports
 */
export async function getReportStatistics() {
    // Try cache first
    const cached = await getCachedData(STATS_CACHE_KEY);
    if (cached) return cached;

	const totalReports = await db
		.select({ count: sql<number>`cast(count(*) as int)` })
		.from(medicationReports);

	const byGender = await db
		.select({
			gender: medicationReports.gender,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(medicationReports)
		.groupBy(medicationReports.gender);

	const bySeverity = await db
		.select({
			severity: medicationReports.severity,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(medicationReports)
		.groupBy(medicationReports.severity)
		.orderBy(medicationReports.severity);

	const byAgeGroup = await db
		.select({
			ageGroup: medicationReports.ageGroup,
			count: sql<number>`cast(count(*) as int)`
		})
		.from(medicationReports)
		.where(sql`${medicationReports.ageGroup} IS NOT NULL`)
		.groupBy(medicationReports.ageGroup);

    const result = {
		totalReports: totalReports[0]?.count || 0,
		byGender,
		bySeverity,
		byAgeGroup
	};

    // Cache the result
    await setCachedData(STATS_CACHE_KEY, result, CACHE_TTL);

	return result;
}

/**
 * Get medication statistics
 */
export async function getMedicationStatistics() {
    // Try cache first
    const cached = await getCachedData(MED_STATS_CACHE_KEY);
    if (cached) return cached;

	const topMedications = await db
		.select({
			medicationName: medicationReports.medicationName,
			count: sql<number>`cast(count(*) as int)`,
			avgSeverity: sql<number>`cast(avg(${medicationReports.severity}) as decimal(10,2))`
		})
		.from(medicationReports)
		.groupBy(medicationReports.medicationName)
		.orderBy(desc(sql`count(*)`))
		.limit(20);

    // Cache the result
    await setCachedData(MED_STATS_CACHE_KEY, topMedications, CACHE_TTL);

	return topMedications;
}
