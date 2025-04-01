import { type NextRequest } from 'next/server';

import { 
    GoogleGenerativeAI, HarmBlockThreshold, HarmCategory 
} from "@google/generative-ai";

import { i18nStrings } from "@/i18n";
import { z } from 'zod';

// Define supported languages
const SUPPORTED_LANGUAGES = ['en', 'de', 'ru', 'uk'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Environment variable validation
const getRequiredEnvVar = (name: string): string => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Required environment variable ${name} is not set`);
    }
    return value;
};

// Enhanced input validation schema
const requestSchema = z.object({
    // Channel: Telegram username regex
    // Telegram usernames must start with a letter, can contain letters, numbers, and underscores
    // Length between 5 and 32 characters
    channel: z.string()
        .regex(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/, 'Invalid channel format. Must be a valid Telegram username.'),

    // Post ID: Positive integer from 0 to 1,000,000
    post_id: z.string()
        .refine(
            (val) => {
                const num = parseInt(val, 10);
                return !isNaN(num) && num >= 0 && num <= 1e6 && String(num) === val;
            },
            'Post ID must be a positive integer between 0 and 1,000,000'
        ),

    // Language: One of the supported languages
    lang: z.enum(SUPPORTED_LANGUAGES),

    // reCAPTCHA token: Typically 300-500 characters, but we'll set a reasonable range
    token: z.string()
        .min(1536, 'Invalid reCAPTCHA token')
        .max(2304, 'reCAPTCHA token too long')
});

/**
 * Verify reCAPTCHA token
 * @param token The reCAPTCHA token to verify
 * @param secretKey The reCAPTCHA secret key
 * @returns Promise that resolves to a boolean indicating success
 */
async function verifyRecaptcha(token: string, secretKey: string): Promise<boolean> {
    const recaptchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const recaptchaResponse = await fetch(recaptchaVerifyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    });

    const recaptchaData = await recaptchaResponse.json();
    return recaptchaData.success === true;
}

/**
 * GET handler for generating content using Google's Generative AI
 */
export async function GET(request: NextRequest) {
    // Set default headers for security
    const baseHeaders = {
        'Content-Type': 'application/json',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache'
    };

    try {
        // Get environment variables
        let recaptchaSecretKey: string;
        let tokenAPI: string;
        let backendSecret: string;
        let apiHost: string;

        try {
            recaptchaSecretKey = getRequiredEnvVar('RECAPTCHA_TOKEN');
            tokenAPI = getRequiredEnvVar('GOOGLE_AI_API_KEY');
            backendSecret = getRequiredEnvVar('BACKEND_SECRET');
            apiHost = getRequiredEnvVar('NEXT_PUBLIC_API_HOST');
        } catch (error) {
            console.error('Environment variable error:', error);
            return new Response(
                JSON.stringify({ error: 'Service configuration error' }),
                { status: 503, headers: baseHeaders }
            );
        }

        // Extract query parameters
        const searchParams = request.nextUrl.searchParams;
        const params = {
            channel: searchParams.get('channel'),
            post_id: searchParams.get('post_id'),
            lang: searchParams.get('lang'),
            token: searchParams.get('token')
        };

        // Validate input parameters
        const validationResult = requestSchema.safeParse(params);
        if (!validationResult.success) {
            console.error('Validation error:', validationResult.error.format());
            return new Response(
                JSON.stringify({
                    error: 'Invalid request parameters',
                    details: validationResult.error.format()
                }),
                { status: 400, headers: baseHeaders }
            );
        }

        const { channel, post_id, lang, token } = validationResult.data;

        // Verify reCAPTCHA
        try {
            const recaptchaValid = await verifyRecaptcha(token, recaptchaSecretKey);
            if (!recaptchaValid) {
                return new Response(
                    JSON.stringify({ error: 'reCAPTCHA verification failed' }),
                    { status: 403, headers: baseHeaders }
                );
            }
        } catch (error) {
            console.error('reCAPTCHA verification error:', error);
            return new Response(
                JSON.stringify({ error: 'Error verifying security challenge' }),
                { status: 500, headers: baseHeaders }
            );
        }

        // Get system instructions based on language
        const systemInstruction = i18nStrings[lang as SupportedLanguage].translation.postSysInstruction;
        if (!systemInstruction) {
            return new Response(
                JSON.stringify({ error: 'System instructions not available for the specified language' }),
                { status: 400, headers: baseHeaders }
            );
        }

        // Initialize the AI model
        const genAI = new GoogleGenerativeAI(tokenAPI);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction,
            safetySettings: [
                {
                    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: HarmBlockThreshold.BLOCK_NONE,
                }
            ],
        });

        // Fetch post data from the backend
        try {
            const apiUrl = `${apiHost}/v1/post/${encodeURIComponent(channel)}/${encodeURIComponent(post_id)}`;
            const backendResponse = await fetch(apiUrl, {
                headers: { BackEndSecret: backendSecret },
                next: { revalidate: 30 }, // Cache for 30 seconds with SWR pattern
            });

            if (!backendResponse.ok) {
                const errorData = await backendResponse.text();
                console.error(`Backend API error: ${backendResponse.status} ${errorData}`);
                return new Response(
                    JSON.stringify({ error: 'Error fetching content data' }),
                    { status: backendResponse.status, headers: baseHeaders }
                );
            }

            const data = await backendResponse.json();

            // Validate we have post data
            if (!data?.content?.posts?.[0]) {
                return new Response(
                    JSON.stringify({ error: 'Post content not found' }),
                    { status: 404, headers: baseHeaders }
                );
            }

            // Generate content with AI
            const prompt = JSON.stringify(data.content.posts[0]);
            const generationResult = await model.generateContent([prompt]);
            const generatedText = generationResult.response.text().trim();

            if (!generatedText) {
                return new Response(
                    JSON.stringify({ error: 'AI generated empty response' }),
                    { status: 422, headers: baseHeaders }
                );
            }

            return new Response(
                JSON.stringify({ text: generatedText }),
                { status: 200, headers: baseHeaders }
            );
        } catch (error) {
            console.error('Generation or backend API error:', error);
            return new Response(
                JSON.stringify({ error: 'Service processing error' }),
                { status: 500, headers: baseHeaders }
            );
        }
    } catch (error) {
        // Catch-all error handler
        console.error('Unhandled error:', error);
        return new Response(
            JSON.stringify({ error: 'An unexpected error occurred' }),
            { status: 500, headers: baseHeaders }
        );
    }
}
