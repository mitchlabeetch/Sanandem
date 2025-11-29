import { db } from '$lib/server/db';
import { medicationReports } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Aggregate data for visualization

	// 1. Most common side effects
	const sideEffects = await db
		.select({
			name: medicationReports.sideEffect,
			count: sql<number>`count(*)`
		})
		.from(medicationReports)
		.groupBy(medicationReports.sideEffect)
		.orderBy(sql`count(*) desc`)
		.limit(5);

	// 2. Average severity by Medication
	const severityByMed = await db
		.select({
			medication: medicationReports.medicationName,
			avgSeverity: sql<number>`avg(${medicationReports.severity})`
		})
		.from(medicationReports)
		.groupBy(medicationReports.medicationName);

	return {
		sideEffects: sideEffects.map(s => ({ name: s.name, value: Number(s.count) })),
		severityByMed: severityByMed.map(s => ({ name: s.medication, value: Number(s.avgSeverity) }))
	};
};
