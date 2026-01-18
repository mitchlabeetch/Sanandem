
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedData, setCachedData, invalidateCache } from './cache';
import { db } from './index';
import { statisticsCache } from './schema';
import { eq, lt } from 'drizzle-orm';

// Mock dependencies
vi.mock('./index', () => ({
    db: {
        select: vi.fn(() => ({
            from: vi.fn(),
        })),
        insert: vi.fn(() => ({
            values: vi.fn(),
        })),
        delete: vi.fn(() => ({
            where: vi.fn(),
        })),
    },
}));

vi.mock('drizzle-orm', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        eq: vi.fn(),
        lt: vi.fn(),
    };
});

describe('Cache Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    it('should return null and delete entry if expired', async () => {
        const key = 'test-key';
        const expiredDate = new Date(Date.now() - 1000); // 1 second ago

        const mockEntry = {
            cacheKey: key,
            cacheData: { foo: 'bar' },
            expiresAt: expiredDate,
        };

        // Mock db.select().from().where() chain
        const fromMock = vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockEntry]),
        });

        // Setup db.select chain
        (db.select as any).mockReturnValue({
            from: fromMock,
        });

        // Mock db.delete chain
        const whereChain = {
             catch: vi.fn(),
             then: vi.fn(),
        };
        const deleteBuilder = {
            where: vi.fn().mockReturnValue(whereChain),
        };
        (db.delete as any).mockReturnValue(deleteBuilder);

        const result = await getCachedData(key);

        expect(result).toBeNull();

        // Verify delete was called
        expect(db.delete).toHaveBeenCalledWith(statisticsCache);
        expect(deleteBuilder.where).toHaveBeenCalled();
    });

    it('should return data if not expired', async () => {
        const key = 'test-key';
        const futureDate = new Date(Date.now() + 10000); // 10 seconds in future

        const mockEntry = {
            cacheKey: key,
            cacheData: { foo: 'bar' },
            expiresAt: futureDate,
        };

        const fromMock = vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockEntry]),
        });

        (db.select as any).mockReturnValue({
            from: fromMock,
        });

        const result = await getCachedData<any>(key);

        expect(result).toEqual({ foo: 'bar' });
        // db.delete might be called due to probabilistic cleanup, so we shouldn't assert not.toHaveBeenCalled()
        // unless we force random to be high.
    });

    it('should handle probabilistic cleanup on hit', async () => {
        const key = 'hit-key';
        const futureDate = new Date(Date.now() + 10000);

        const mockEntry = {
            cacheKey: key,
            cacheData: { foo: 'bar' },
            expiresAt: futureDate,
        };

        const fromMock = vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockEntry]),
        });

        (db.select as any).mockReturnValue({
            from: fromMock,
        });

        // Force Math.random to trigger cleanup
        vi.spyOn(Math, 'random').mockReturnValue(0.005); // < 0.01

        const whereChain = {
             catch: vi.fn(),
             then: vi.fn(),
        };
        const deleteBuilder = {
            where: vi.fn().mockReturnValue(whereChain),
        };
        (db.delete as any).mockReturnValue(deleteBuilder);

        const result = await getCachedData(key);

        expect(result).toEqual({ foo: 'bar' });
        expect(db.delete).toHaveBeenCalledWith(statisticsCache);
        // It's hard to distinguish which delete call it was (lazy vs probabilistic) just by toHaveBeenCalledWith(statisticsCache)
        // But since it's a hit and not expired, the lazy check won't run.
        // So if delete is called, it MUST be the probabilistic cleanup.
    });

     it('should not handle probabilistic cleanup if random > 0.01', async () => {
        const key = 'hit-key';
        const futureDate = new Date(Date.now() + 10000);

        const mockEntry = {
            cacheKey: key,
            cacheData: { foo: 'bar' },
            expiresAt: futureDate,
        };

        const fromMock = vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([mockEntry]),
        });

        (db.select as any).mockReturnValue({
            from: fromMock,
        });

        // Force Math.random to NOT trigger cleanup
        vi.spyOn(Math, 'random').mockReturnValue(0.5);

        const deleteMock = {
            where: vi.fn(),
        };
        (db.delete as any).mockReturnValue(deleteMock);

        const result = await getCachedData(key);

        expect(result).toEqual({ foo: 'bar' });
        expect(db.delete).not.toHaveBeenCalled();
    });
});
