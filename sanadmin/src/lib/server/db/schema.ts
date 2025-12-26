import { pgTable, serial, integer, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

// Admin user table for sanadmin backend authentication
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').notNull().default('admin'), // 'admin' or 'superadmin'
	createdAt: timestamp('created_at').defaultNow().notNull(),
	lastLoginAt: timestamp('last_login_at')
});

// Session management for admin users
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

// Enhanced medication reports table with comprehensive fields
export const medicationReports = pgTable('medication_reports', {
	id: serial('id').primaryKey(),
	// Medication information
	medicationName: text('medication_name').notNull(),
	medicationDosage: text('medication_dosage'), // e.g., "500mg", "10ml"
	medicationType: text('medication_type'), // e.g., "tablet", "liquid", "injection"
	
	// Effects - both positive and negative
	sideEffects: jsonb('side_effects').$type<string[]>().notNull(), // Array of side effects
	positiveEffects: jsonb('positive_effects').$type<string[]>(), // Array of positive experiences
	
	// Severity and impact
	severity: integer('severity').notNull(), // 1-10 scale
	impactOnDailyLife: text('impact_on_daily_life'), // Description of impact
	durationOfEffect: text('duration_of_effect'), // e.g., "2 hours", "3 days"
	
	// Demographics - all optional for anonymity
	age: integer('age'),
	ageGroup: text('age_group'), // e.g., "18-25", "26-35", "36-50", "51-65", "65+"
	gender: text('gender'), // 'male', 'female', 'other', 'prefer_not_to_say'
	ethnicity: text('ethnicity'), // Optional demographic data
	location: text('location'), // General location (country/region, not specific)
	
	// Additional context
	usageDuration: text('usage_duration'), // How long they've been taking the medication
	otherMedications: jsonb('other_medications').$type<string[]>(), // Other concurrent medications
	medicalConditions: jsonb('medical_conditions').$type<string[]>(), // Pre-existing conditions
	
	// Metadata
	isVerified: boolean('is_verified').default(false), // For admin verification
	isAnonymized: boolean('is_anonymized').default(true).notNull(),
	submissionSource: text('submission_source').default('web_form'), // 'web_form', 'api', etc.
	ipHash: text('ip_hash'), // Hashed IP for abuse prevention (not identifying)
	
	// Timestamps
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
	verifiedAt: timestamp('verified_at')
});

// Audit log for admin actions
export const auditLog = pgTable('audit_log', {
	id: serial('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	action: text('action').notNull(), // e.g., 'delete_report', 'edit_report', 'export_data'
	entityType: text('entity_type').notNull(), // e.g., 'medication_report', 'user'
	entityId: text('entity_id').notNull(),
	details: jsonb('details'), // Additional context about the action
	ipAddress: text('ip_address'),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Aggregated statistics cache for performance
export const statisticsCache = pgTable('statistics_cache', {
	id: serial('id').primaryKey(),
	cacheKey: text('cache_key').notNull().unique(), // e.g., 'total_reports', 'reports_by_gender'
	cacheData: jsonb('cache_data').notNull(), // The cached statistics
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// Type exports
export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type MedicationReport = typeof medicationReports.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
export type StatisticsCache = typeof statisticsCache.$inferSelect;

// Insert type exports for form handling
export type NewUser = typeof user.$inferInsert;
export type NewMedicationReport = typeof medicationReports.$inferInsert;
export type NewAuditLog = typeof auditLog.$inferInsert;
