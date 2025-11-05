import { type NextRequest } from 'next/server';
import { createClient } from 'redis';

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
} as const;

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

let redisInitialized = false;

async function initializeRedis() {
    if (!redisInitialized) {
        await redisClient.connect();
        redisInitialized = true;
    }
}

function generateShareId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function validateStringList(channels: any): { isValid: boolean; error?: string } {
    if (!Array.isArray(channels)) {
        return { isValid: false, error: 'Input must be an array' };
    }

    if (channels.length < 1) {
        return { isValid: false, error: 'Array must contain at least 1 channel' };
    }

    if (channels.length > 100) {
        return { isValid: false, error: 'Array cannot contain more than 100 channels' };
    }

    const stringRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,31}$/;

    for (let i = 0; i < channels.length; i++) {
        const str = channels[i];

        if (typeof str !== 'string') {
            return { isValid: false, error: `Item at index ${i} must be a string` };
        }

        if (!stringRegex.test(str)) {
            return { isValid: false, error: `String "${str}" at index ${i} does not match the required pattern` };
        }
    }

    return { isValid: true };
}

async function findExistingKeyByContent(content: string[]): Promise<string | null> {
    const keys = await redisClient.keys('*');

    for (const key of keys) {
        if (key.length === 5) {
            try {
                const storedData = await redisClient.get(key);
                if (storedData) {
                    const storedContent = JSON.parse(storedData);
                    if (Array.isArray(storedContent) &&
                        storedContent.length === content.length &&
                        storedContent.every((item, index) => item === content[index])) {
                        return key;
                    }
                }
            } catch (error) {
                continue;
            }
        }
    }
    return null;
}

export async function POST(request: NextRequest) {
    try {
        await initializeRedis();

        let channels: string[];
        try {
            const body = await request.json();
            channels = body.channels || body;

            const validation = validateStringList(channels);
            if (!validation.isValid) {
                return new Response(JSON.stringify({ error: validation.error }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            });
        }

        const existingKey = await findExistingKeyByContent(channels);

        if (existingKey) {
            const expiresIn = 300;
            await redisClient.expire(existingKey, expiresIn);

            return new Response(JSON.stringify({
                id: existingKey,
                exists: true,
                expiresIn: expiresIn
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    ...SECURITY_HEADERS
                }
            });
        }

        let shareId: string;
        let attempts = 0;
        const maxAttempts = 10;

        do {
            shareId = generateShareId();
            attempts++;

            const existing = await redisClient.get(shareId);
            if (!existing) {
                break;
            }

            if (attempts >= maxAttempts) {
                return new Response(JSON.stringify({ error: 'Failed to generate unique share ID' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
                });
            }
        } while (true);

        const expiresIn = 300;
        await redisClient.setEx(shareId, expiresIn, JSON.stringify(channels));

        return new Response(JSON.stringify({
            id: shareId,
            exists: false,
            expiresIn: expiresIn
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
                ...SECURITY_HEADERS
            }
        });

    } catch (error) {
        console.error('Redis error:', error);
        return new Response(JSON.stringify({ error: 'Failed to create share' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
        });
    }
}
