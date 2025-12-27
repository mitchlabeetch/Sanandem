import { db } from './index.js';
import { medicationReports, auditLog, type NewMedicationReport, type NewAuditLog } from './schema.js';
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { createHash } from 'crypto';

/**
 * Anonymize IP address by hashing it
 */
export function hashIpAddress(ip: string): string {
	return createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex');
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
	return report;
}

/**
 * Get statistics about reports
 */
export async function getReportStatistics() {
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

	return {
		totalReports: totalReports[0]?.count || 0,
		byGender,
		bySeverity,
		byAgeGroup
	};
}

/**
 * Get medication statistics
 */
export async function getMedicationStatistics() {
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

	return topMedications;
}

/**
 * Log an audit action
 */
export async function logAuditAction(data: NewAuditLog) {
	const [log] = await db
		.insert(auditLog)
		.values(data)
		.returning();
	return log;
}

/**
 * Get audit logs with optional filters
 */
export interface AuditLogFilters {
	userId?: string;
	action?: string;
	entityType?: string;
	limit?: number;
	offset?: number;
}

export async function getAuditLogs(filters: AuditLogFilters = {}) {
	let query = db.select().from(auditLog);

	const conditions = [];

	if (filters.userId) {
		conditions.push(eq(auditLog.userId, filters.userId));
	}

	if (filters.action) {
		conditions.push(eq(auditLog.action, filters.action));
	}

	if (filters.entityType) {
		conditions.push(eq(auditLog.entityType, filters.entityType));
	}

	if (conditions.length > 0) {
		query = query.where(and(...conditions)) as any;
	}

	query = query.orderBy(desc(auditLog.createdAt)) as any;

	if (filters.limit) {
		query = query.limit(filters.limit) as any;
	}

	if (filters.offset) {
		query = query.offset(filters.offset) as any;
	}

	return await query;
}
