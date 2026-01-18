import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { medicationReports } from '$lib/server/db/schema.js';
import { sql } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url }) => {
    const med1Name = url.searchParams.get('med1');
    const med2Name = url.searchParams.get('med2');

    if (!med1Name || !med2Name) {
        return {
            med1: med1Name,
            med2: med2Name,
            comparison: null
        };
    }

    // Helper to fetch stats for a medication
    async function getStats(name: string) {
        const stats = await db
            .select({
                count: sql<number>`cast(count(*) as int)`,
                avgSeverity: sql<number>`cast(avg(${medicationReports.severity}) as float)`,
                // Approximate avg side effects count by checking array length (Postgres specific)
                avgSideEffects: sql<number>`cast(avg(jsonb_array_length(${medicationReports.sideEffects})) as float)`,
                // Parse duration from text to hours using regex for common units (yr, mo, wk, d, h, min)
                // Supports decimals (e.g. 1.5 days) and uses word boundaries (\y) to avoid false positives (e.g. 'doses' matching 'd')
                avgDuration: sql<number>`cast(avg(
                    NULLIF(
                        COALESCE(cast(substring(${medicationReports.durationOfEffect} from '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*(?:yrs?|years?)\\y') as float) * 8760, 0) +
                        COALESCE(cast(substring(${medicationReports.durationOfEffect} from '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*(?:mos?|months?)\\y') as float) * 720, 0) +
                        COALESCE(cast(substring(${medicationReports.durationOfEffect} from '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*(?:wks?|weeks?)\\y') as float) * 168, 0) +
                        COALESCE(cast(substring(${medicationReports.durationOfEffect} from '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*(?:d|days?)\\y') as float) * 24, 0) +
                        COALESCE(cast(substring(${medicationReports.durationOfEffect} from '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*(?:h|hrs?|hours?)\\y') as float), 0) +
                        COALESCE(cast(substring(${medicationReports.durationOfEffect} from '(?i)([0-9]+(?:\\.[0-9]+)?)\\s*(?:min|mins?|minutes?)\\y') as float) / 60, 0)
                    , 0)
                ) as float)`,
                positiveCount: sql<number>`cast(count(case when jsonb_array_length(${medicationReports.positiveEffects}) > 0 then 1 end) as int)`
            })
            .from(medicationReports)
            .where(sql`${medicationReports.medicationName} ILIKE ${name}`);

        const data = stats[0];

        if (!data || data.count === 0) return null;

        return {
            name,
            count: data.count,
            avgSeverity: data.avgSeverity || 0,
            avgSideEffects: data.avgSideEffects || 0,
            avgDuration: data.avgDuration || 0,
            positiveRatio: data.count > 0 ? data.positiveCount / data.count : 0
        };
    }

    const [stats1, stats2] = await Promise.all([
        getStats(med1Name),
        getStats(med2Name)
    ]);

    if (!stats1 || !stats2) {
         return {
            med1: med1Name,
            med2: med2Name,
            comparison: null,
            error: 'One or both medications not found'
        };
    }

    return {
        med1: med1Name,
        med2: med2Name,
        comparison: {
            med1: stats1,
            med2: stats2
        }
    };
};
