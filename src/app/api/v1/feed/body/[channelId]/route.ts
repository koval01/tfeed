export const runtime = 'edge';

import { apiRequest } from "@/helpers/api";
import { NextResponse } from "next/server";
import { z } from "zod";

const querySchema = z.object({
    position: z
        .string()
        .optional()
        .refine((val) => {
            // If the value is undefined, it's valid since 'position' is optional
            if (val === undefined) return true;

            const num = parseInt(val, 10);
            // Ensure the parsed number is between 0 and 1 million
            return !isNaN(num) && num >= 0 && num <= 1_000_000;
        }, { message: "Position must be a positive number between 0 and 1 million" }),
});

const paramsSchema = z.object({
    channelId: z
        .string()
        .regex(/^(?!.*__)[a-zA-Z](?:[a-zA-Z0-9_]{3,30})[a-zA-Z0-9]$/, "Invalid channelId format"),
});

export async function GET(
    request: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        // Validate the params using the paramsSchema
        paramsSchema.parse(params);

        const url = new URL(request.url);
        // Validate the query parameters using the querySchema
        const query = querySchema.parse(Object.fromEntries(url.searchParams));

        const response = await fetch(
            query.position === undefined
                ? `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${params.channelId}`
                : `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${params.channelId}?position=${query.position}`, 
        {
            headers: { "BackEndSecret": process.env.BACKEND_SECRET || "" }
        });

        const body = await apiRequest("GET", `body/${params.channelId}`, {position: query.position});

        return NextResponse.json(body);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || "Invalid request" },
            { status: 400 }
        );
    }
}
