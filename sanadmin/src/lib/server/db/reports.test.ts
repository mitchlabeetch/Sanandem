import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createHash } from 'crypto';

// Mock the dependencies to avoid DB connection
vi.mock('./index.js', () => ({
    db: {
        insert: vi.fn(),
        select: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    }
}));

// Mock $env/dynamic/private
const mockEnv = {
    IP_SALT: ''
};

vi.mock('$env/dynamic/private', () => ({
    get env() {
        return mockEnv;
    }
}));

describe('hashIpAddress Security', () => {
    let hashIpAddress: (ip: string) => string;

    beforeEach(async () => {
        vi.resetModules();
        mockEnv.IP_SALT = ''; // Reset env
        process.env.NODE_ENV = 'test'; // Default to test/dev

        // Re-import the module
        const module = await import('./reports.js');
        hashIpAddress = module.hashIpAddress;

        // Spy on console.warn
        vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('uses default salt and warns when IP_SALT is missing in non-production', () => {
        const ip = '127.0.0.1';
        const expectedDefaultHash = createHash('sha256').update(ip + 'default-salt').digest('hex');

        const result = hashIpAddress(ip);

        expect(result).toBe(expectedDefaultHash);
        expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('SECURITY WARNING'));
    });

    it('throws error when IP_SALT is missing in production', () => {
        process.env.NODE_ENV = 'production';
        const ip = '127.0.0.1';

        expect(() => hashIpAddress(ip)).toThrow('SECURITY CRITICAL');
    });

    it('uses provided IP_SALT when set', async () => {
        mockEnv.IP_SALT = 'super-secret-salt-that-is-very-long-and-secure';

        const ip = '127.0.0.1';
        const expectedHash = createHash('sha256').update(ip + 'super-secret-salt-that-is-very-long-and-secure').digest('hex');

        const result = hashIpAddress(ip);

        expect(result).toBe(expectedHash);
        expect(console.warn).not.toHaveBeenCalled();
    });

    it('throws error when IP_SALT is too short in production', () => {
        process.env.NODE_ENV = 'production';
        mockEnv.IP_SALT = 'short-salt';
        const ip = '127.0.0.1';

        expect(() => hashIpAddress(ip)).toThrow('SECURITY CRITICAL: IP_SALT is too short');
    });
});
