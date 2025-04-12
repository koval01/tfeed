import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    const { path } = await request.json();

    if (!path) {
        return NextResponse.json(
            { error: 'Path is required' },
            { status: 400 }
        );
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, now: Date.now() });
}
