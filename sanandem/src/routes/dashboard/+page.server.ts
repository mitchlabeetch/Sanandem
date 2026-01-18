import { getReports, getReportStatistics, getMedicationStatistics } from '$lib/server/db/reports.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async () => {
	try {
		// Fetch data in parallel for better performance
		const [reports, statistics, medicationStats] = await Promise.all([
			getReports({ limit: 100 }),
			getReportStatistics(),
			getMedicationStatistics()
		]);

		return {
			reports,
			statistics,
			medicationStats
		};
	} catch (error) {
		console.error('Error loading dashboard data:', error);
		// Return empty data if database isn't configured
		return {
			reports: [],
			statistics: {
				totalReports: 0,
				byGender: [],
				bySeverity: [],
				byAgeGroup: []
			},
			medicationStats: []
		};
	}
};
