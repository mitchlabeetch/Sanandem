#!/usr/bin/env node
/**
 * Generate Secret Keys for Environment Variables
 * 
 * This script generates secure random keys for use in
 * environment variables (IP_SALT, SESSION_SECRET, etc.)
 * 
 * Usage:
 *   node scripts/generate-secrets.js
 */

import { randomBytes } from 'crypto';

function generateSecret(length = 32) {
    return randomBytes(length).toString('hex');
}

console.log('\n====================================');
console.log('Sanandem Secret Keys Generator');
console.log('====================================\n');

const ipSalt = generateSecret(32);
const sessionSecret = generateSecret(32);
const apiKey = generateSecret(24);

console.log('Generated secrets for your .env files:\n');

console.log('# For both sanandem and sanadmin');
console.log(`IP_SALT="${ipSalt}"`);
console.log('');

console.log('# For sanadmin only');
console.log(`SESSION_SECRET="${sessionSecret}"`);
console.log('');

console.log('# Optional: For API authentication');
console.log(`API_KEY="${apiKey}"`);
console.log('');

console.log('====================================');
console.log('IMPORTANT: Keep these secrets safe!');
console.log('====================================\n');
console.log('Security tips:');
console.log('  - Never commit these secrets to git');
console.log('  - Use different secrets for dev/staging/production');
console.log('  - Store production secrets securely (environment variables)');
console.log('  - Rotate secrets periodically');
console.log('  - Use the same IP_SALT for both apps\n');
