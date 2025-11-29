import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db/index';
import { medicationReports } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const reports = await db.select().from(medicationReports).orderBy(desc(medicationReports.createdAt));
	return {
		reports
	};
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

		await db.insert(medicationReports).values({
			medicationName,
			sideEffect,
			severity,
			age,
			gender
		});

		return { success: true };
	},
	delete: async ({ request }) => {
		// Implement delete logic if needed
		return { success: true };
	}
};
