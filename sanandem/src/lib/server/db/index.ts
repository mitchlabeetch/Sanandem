import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import { env } from '$env/dynamic/private';

// Mock DB for build/test if no URL provided
const connectionString = env.DATABASE_URL || 'postgres://user:pass@localhost:5432/db';
const client = postgres(connectionString);

export const db = drizzle(client, { schema });
