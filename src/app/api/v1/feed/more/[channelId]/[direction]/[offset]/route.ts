export const runtime = 'edge';

import { apiRequest } from "@/helpers/api";
import { NextResponse } from "next/server";
import { z } from "zod";

const paramsSchema = z.object({
    channelId: z
        .string()
        .regex(/^(?!.*__)[a-zA-Z](?:[a-zA-Z0-9_]{3,30})[a-zA-Z0-9]$/, "Invalid channelId format"),
    direction: z
        .enum(["before", "after"])
        .refine((val) => ["before", "after"].includes(val), {
            message: "Direction must be either 'before' or 'after'",
        }),
    offset: z
        .string()
        .refine((val) => {
            const num = parseInt(val, 10);
            return num >= 0 && num <= 1_000_000;
        }, { message: "Offset must be a positive number between 0 and 1 million" }),
});

export async function GET(
    _: Request,
    { params }: { params: { channelId: string; direction: string; offset: string } }
) {
    try {
        paramsSchema.parse(params);
        const body = await apiRequest("GET", `more/${params.channelId}/${params.direction}/${params.offset}`);

        return NextResponse.json(body);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.errors || "Invalid request" },
            { status: 400 }
        );
    }
}
