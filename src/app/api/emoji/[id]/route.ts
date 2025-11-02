import { type NextRequest } from 'next/server';

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
} as const;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id || !/^\d{18,20}$/.test(id)) {
            return new Response(JSON.stringify({ error: 'Invalid emoji ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
            });
        }

        const telegramUrl = `https://t.me/i/emoji/${id}.json`;

        const response = await fetch(telegramUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TFeedBot/1.0)' },
            cache: 'no-store',
            // @ts-ignore
            duplex: 'half'
        });

        return new Response(response.body, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=31536000',
                ...SECURITY_HEADERS
            }
        });

    } catch {
        return new Response(JSON.stringify({ error: 'Failed to proxy emoji data' }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...SECURITY_HEADERS }
        });
    }
}
