import { describe, it, expect, vi, beforeEach } from 'vitest';

// Move mockDb inside the mock factory or use vi.fn() directly inside
vi.mock('$lib/server/db', () => ({
    db: {
        query: {
            user: {
                findFirst: vi.fn()
            }
        },
        insert: vi.fn().mockReturnValue({ values: vi.fn() }),
        delete: vi.fn().mockReturnValue({ where: vi.fn() }),
        update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn() }) }),
        select: vi.fn().mockReturnValue({
            from: vi.fn().mockReturnValue({
                innerJoin: vi.fn().mockReturnValue({
                    where: vi.fn()
                })
            })
        })
    }
}));

vi.mock('$lib/server/db/schema', () => ({
    user: { id: 'id', username: 'username', passwordHash: 'passwordHash' },
    session: { id: 'id', userId: 'userId', expiresAt: 'expiresAt' }
}));

// Mock Argon2
vi.mock('@node-rs/argon2', () => ({
    verify: vi.fn().mockResolvedValue(true)
}));

// Mock Oslo
vi.mock('@oslojs/crypto/sha2', () => ({
    sha256: vi.fn()
}));
vi.mock('@oslojs/encoding', () => ({
    encodeBase32LowerCaseNoPadding: vi.fn().mockReturnValue('mocked-token'),
    encodeHexLowerCase: vi.fn().mockReturnValue('mocked-session-id')
}));

import { actions } from './+page.server';
import { db } from '$lib/server/db'; // Import the mocked db to access spies

describe('Login Actions', () => {
    let mockRequest;
    let mockCookies;

    beforeEach(() => {
        vi.clearAllMocks();
        mockRequest = {
            formData: vi.fn()
        };
        mockCookies = {
            set: vi.fn()
        };
    });

    it('should validate username length', async () => {
        mockRequest.formData.mockResolvedValue(new Map([['username', 'ab'], ['password', 'password123']]));

        const result = await actions.default({ request: mockRequest, cookies: mockCookies } as any);

        expect(result).toEqual(expect.objectContaining({
            status: 400,
            data: { message: 'Invalid username' }
        }));
    });

    it('should validate password length', async () => {
        mockRequest.formData.mockResolvedValue(new Map([['username', 'admin'], ['password', '123']]));

        const result = await actions.default({ request: mockRequest, cookies: mockCookies } as any);

        expect(result).toEqual(expect.objectContaining({
            status: 400,
            data: { message: 'Invalid password' }
        }));
    });

    it('should handle non-existent user', async () => {
        mockRequest.formData.mockResolvedValue(new Map([['username', 'nonexistent'], ['password', 'password123']]));
        // @ts-ignore
        db.query.user.findFirst.mockResolvedValue(null);

        const result = await actions.default({ request: mockRequest, cookies: mockCookies } as any);

        expect(result).toEqual(expect.objectContaining({
            status: 400,
            data: { message: 'Incorrect username or password' }
        }));
    });
});
