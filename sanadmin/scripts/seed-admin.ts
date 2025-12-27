import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../src/lib/server/db/schema.js';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { user } from '../src/lib/server/db/schema.js';

// Load env vars if needed, but assuming DATABASE_URL is in environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

async function seedAdmin() {
    console.log('Seeding admin user...');

    const username = 'admin';
    const password = 'password123'; // Change this in production!

    const existingUser = await db.query.user.findFirst({
        where: eq(user.username, username)
    });

    if (existingUser) {
        console.log('Admin user already exists.');
        await client.end();
        process.exit(0);
    }

    const passwordHash = await hash(password, {
        // recommended minimum parameters
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });

    const userId = uuidv4();

    await db.insert(user).values({
        id: userId,
        username,
        passwordHash,
        role: 'superadmin'
    });

    console.log('Admin user created successfully.');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    await client.end();
    process.exit(0);
}

seedAdmin().catch(async (err) => {
    console.error('Error seeding admin user:', err);
    await client.end();
    process.exit(1);
});
