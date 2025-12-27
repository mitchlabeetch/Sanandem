import type { Handle } from '@sveltejs/kit';

const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export const handle: Handle = async ({ event, resolve }) => {
	// Rate Limiting
	if (event.request.method === 'POST' && event.url.pathname === '/report') {
		const ip = event.getClientAddress();
		const now = Date.now();
		const windowMs = 15 * 60 * 1000; // 15 minutes
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

        // Cleanup old entries occasionally (simple optimization)
        if (Math.random() < 0.01) {
            for (const [key, val] of rateLimitMap.entries()) {
                if (Date.now() > val.expiresAt) {
                    rateLimitMap.delete(key);
                }
            }
        }
	}

	const response = await resolve(event);

	// Security Headers
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-XSS-Protection', '1; mode=block');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    // Basic CSP - adjust as needed for external resources
	response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';");

	return response;
};
