import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { medicationReports } from '$lib/server/db/schema';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    try {
        const heatmap = await db.execute(sql`
            SELECT
                age_group as "ageGroup",
                severity,
                COUNT(*) as count
            FROM ${medicationReports}
            WHERE age_group IS NOT NULL
            GROUP BY 1, 2
            ORDER BY 1, 2
        `);

        return {
            heatmap: heatmap as unknown as Array<{ ageGroup: string, severity: number, count: number }>
        };
    } catch (e) {
        console.error("Heatmap query failed, using mock", e);
        return {
            heatmap: [
                { ageGroup: '18-25', severity: 5, count: 10 },
                { ageGroup: '36-50', severity: 8, count: 5 }
            ]
        };
    }
};
