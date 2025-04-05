import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
    matcher: '/:path*',
};

export function middleware(request: NextRequest) {
    if (request.method !== 'GET') {
        return NextResponse.next();
    }

    const response = NextResponse.next();

    if (request.nextUrl.pathname.startsWith('/_next/static')) {
        response.headers.set(
            'Cache-Control',
            'public, max-age=31536000, immutable'
        );
        return response;
    }

    response.headers.set(
        'Cache-Control',
        'public, s-maxage=28800, stale-while-revalidate=86400'
    );

    response.headers.set('X-Vercel-Cache', 'public, max-age=28800');
    response.headers.set('Vercel-CDN-Cache-Control', 'max-age=28800');

    return response;
}
