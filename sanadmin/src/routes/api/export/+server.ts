import { json } from '@sveltejs/kit';
import { getReportsStream, type ReportFilters } from '$lib/server/db/reports.js';
import type { RequestHandler } from './$types';

function getCSVRow(report: any): string {
	const row = [
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
	];

	return row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',');
}

function streamCSV(stream: AsyncGenerator<any>): ReadableStream {
	const encoder = new TextEncoder();
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

	return new ReadableStream({
		async start(controller) {
			controller.enqueue(encoder.encode(headers.join(',') + '\n'));

			for await (const report of stream) {
				const line = getCSVRow(report) + '\n';
				controller.enqueue(encoder.encode(line));
			}
			controller.close();
		}
	});
}

function getAnonymizedReport(report: any) {
	return {
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
	};
}

function streamJSON(stream: AsyncGenerator<any>): ReadableStream {
	const encoder = new TextEncoder();
	return new ReadableStream({
		async start(controller) {
			controller.enqueue(encoder.encode('[\n'));
			let first = true;
			for await (const report of stream) {
				if (!first) {
					controller.enqueue(encoder.encode(',\n'));
				}
				const anonymized = getAnonymizedReport(report);
				controller.enqueue(encoder.encode('  ' + JSON.stringify(anonymized)));
				first = false;
			}
			controller.enqueue(encoder.encode('\n]'));
			controller.close();
		}
	});
}

export const GET: RequestHandler = async ({ url }) => {
	const format = url.searchParams.get('format') || 'json';
	// Increase default limit or remove it for export?
	// The original had a default of 10000. We keep it but users can request more now safely.
	const limitParam = url.searchParams.get('limit');
	const limit = limitParam ? parseInt(limitParam) : 10000;

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

		const stream = getReportsStream(filters);

		if (format === 'csv') {
			return new Response(streamCSV(stream), {
				headers: {
					'Content-Type': 'text/csv',
					'Content-Disposition': `attachment; filename="medication-reports-${new Date().toISOString().split('T')[0]}.csv"`
				}
			});
		} else if (format === 'json') {
			return new Response(streamJSON(stream), {
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
