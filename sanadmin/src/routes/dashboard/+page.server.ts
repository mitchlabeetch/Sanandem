import { fail } from '@sveltejs/kit';
import { getReports, getReportStatistics, createReport, deleteReport } from '$lib/server/db/reports.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
	    const reports = await getReports({ limit: 100 });
		const statistics = await getReportStatistics();
	    return {
		    reports,
			statistics
	    };
    } catch (e) {
        console.error("DB connection failed, using mock data", e);
        return {
            reports: [],
			statistics: {
				totalReports: 0,
				byGender: [],
				bySeverity: [],
				byAgeGroup: []
			}
        };
    }
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const medicationName = formData.get('medicationName') as string;
		const sideEffect = formData.get('sideEffect') as string;
		const severity = parseInt(formData.get('severity') as string);
		const age = parseInt(formData.get('age') as string);
		const gender = formData.get('gender') as string;

		if (!medicationName || !sideEffect || isNaN(severity) || isNaN(age) || !gender) {
			return fail(400, { missing: true });
		}

        try {
			// Calculate age group
			let ageGroup: string;
			if (age < 18) ageGroup = '0-17';
			else if (age <= 25) ageGroup = '18-25';
			else if (age <= 35) ageGroup = '26-35';
			else if (age <= 50) ageGroup = '36-50';
			else if (age <= 65) ageGroup = '51-65';
			else ageGroup = '65+';

		    await createReport({
			    medicationName,
			    sideEffects: [sideEffect],
			    severity,
			    age,
				ageGroup,
			    gender,
				submissionSource: 'admin_panel'
		    });
        } catch (e) {
            console.error("DB insert failed", e);
            return fail(500, { error: 'Failed to create report' });
        }

		return { success: true };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = parseInt(formData.get('id') as string);

		if (!id || isNaN(id)) {
			return fail(400, { error: 'Invalid ID' });
		}

		try {
			await deleteReport(id);
			return { success: true };
		} catch (e) {
			console.error("DB delete failed", e);
			return fail(500, { error: 'Failed to delete report' });
		}
	}
};
