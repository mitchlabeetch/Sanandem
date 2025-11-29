import { pgTable, serial, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull().references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const medicationReports = pgTable('medication_reports', {
	id: serial('id').primaryKey(),
	medicationName: text('medication_name').notNull(),
	sideEffect: text('side_effect').notNull(),
	severity: integer('severity').notNull(), // 1-10
	age: integer('age').notNull(),
	gender: text('gender').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type MedicationReport = typeof medicationReports.$inferSelect;
