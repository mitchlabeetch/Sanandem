
import { describe, it, expect, vi } from 'vitest';
import { getReportStatistics } from '$lib/server/db/reports';
import { db } from '$lib/server/db';

// Mock the db module
vi.mock('$lib/server/db', () => ({
    db: {
        select: vi.fn(),
    }
}));

describe('getReportStatistics', () => {
    it('should return total reports count correctly as a number even if DB returns string', async () => {
        const selectMock = vi.mocked(db.select);

        const fromMock = vi.fn();

        selectMock.mockReturnValue({
            from: fromMock
        } as any);

        // 1. totalReports - Simulate DB returning a string for BigInt/count
        fromMock.mockReturnValueOnce(Promise.resolve([{ count: '123' }]));

        // 2. byGender
        fromMock.mockReturnValueOnce({
            groupBy: vi.fn().mockResolvedValue([{ gender: 'Male', count: 50 }])
        } as any);

        // 3. bySeverity
        fromMock.mockReturnValueOnce({
            groupBy: vi.fn().mockReturnValue({
                orderBy: vi.fn().mockResolvedValue([{ severity: 5, count: 20 }])
            })
        } as any);

        // 4. byAgeGroup
        fromMock.mockReturnValueOnce({
            where: vi.fn().mockReturnValue({
                groupBy: vi.fn().mockResolvedValue([{ ageGroup: '18-25', count: 30 }])
            })
        } as any);

        const stats = await getReportStatistics();

        // Expect strict equality to a number
        expect(stats.totalReports).toBe(123);
        expect(typeof stats.totalReports).toBe('number');
        expect(stats.byGender).toEqual([{ gender: 'Male', count: 50 }]);
    });

    it('should handle empty total reports (0 count)', async () => {
         const selectMock = vi.mocked(db.select);
         const fromMock = vi.fn();

         selectMock.mockReturnValue({ from: fromMock } as any);

         // 1. totalReports
         fromMock.mockReturnValueOnce(Promise.resolve([]));

         // 2. byGender
         fromMock.mockReturnValueOnce({
             groupBy: vi.fn().mockResolvedValue([])
         } as any);

         // 3. bySeverity
         fromMock.mockReturnValueOnce({
             groupBy: vi.fn().mockReturnValue({
                 orderBy: vi.fn().mockResolvedValue([])
             })
         } as any);

         // 4. byAgeGroup
         fromMock.mockReturnValueOnce({
            where: vi.fn().mockReturnValue({
                groupBy: vi.fn().mockResolvedValue([])
            })
        } as any);

         const stats = await getReportStatistics();
         expect(stats.totalReports).toBe(0);
         expect(typeof stats.totalReports).toBe('number');
    });
});
