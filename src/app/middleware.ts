import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log("Middleware triggered"); 
    const turnstileToken = request.headers.get('x-turnstile-token');

    if (!turnstileToken) {
        return NextResponse.json({ message: 'Turnstile token is missing' }, { status: 400 });
    }

    const secretKey = process.env.TURNSTILE_KEY;
    if (!secretKey) {
        return NextResponse.json({ message: 'Secret key is missing' }, { status: 500 });
    }

    const ip = request.headers.get('CF-Connecting-IP') || '';

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', turnstileToken);
    formData.append('remoteip', ip);

    const idempotencyKey = crypto.randomUUID();
    formData.append('idempotency_key', idempotencyKey);

    const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const response = await fetch(verificationUrl, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        return NextResponse.json({ message: 'Turnstile verification failed' }, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/api/*']
};
