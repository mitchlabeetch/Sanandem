import { json } from '@sveltejs/kit';
import { getReports, type ReportFilters } from '$lib/server/db/reports.js';
import type { RequestHandler } from './$types';

/**
 * Export reports as CSV
 */
function exportCSV(reports: any[]): string {
	const headers = [
		'ID',
		'Medication Name',
		'Side Effects',
		'Positive Effects',
		'Severity',
		'Age',
		'Age Group',
		'Gender',
		'Duration of Effect',
		'Usage Duration',
		'Created At',
		'Verified'
	];

	const rows = reports.map((report) => [
		report.id,
		report.medicationName,
		Array.isArray(report.sideEffects) ? report.sideEffects.join('; ') : report.sideEffects || '',
		Array.isArray(report.positiveEffects)
			? report.positiveEffects.join('; ')
			: report.positiveEffects || '',
		report.severity,
		report.age || '',
		report.ageGroup || '',
		report.gender || '',
		report.durationOfEffect || '',
		report.usageDuration || '',
		new Date(report.createdAt).toISOString(),
		report.isVerified ? 'Yes' : 'No'
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
 * Export reports as JSON
 */
function exportJSON(reports: any[]): string {
	// Anonymize any potentially identifying data
	const anonymized = reports.map((report) => ({
		id: report.id,
		medicationName: report.medicationName,
		medicationDosage: report.medicationDosage,
		sideEffects: report.sideEffects,
		positiveEffects: report.positiveEffects,
		severity: report.severity,
		age: report.age,
		ageGroup: report.ageGroup,
		gender: report.gender,
		durationOfEffect: report.durationOfEffect,
		usageDuration: report.usageDuration,
		createdAt: report.createdAt,
		isVerified: report.isVerified
	}));

	return JSON.stringify(anonymized, null, 2);
}

export const GET: RequestHandler = async ({ url }) => {
	const format = url.searchParams.get('format') || 'json';
	const limit = parseInt(url.searchParams.get('limit') || '10000');
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
					'Content-Disposition': `attachment; filename="medication-reports-${new Date().toISOString().split('T')[0]}.csv"`
				}
			});
		} else if (format === 'json') {
			const jsonContent = exportJSON(reports);
			return new Response(jsonContent, {
				headers: {
					'Content-Type': 'application/json',
					'Content-Disposition': `attachment; filename="medication-reports-${new Date().toISOString().split('T')[0]}.json"`
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
