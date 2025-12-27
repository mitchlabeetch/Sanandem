import { validateSessionToken } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		event.locals.session = null;

        if (event.url.pathname.startsWith('/dashboard')) {
            return new Response(null, {
                status: 302,
                headers: { Location: '/login' }
            });
        }

		return resolve(event);
	}

	const { session, user } = await validateSessionToken(token);
	if (session !== null) {
		event.cookies.set('session', token, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: import.meta.env.PROD,
			expires: session.expiresAt
		});
	} else {
		event.cookies.delete('session', { path: '/' });
	}

	event.locals.session = session;
	event.locals.user = user;

    if (event.url.pathname.startsWith('/dashboard') && !event.locals.user) {
        return new Response(null, {
            status: 302,
            headers: { Location: '/login' }
        });
    }

	return resolve(event);
};
