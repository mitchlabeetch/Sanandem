import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { medicationReports, statisticsCache, auditLog } from '$lib/server/db/schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    return {};
};

export const actions: Actions = {
    clearCache: async ({ locals }) => {
        if (!locals.user) return fail(401);

        try {
            await db.delete(statisticsCache);

            // Log action
            await db.insert(auditLog).values({
                userId: locals.user.id,
                action: 'clear_cache',
                entityType: 'system',
                entityId: 'cache',
                ipAddress: '127.0.0.1' // In real app, get from request
            });

            return { success: true, message: 'Cache cleared successfully' };
        } catch (e) {
            console.error('Failed to clear cache', e);
            return fail(500, { error: 'Failed to clear cache' });
        }
    },

    backup: async ({ locals }) => {
        if (!locals.user) return fail(401);

        try {
            const reports = await db.select().from(medicationReports);
            const data = JSON.stringify(reports, null, 2);

             // Log action
            await db.insert(auditLog).values({
                userId: locals.user.id,
                action: 'create_backup',
                entityType: 'system',
                entityId: 'backup',
                details: { count: reports.length },
                ipAddress: '127.0.0.1'
            });

            return {
                success: true,
                download: true,
                filename: `sanandem_backup_${new Date().toISOString().split('T')[0]}.json`,
                data
            };
        } catch (e) {
            console.error('Backup failed', e);
            return fail(500, { error: 'Backup failed' });
        }
    }
};
