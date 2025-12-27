#!/usr/bin/env node
/**
 * Generate Password Hash for Admin User
 * 
 * This script generates an Argon2 password hash for use with
 * the Sanandem admin authentication system.
 * 
 * Usage:
 *   node scripts/generate-password-hash.js
 * 
 * Or with a password argument:
 *   node scripts/generate-password-hash.js "MySecurePassword123!"
 */

import { hash } from '@node-rs/argon2';
import readline from 'readline';

async function generatePasswordHash(password) {
    try {
        const passwordHash = await hash(password, {
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1
        });
        
        console.log('\n====================================');
        console.log('Password Hash Generated Successfully');
        console.log('====================================\n');
        console.log('Hash:', passwordHash);
        console.log('\n');
        console.log('Use this hash in one of the following ways:');
        console.log('\n1. In create-admin.sql:');
        console.log(`   "password_hash": "${passwordHash}"`);
        console.log('\n2. As environment variable:');
        console.log(`   ADMIN_PASSWORD_HASH="${passwordHash}"`);
        console.log('\n3. Direct SQL insert:');
        console.log(`   INSERT INTO "user" (..., "password_hash", ...) VALUES (..., '${passwordHash}', ...);`);
        console.log('\n====================================\n');
        
    } catch (error) {
        console.error('Error generating password hash:', error);
        process.exit(1);
    }
}

async function promptPassword() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Enter password to hash: ', (password) => {
            rl.close();
            resolve(password);
        });
    });
}

async function main() {
    // Check if password provided as argument
    const password = process.argv[2];
    
    if (password) {
        await generatePasswordHash(password);
    } else {
        const inputPassword = await promptPassword();
        await generatePasswordHash(inputPassword);
    }
}

main();
