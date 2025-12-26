import { json } from '@sveltejs/kit';
import { getReports, type ReportFilters } from '$lib/server/db/reports.js';
import type { RequestHandler } from './$types';

/**
 * Export reports as CSV (fully anonymized)
 */
function exportCSV(reports: any[]): string {
	const headers = [
		'Medication Name',
		'Side Effects',
		'Positive Effects',
		'Severity',
		'Age Group',
		'Gender',
		'Duration of Effect',
		'Created Year'
	];

	const rows = reports.map((report) => [
		report.medicationName,
		Array.isArray(report.sideEffects) ? report.sideEffects.join('; ') : report.sideEffects || '',
		Array.isArray(report.positiveEffects)
			? report.positiveEffects.join('; ')
			: report.positiveEffects || '',
		report.severity,
		report.ageGroup || 'Unknown',
		report.gender || 'Unknown',
		report.durationOfEffect || 'Unknown',
		new Date(report.createdAt).getFullYear()
	]);

	const csvContent = [
		headers.join(','),
		...rows.map((row) =>
			row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
		)
	].join('\n');

	return csvContent;
}

/**
 * Export reports as JSON (fully anonymized)
 */
function exportJSON(reports: any[]): string {
	// Fully anonymize - remove any IDs, exact ages, timestamps
	const anonymized = reports.map((report) => ({
		medicationName: report.medicationName,
		medicationDosage: report.medicationDosage,
		sideEffects: report.sideEffects,
		positiveEffects: report.positiveEffects,
		severity: report.severity,
		ageGroup: report.ageGroup || 'Unknown',
		gender: report.gender || 'Unknown',
		durationOfEffect: report.durationOfEffect,
		usageDuration: report.usageDuration,
		year: new Date(report.createdAt).getFullYear()
	}));

	return JSON.stringify(
		{
			metadata: {
				exportDate: new Date().toISOString(),
				recordCount: anonymized.length,
				disclaimer:
					'This data is provided for research purposes only. Always consult healthcare professionals for medical advice.'
			},
			data: anonymized
		},
		null,
		2
	);
}

export const GET: RequestHandler = async ({ url }) => {
	const format = url.searchParams.get('format') || 'json';
	const limit = Math.min(parseInt(url.searchParams.get('limit') || '1000'), 5000); // Max 5000 for public
	const gender = url.searchParams.get('gender') || undefined;
	const minSeverity = url.searchParams.get('minSeverity')
		? parseInt(url.searchParams.get('minSeverity')!)
		: undefined;
	const medicationName = url.searchParams.get('medicationName') || undefined;

	try {
		const filters: ReportFilters = {
			limit,
			gender,
			minSeverity,
			medicationName
		};

		const reports = await getReports(filters);

		if (format === 'csv') {
			const csvContent = exportCSV(reports);
			return new Response(csvContent, {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="sanandem-data-${new Date().toISOString().split('T')[0]}.csv"`
				}
			});
		} else if (format === 'json') {
			const jsonContent = exportJSON(reports);
			return new Response(jsonContent, {
				headers: {
					'Content-Type': 'application/json',
					'Content-Disposition': `attachment; filename="sanandem-data-${new Date().toISOString().split('T')[0]}.json"`
				}
			});
		} else {
			return json({ error: 'Invalid format. Use csv or json.' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error exporting data:', error);
		return json({ error: 'Failed to export data' }, { status: 500 });
	}
};
