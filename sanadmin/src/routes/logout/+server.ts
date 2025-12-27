import { invalidateSession } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
	if (!locals.session) {
		return fail(401);
	}
	await invalidateSession(locals.session.id);
	cookies.delete('session', { path: '/' });
	throw redirect(302, '/login');
};

function fail(status: number) {
    return new Response(null, { status });
}
