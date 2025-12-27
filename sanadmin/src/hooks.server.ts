import { validateSessionToken } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export const handle: Handle = async ({ event, resolve }) => {
    // Rate Limiting for Login
    if (event.request.method === 'POST' && event.url.pathname === '/login') {
        const ip = event.getClientAddress();
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const limit = 5;

        const record = rateLimitMap.get(ip);

        if (record) {
            if (now > record.expiresAt) {
                rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
            } else {
                if (record.count >= limit) {
                    return new Response('Too Many Requests', { status: 429 });
                }
                record.count++;
            }
        } else {
            rateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
        }

        // Cleanup old entries
        if (Math.random() < 0.01) {
            for (const [key, val] of rateLimitMap.entries()) {
                if (Date.now() > val.expiresAt) {
                    rateLimitMap.delete(key);
                }
            }
        }
    }

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

		// resolve(event) called at the end
	} else {
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
    }

	const response = await resolve(event);

    // Security Headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';");

    return response;
};
