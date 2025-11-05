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

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id || !/^[a-zA-Z0-9_-]+$/.test(id) || id.length != 5) {
            return new Response(JSON.stringify({ error: 'Invalid share ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            });
        }

        await initializeRedis();

        const data = await redisClient.get(id);

        if (!data) {
            return new Response(JSON.stringify({ error: 'Share not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            });
        }

        let content;
        try {
            content = JSON.parse(data);
        } catch {
            content = data;
        }

        return new Response(JSON.stringify({ content }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60',
                ...SECURITY_HEADERS
            }
        });

    } catch (error) {
        console.error('Redis error:', error);
        return new Response(JSON.stringify({ error: 'Failed to retrieve share data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
        });
    }
}
