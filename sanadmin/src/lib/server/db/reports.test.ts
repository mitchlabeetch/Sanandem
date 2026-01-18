import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getReports } from './reports';

// Mock objects
const { queryMock } = vi.hoisted(() => {
    return {
        queryMock: {
            where: vi.fn().mockReturnThis(),
            orderBy: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            offset: vi.fn().mockReturnThis(),
            then: vi.fn((resolve) => resolve([])), // To make it awaitable
        }
    };
});

// Mock the db module
vi.mock('./index.js', () => {
    return {
        db: {
            select: vi.fn().mockReturnValue({
                from: vi.fn().mockReturnValue(queryMock)
            }),
        }
    };
});

// Mock schema.js
vi.mock('./schema.js', () => ({
    medicationReports: {
        createdAt: 'createdAt',
        age: 'age',
        severity: 'severity',
        medicationName: 'medicationName',
        isVerified: 'isVerified',
        gender: 'gender',
    },
    auditLog: {}
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
    eq: vi.fn(),
    desc: vi.fn(),
    and: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    sql: vi.fn((strings, ...values) => 'sql-mock'),
}));

describe('getReports', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should apply limit and offset if provided', async () => {
        const limit = 10;
        const offset = 20;

        await getReports({ limit, offset });

        expect(queryMock.limit).toHaveBeenCalledWith(limit);
        expect(queryMock.offset).toHaveBeenCalledWith(offset);
    });

    it('should not apply limit and offset if not provided', async () => {
        await getReports({});

        expect(queryMock.limit).not.toHaveBeenCalled();
        expect(queryMock.offset).not.toHaveBeenCalled();
    });
});
