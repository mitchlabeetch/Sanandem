import { describe, it, expect, vi } from 'vitest';

// We can't easily import the hooks directly because they depend on SvelteKit internals that are hard to mock in isolation without a complex setup.
// Instead, we will perform a "black box" test by running the dev server and making requests.
// BUT, since we are in a script, we can also just test the logic if we extract it.
// However, the simplest way to verify "it works" in this environment is to spin up the server and hit it.

async function testSecurity() {
    console.log('Starting security tests...');

    // Check Sanadmin Rate Limiting
    console.log('\nTesting Sanadmin Rate Limiting (/login)...');
    const loginUrl = 'http://localhost:5174/login';

    // Send 6 requests
    for (let i = 1; i <= 6; i++) {
        try {
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'username=admin&password=wrongpassword'
            });
            console.log(`Request ${i}: Status ${res.status}`);

            if (i <= 5) {
                if (res.status === 400 || res.status === 200 || res.status === 302) {
                    // 400 is expected for invalid credentials/bad request, 200 for page load (if GET), 302 for redirect
                    // Since we are POSTing, we expect 200 (validation fail render) or 302 (success) or 400 (fail).
                    // Our current login logic returns 400 'fail' for bad params or bad auth.
                }
            } else {
                if (res.status === 429) {
                    console.log('✅ Rate limiting working: Got 429 Too Many Requests');
                } else {
                    console.error(`❌ Rate limiting failed: Expected 429, got ${res.status}`);
                    process.exit(1);
                }
            }

            // Check headers on the first response
            if (i === 1) {
                const headers = res.headers;
                if (headers.get('X-Frame-Options') === 'DENY' &&
                    headers.get('X-Content-Type-Options') === 'nosniff' &&
                    headers.get('Content-Security-Policy')) {
                    console.log('✅ Security headers present');
                } else {
                    console.error('❌ Security headers missing');
                    console.log('X-Frame-Options:', headers.get('X-Frame-Options'));
                    console.log('Content-Security-Policy:', headers.get('Content-Security-Policy'));
                    process.exit(1);
                }
            }

        } catch (e) {
            console.error(`Request ${i} failed:`, e);
        }
    }
}

testSecurity().catch(console.error);
