import { fail, redirect } from '@sveltejs/kit';
import { createReport, hashIpAddress } from '$lib/server/db/reports.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const formData = await request.formData();

		// Extract form data
		const medicationName = formData.get('medicationName') as string;
		const sideEffectsRaw = formData.get('sideEffects') as string;
		const positiveEffectsRaw = formData.get('positiveEffects') as string;
		const severity = parseInt(formData.get('severity') as string);
		const age = formData.get('age') ? parseInt(formData.get('age') as string) : undefined;
		const gender = (formData.get('gender') as string) || undefined;
		const medicationDosage = (formData.get('medicationDosage') as string) || undefined;
		const durationOfEffect = (formData.get('durationOfEffect') as string) || undefined;
		const usageDuration = (formData.get('usageDuration') as string) || undefined;

		// Validate required fields
		if (!medicationName || !sideEffectsRaw || !severity) {
			return fail(400, {
				error: 'Medication name, side effects, and severity are required',
				medicationName,
				sideEffectsRaw,
				severity
			});
		}

		if (severity < 1 || severity > 10) {
			return fail(400, {
				error: 'Severity must be between 1 and 10',
				medicationName,
				sideEffectsRaw,
				severity
			});
		}

		// Parse side effects and positive effects
		const sideEffects = sideEffectsRaw
			.split(',')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		const positiveEffects = positiveEffectsRaw
			? positiveEffectsRaw
					.split(',')
					.map((s) => s.trim())
					.filter((s) => s.length > 0)
			: undefined;

		// Calculate age group if age is provided
		let ageGroup: string | undefined;
		if (age) {
			if (age < 18) ageGroup = '0-17';
			else if (age <= 25) ageGroup = '18-25';
			else if (age <= 35) ageGroup = '26-35';
			else if (age <= 50) ageGroup = '36-50';
			else if (age <= 65) ageGroup = '51-65';
			else ageGroup = '65+';
		}

		try {
			// Hash IP for abuse prevention (not for identification)
			const ipHash = hashIpAddress(getClientAddress());

			// Create the report
			await createReport({
				medicationName,
				medicationDosage,
				sideEffects,
				positiveEffects,
				severity,
				age,
				ageGroup,
				gender,
				durationOfEffect,
				usageDuration,
				ipHash,
				submissionSource: 'web_form'
			});

			return {
				success: true,
				message: 'Report submitted successfully'
			};
		} catch (error) {
			console.error('Error creating report:', error);
			return fail(500, {
				error: 'Failed to submit report. Please try again.',
				medicationName,
				sideEffectsRaw,
				severity
			});
		}
	}
};
