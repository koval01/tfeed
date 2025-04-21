import { type NextRequest } from 'next/server';

import {
    GoogleGenerativeAI, HarmBlockThreshold, HarmCategory
} from "@google/generative-ai";

import { cleanJsonOfPost } from "@/lib/utils/json";
import { i18nStrings } from "@/i18n";
import { z } from 'zod';

const SUPPORTED_LANGUAGES = ['en', 'de', 'ru', 'uk'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

const SECURITY_HEADERS = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache'
} as const;

const MAX_POST_ID = 1e6;
const RECAPTCHA_TOKEN_LENGTH = { min: 1536, max: 2304 };

const requestSchema = z.object({
    channel: z.string()
        .regex(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/, 'Invalid Telegram username format'),
    post_id: z.string()
        .refine(
            val => /^\d+$/.test(val) && parseInt(val) <= MAX_POST_ID,
            `Post ID must be a positive integer up to ${MAX_POST_ID}`
        ),
    lang: z.enum(SUPPORTED_LANGUAGES),
    token: z.string()
        .min(RECAPTCHA_TOKEN_LENGTH.min, 'Invalid reCAPTCHA token')
        .max(RECAPTCHA_TOKEN_LENGTH.max, 'reCAPTCHA token too long')
});

type RequestParams = z.infer<typeof requestSchema>;

class EnvironmentService {
    static getRequiredEnvVar(name: string): string {
        const value = process.env[name];
        if (!value) throw new Error(`Missing required environment variable: ${name}`);
        return value;
    }

    static getConfig() {
        return {
            recaptchaSecretKey: this.getRequiredEnvVar('RECAPTCHA_TOKEN'),
            googleApiKey: this.getRequiredEnvVar('GOOGLE_AI_API_KEY'),
            backendSecret: this.getRequiredEnvVar('BACKEND_SECRET'),
            apiHost: this.getRequiredEnvVar('NEXT_PUBLIC_API_HOST')
        };
    }
}

class RecaptchaService {
    static async verify(token: string, secretKey: string): Promise<boolean> {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ secret: secretKey, response: token })
        });

        const data = await response.json();
        return data.success === true;
    }
}

class AIService {
    private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

    constructor(apiKey: string, systemInstruction: string) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const safetySettings = Object.values(HarmCategory)
            .filter(category => category !== HarmCategory.HARM_CATEGORY_UNSPECIFIED)
            .map(category => ({
                category,
                threshold: HarmBlockThreshold.BLOCK_NONE
            }));
            
        this.model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction,
            safetySettings
        });
    }

    async generateContent(prompt: string): Promise<string> {
        const result = await this.model.generateContent([prompt]);
        const text = result.response.text().trim();

        if (!text) throw new Error('AI generated empty response');
        return text;
    }
}

function buildApiUrl(host: string, channel: string, postId: string): string {
    return `${host}/v1/post/${encodeURIComponent(channel)}/${encodeURIComponent(postId)}`;
}

function validatePostData(data: any, lang: SupportedLanguage) {
    if (!data?.content) {
        throw new Error('Post content not found');
    }

    if (!data.content?.text) {
        return {
            ai: { text: i18nStrings[lang].translation.unsupportedPostAi }
        };
    }

    return null;
}

export async function GET(request: NextRequest) {
    try {
        const config = EnvironmentService.getConfig();
        const searchParams = Object.fromEntries(request.nextUrl.searchParams) as unknown as RequestParams;

        const params = requestSchema.parse(searchParams);
        const { channel, post_id: postId, lang, token } = params;

        // Verify reCAPTCHA
        if (!await RecaptchaService.verify(token, config.recaptchaSecretKey)) {
            return jsonResponse({ error: 'reCAPTCHA verification failed' }, 403);
        }

        // Get system instructions
        const systemInstruction = i18nStrings[lang].translation.postSysInstruction;
        if (!systemInstruction) {
            return jsonResponse({ error: 'Unsupported language' }, 400);
        }

        // Fetch post data
        const apiUrl = buildApiUrl(config.apiHost, channel, postId);
        const response = await fetch(apiUrl, {
            headers: { BackEndSecret: config.backendSecret },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            console.error(`Backend API error: ${response.status}`, await response.text());
            return jsonResponse({ error: 'Error fetching content data' }, response.status);
        }

        const data = await response.json();
        const validationResult = validatePostData(data, lang);

        if (validationResult) {
            return jsonResponse(validationResult);
        }

        // Generate AI content
        const aiService = new AIService(config.googleApiKey, systemInstruction);
        const serverTime = new Date().toUTCString();
        const content = cleanJsonOfPost(data);

        const prompt = `\`Time now: ${serverTime}\`\n${JSON.stringify(content)}`;
        const generatedText = await aiService.generateContent(prompt);

        return jsonResponse({
            ai: { text: generatedText },
            content,
            serverTime
        });

    } catch (error) {
        console.error('Error processing request:', error);

        if (error instanceof z.ZodError) {
            return jsonResponse({
                error: 'Invalid request parameters',
                details: error.format()
            }, 400);
        }

        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        return jsonResponse({ error: message }, 500);
    }
}

function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: SECURITY_HEADERS
    });
}
