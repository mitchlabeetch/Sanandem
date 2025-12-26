import { getReports, getReportStatistics, getMedicationStatistics } from '$lib/server/db/reports.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		// Get recent reports (limit to 100 for performance)
		const reports = await getReports({ limit: 100 });

		// Get statistics
		const statistics = await getReportStatistics();
		const medicationStats = await getMedicationStatistics();

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
