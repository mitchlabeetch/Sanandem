import { db } from './db';
import { user, session, type User, type Session } from './db/schema';
import { eq } from 'drizzle-orm';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const sessionData: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
	};
	await db.insert(session).values(sessionData);
	return sessionData;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({ user: user, session: session })
		.from(session)
		.innerJoin(user, eq(session.userId, user.id))
		.where(eq(session.id, sessionId));
	if (result.length < 1) {
		return { session: null, user: null };
	}
	const { user: userResult, session: sessionResult } = result[0];
	if (Date.now() >= sessionResult.expiresAt.getTime()) {
		await db.delete(session).where(eq(session.id, sessionResult.id));
		return { session: null, user: null };
	}
	if (Date.now() >= sessionResult.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		sessionResult.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(session)
			.set({
				expiresAt: sessionResult.expiresAt
			})
			.where(eq(session.id, sessionResult.id));
	}
	return { session: sessionResult, user: userResult };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await db.delete(session).where(eq(session.id, sessionId));
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
