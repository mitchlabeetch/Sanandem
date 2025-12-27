import { json } from '@sveltejs/kit';
import { getReports, getReportStatistics, getMedicationStatistics } from '$lib/server/db/reports.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const limit = parseInt(url.searchParams.get('limit') || '50');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const gender = url.searchParams.get('gender') || undefined;
	const minSeverity = url.searchParams.get('minSeverity')
		? parseInt(url.searchParams.get('minSeverity')!)
		: undefined;
	const medicationName = url.searchParams.get('medicationName') || undefined;

	try {
		const reports = await getReports({
			limit,
			offset,
			gender,
			minSeverity,
			medicationName
		});

		const statistics = await getReportStatistics();
		const medicationStats = await getMedicationStatistics();

		return json({
			reports,
			statistics,
			medicationStats,
			pagination: {
				limit,
				offset,
				count: reports.length
			}
		});
	} catch (error) {
		console.error('Error fetching reports:', error);
		return json(
			{
				error: 'Failed to fetch reports'
			},
			{ status: 500 }
		);
	}
};
