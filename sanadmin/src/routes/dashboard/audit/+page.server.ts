import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { auditLog, user } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ url, locals }) => {
    // Basic authorization check
    if (!locals.user) {
        return { logs: [], total: 0 };
    }

    const page = Number(url.searchParams.get('page') || '1');
    const limit = Number(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    try {
        const logs = await db.select({
            id: auditLog.id,
            action: auditLog.action,
            entityType: auditLog.entityType,
            entityId: auditLog.entityId,
            details: auditLog.details,
            ipAddress: auditLog.ipAddress,
            createdAt: auditLog.createdAt,
            username: user.username
        })
        .from(auditLog)
        .leftJoin(user, eq(auditLog.userId, user.id))
        .orderBy(desc(auditLog.createdAt))
        .limit(limit)
        .offset(offset);

        return {
            logs,
            page,
            limit
        };
    } catch (e) {
        console.error('Error fetching audit logs:', e);
        return { logs: [], page, limit, error: 'Failed to fetch logs' };
    }
};
