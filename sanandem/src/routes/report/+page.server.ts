import { fail, redirect } from '@sveltejs/kit';
import { createReport, hashIpAddress } from '$lib/server/db/reports.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const formData = await request.formData();

		// Helper to sanitize and trim strings
		const clean = (val: FormDataEntryValue | null) => {
			if (typeof val === 'string') return val.trim();
			return undefined;
		};

		// Extract form data
		const medicationName = clean(formData.get('medicationName'));
		const sideEffectsRaw = clean(formData.get('sideEffects'));
		const positiveEffectsRaw = clean(formData.get('positiveEffects'));
		const severityVal = clean(formData.get('severity'));
		const severity = severityVal ? parseInt(severityVal) : NaN;

		const ageVal = clean(formData.get('age'));
		const age = ageVal ? parseInt(ageVal) : undefined;

		const gender = clean(formData.get('gender')) || undefined;
		const medicationDosage = clean(formData.get('medicationDosage')) || undefined;
		const durationOfEffect = clean(formData.get('durationOfEffect')) || undefined;
		const usageDuration = clean(formData.get('usageDuration')) || undefined;

		// Validate required fields
		if (!medicationName || !sideEffectsRaw || isNaN(severity)) {
			return fail(400, {
				error: 'Medication name, side effects, and severity are required',
				medicationName,
				sideEffectsRaw,
				severity: severityVal
			});
		}

        // Basic length validation
        if (medicationName.length > 255) {
             return fail(400, {
                error: 'Medication name is too long',
                medicationName,
				sideEffectsRaw,
				severity: severityVal
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
			.filter((s) => s.length > 0 && s.length <= 100); // Also limit effect length

		const positiveEffects = positiveEffectsRaw
			? positiveEffectsRaw
					.split(',')
					.map((s) => s.trim())
					.filter((s) => s.length > 0 && s.length <= 100)
			: undefined;

        if (sideEffects.length === 0) {
            return fail(400, {
				error: 'At least one valid side effect is required',
				medicationName,
				sideEffectsRaw,
				severity
			});
        }

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
