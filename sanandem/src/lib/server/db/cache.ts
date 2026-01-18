import { db } from './index.js';
import { statisticsCache, type StatisticsCache } from './schema.js';
import { eq, lt } from 'drizzle-orm';

/**
 * Get cached data by key
 * @param key The cache key
 * @returns The cached data or null if not found/expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
    // Probabilistic cleanup (e.g., 1% of requests) to remove other expired entries
    // This prevents the table from growing indefinitely with expired data.
    // We do this asynchronously and don't await it to avoid blocking the read.
    if (Math.random() < 0.01) {
        db.delete(statisticsCache)
            .where(lt(statisticsCache.expiresAt, new Date()))
            .catch((err) => console.error('Error in background cache cleanup:', err));
    }

    try {
        const result = await db.select().from(statisticsCache).where(eq(statisticsCache.cacheKey, key));

        if (result.length > 0) {
            const entry = result[0];
            // Lazy expiration check
            if (entry.expiresAt < new Date()) {
                // Delete the specific expired entry
                // We don't await this to keep the response fast, or we can await if consistency is critical.
                // Given "every millisecond counts", we'll do it asynchronously but safely catch errors.
                db.delete(statisticsCache)
                    .where(eq(statisticsCache.cacheKey, key))
                    .catch((err) => console.error('Error deleting expired cache entry:', err));
                return null;
            }
            return entry.cacheData as T;
        }

        return null;
    } catch (error) {
        console.error('Error fetching from cache:', error);
        return null; // Fail gracefully
    }
}

/**
 * Set cached data
 * @param key The cache key
 * @param data The data to cache
 * @param ttlSeconds Time to live in seconds (default: 1 hour)
 */
export async function setCachedData(key: string, data: any, ttlSeconds: number = 3600): Promise<void> {
    try {
        const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

        await db.insert(statisticsCache)
            .values({
                cacheKey: key,
                cacheData: data,
                expiresAt
            })
            .onConflictDoUpdate({
                target: statisticsCache.cacheKey,
                set: {
                    cacheData: data,
                    expiresAt
                }
            });
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

/**
 * Invalidate a cache key
 * @param key The cache key to delete
 */
export async function invalidateCache(key: string): Promise<void> {
    try {
        await db.delete(statisticsCache).where(eq(statisticsCache.cacheKey, key));
    } catch (error) {
        console.error('Error invalidating cache:', error);
    }
}
