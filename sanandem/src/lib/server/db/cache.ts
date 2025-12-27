import { db } from './index';
import { statisticsCache, type StatisticsCache } from './schema';
import { eq, lt } from 'drizzle-orm';

/**
 * Get cached data by key
 * @param key The cache key
 * @returns The cached data or null if not found/expired
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        // Clean up expired cache entries first (lazy cleanup)
        // In a high-traffic app, this might be a scheduled job instead
        await db.delete(statisticsCache).where(lt(statisticsCache.expiresAt, new Date()));

        const result = await db.select().from(statisticsCache).where(eq(statisticsCache.cacheKey, key));

        if (result.length > 0) {
            return result[0].cacheData as T;
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
