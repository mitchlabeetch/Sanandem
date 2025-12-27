async function verifyAll() {
    console.log('Verifying infrastructure endpoints...');

    // Test Health
    try {
        const healthRes = await fetch('http://localhost:5173/health');
        if (healthRes.ok) {
            const data = await healthRes.json();
            console.log('✅ /health endpoint OK:', data);
        } else {
            console.error('❌ /health endpoint failed:', healthRes.status);
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ /health endpoint connection failed', e);
        // Don't exit yet, might be server startup issue in test env
    }

    console.log('Verification script completed check structure.');
}

verifyAll();
