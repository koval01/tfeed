import { type NextRequest } from 'next/server';
import { z } from 'zod';

const SECURITY_HEADERS = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'public, s-maxage=2592000, stale-while-revalidate=31536000',
    'Referrer-Policy': 'no-referrer'
} as const;

const TELEGRAM_CDN_DOMAINS = [
    'cdn1.cdn-telegram.org',
    'cdn2.cdn-telegram.org',
    'cdn3.cdn-telegram.org',
    'cdn4.cdn-telegram.org',
    'cdn5.cdn-telegram.org'
];

const EmojiResponseSchema = z.object({
    type: z.string(),
    emoji: z.string().url(),
    thumb: z.string().url(),
    path: z.string(),
    size: z.number()
});

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return jsonResponse({ error: 'Missing emoji ID parameter' }, 400);
        }

        const idSchema = z.string().regex(/^\d{18,20}$/);
        const validatedId = idSchema.parse(id);

        const telegramUrl = `https://t.me/i/emoji/${validatedId}.json`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5e3);

        const response = await fetch(telegramUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; YourBot/1.0)'
            }
        }).finally(() => clearTimeout(timeout));

        if (!response.ok) {
            throw new Error(`Telegram API responded with status ${response.status}`);
        }

        const data = await response.json();
        const validatedData = EmojiResponseSchema.parse(data);

        const validateCdnUrl = (url: string) => {
            const parsedUrl = new URL(url);
            if (!TELEGRAM_CDN_DOMAINS.includes(parsedUrl.hostname)) {
                throw new Error('Invalid CDN domain');
            }
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                throw new Error('Invalid URL protocol');
            }
            return url;
        };

        const safeResponse = {
            type: validatedData.type,
            emoji: validateCdnUrl(validatedData.emoji),
            thumb: validateCdnUrl(validatedData.thumb),
            path: validatedData.path,
            size: validatedData.size
        };

        return jsonResponse(safeResponse);

    } catch (error) {
        console.error('Error processing request:', error);

        if (error instanceof z.ZodError) {
            return jsonResponse({
                error: 'Invalid emoji ID format - must be 18-20 digit number',
                details: error.format()
            }, 400);
        }

        const message = error instanceof Error ? 'Failed to fetch emoji data' : 'An unexpected error occurred';
        return jsonResponse({ error: message }, 500);
    }
}

function jsonResponse(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: SECURITY_HEADERS
    });
}
