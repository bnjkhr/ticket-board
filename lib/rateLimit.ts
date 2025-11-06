// Rate Limiting Utility for preventing spam registrations and logins
// Uses localStorage for client-side storage with fallback to memory storage

interface RateLimitData {
    attempts: number;
    lastAttempt: number;
    blockedUntil?: number;
}

export interface RateLimitStatus {
    allowed: boolean;
    blockedUntil?: Date;
    remainingAttempts?: number;
    resetTime?: Date;
}

const RATE_LIMITS = {
    registration: {
        maxAttempts: 3,
        windowMs: 60 * 60 * 1000, // 1 hour
        blockDurationMs: 2 * 60 * 60 * 1000, // 2 hours block after limit reached
    },
    login: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDurationMs: 30 * 60 * 1000, // 30 minutes block after limit reached
    },
};

class RateLimiter {
    private storage: Storage | Record<string, any>;
    private isMemoryStorage = false;

    constructor() {
        // Try to use localStorage, fallback to memory storage
        try {
            this.storage = window.localStorage;
            // Test if localStorage is available
            const testKey = "__rate_limit_test__";
            this.storage.setItem(testKey, "test");
            this.storage.removeItem(testKey);
        } catch (error) {
            // Fallback to memory storage
            console.warn(
                "localStorage not available, using memory storage for rate limiting",
            );
            this.storage = {};
            this.isMemoryStorage = true;
        }
    }

    private setItem(key: string, value: RateLimitData): void {
        try {
            if (this.isMemoryStorage) {
                (this.storage as Record<string, any>)[key] = value;
            } else {
                (this.storage as Storage).setItem(key, JSON.stringify(value));
            }
        } catch (error) {
            console.error("Failed to store rate limit data:", error);
        }
    }

    private getItem(key: string): RateLimitData | null {
        try {
            if (this.isMemoryStorage) {
                return (this.storage as Record<string, any>)[key] || null;
            } else {
                const item = (this.storage as Storage).getItem(key);
                return item ? JSON.parse(item) : null;
            }
        } catch (error) {
            console.error("Failed to retrieve rate limit data:", error);
            return null;
        }
    }

    private removeItem(key: string): void {
        try {
            if (this.isMemoryStorage) {
                delete (this.storage as Record<string, any>)[key];
            } else {
                (this.storage as Storage).removeItem(key);
            }
        } catch (error) {
            console.error("Failed to remove rate limit data:", error);
        }
    }

    private getKey(type: "registration" | "login", identifier: string): string {
        return `rate_limit_${type}_${identifier}`;
    }

    /**
     * Check if an action is allowed based on rate limits
     */
    public isAllowed(
        type: "registration" | "login",
        identifier: string,
    ): {
        allowed: boolean;
        remainingAttempts?: number;
        blockedUntil?: Date;
        resetTime?: Date;
    } {
        const config = RATE_LIMITS[type];
        const key = this.getKey(type, identifier);
        const data = this.getItem(key);
        const now = Date.now();

        // If no previous attempts, allow
        if (!data) {
            return { allowed: true, remainingAttempts: config.maxAttempts - 1 };
        }

        // Check if currently blocked
        if (data.blockedUntil && now < data.blockedUntil) {
            return {
                allowed: false,
                blockedUntil: new Date(data.blockedUntil),
            };
        }

        // Check if window has expired
        if (now - data.lastAttempt > config.windowMs) {
            // Reset the counter
            this.removeItem(key);
            return { allowed: true, remainingAttempts: config.maxAttempts - 1 };
        }

        // Check if limit exceeded
        if (data.attempts >= config.maxAttempts) {
            const blockUntil = now + config.blockDurationMs;
            const newData = { ...data, blockedUntil: blockUntil };
            this.setItem(key, newData);
            return {
                allowed: false,
                blockedUntil: new Date(blockUntil),
            };
        }

        // Allow action
        const remainingAttempts = config.maxAttempts - data.attempts - 1;
        const resetTime = data.lastAttempt + config.windowMs;

        return {
            allowed: true,
            remainingAttempts,
            resetTime: new Date(resetTime),
        };
    }

    /**
     * Record an attempt
     */
    public recordAttempt(
        type: "registration" | "login",
        identifier: string,
    ): void {
        const key = this.getKey(type, identifier);
        const data = this.getItem(key);
        const now = Date.now();

        if (data && data.blockedUntil && now < data.blockedUntil) {
            // Don't record attempts while blocked
            return;
        }

        const newData: RateLimitData = {
            attempts: (data?.attempts || 0) + 1,
            lastAttempt: now,
            blockedUntil: data?.blockedUntil,
        };

        this.setItem(key, newData);
    }

    /**
     * Clear rate limit data for a specific identifier
     */
    public clear(identifier: string): void {
        this.removeItem(this.getKey("registration", identifier));
        this.removeItem(this.getKey("login", identifier));
    }

    /**
     * Get rate limit status without recording an attempt
     */
    public getStatus(
        type: "registration" | "login",
        identifier: string,
    ): {
        attempts: number;
        maxAttempts: number;
        windowMs: number;
        remainingTime?: number;
        blockedUntil?: Date;
    } {
        const config = RATE_LIMITS[type];
        const key = this.getKey(type, identifier);
        const data = this.getItem(key);
        const now = Date.now();

        if (!data) {
            return {
                attempts: 0,
                maxAttempts: config.maxAttempts,
                windowMs: config.windowMs,
            };
        }

        let remainingTime: number | undefined;
        if (data.lastAttempt + config.windowMs > now) {
            remainingTime = data.lastAttempt + config.windowMs - now;
        }

        return {
            attempts: data.attempts,
            maxAttempts: config.maxAttempts,
            windowMs: config.windowMs,
            remainingTime,
            blockedUntil: data.blockedUntil
                ? new Date(data.blockedUntil)
                : undefined,
        };
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Helper functions for common use cases
export const checkRegistrationLimit = (email: string, ip?: string) => {
    const emailCheck = rateLimiter.isAllowed("registration", `email:${email}`);
    const ipCheck = ip
        ? rateLimiter.isAllowed("registration", `ip:${ip}`)
        : { allowed: true };

    return {
        allowed: emailCheck.allowed && ipCheck.allowed,
        emailLimit: emailCheck,
        ipLimit: ipCheck,
    };
};

export const checkLoginLimit = (email: string, ip?: string) => {
    const emailCheck = rateLimiter.isAllowed("login", `email:${email}`);
    const ipCheck = ip
        ? rateLimiter.isAllowed("login", `ip:${ip}`)
        : { allowed: true };

    return {
        allowed: emailCheck.allowed && ipCheck.allowed,
        emailLimit: emailCheck,
        ipLimit: ipCheck,
    };
};

export const recordRegistrationAttempt = (email: string, ip?: string) => {
    rateLimiter.recordAttempt("registration", `email:${email}`);
    if (ip) {
        rateLimiter.recordAttempt("registration", `ip:${ip}`);
    }
};

export const recordLoginAttempt = (email: string, ip?: string) => {
    rateLimiter.recordAttempt("login", `email:${email}`);
    if (ip) {
        rateLimiter.recordAttempt("login", `ip:${ip}`);
    }
};

// Client IP detection utility
export const getClientIP = async (): Promise<string | null> => {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.warn("Failed to fetch client IP:", error);
        return null;
    }
};
