import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { load } from 'recaptcha-v3';

export const useIntelligence = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);
    const { i18n } = useTranslation();

    const fetchIntelligence = async (channelUsername: string, postId: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const recaptcha = await load(process.env.NEXT_PUBLIC_RECAPTCHA_TOKEN as string);
            const token = await recaptcha.execute('submit');

            const url = new URL('/api/v1/llm', window.location.origin);
            url.searchParams.append('channel', channelUsername);
            url.searchParams.append('post_id', postId.toString());
            url.searchParams.append('lang', i18n.language);
            url.searchParams.append('token', token);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            const responseData = await response.json();
            setData(responseData);
            return responseData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { fetchIntelligence, isLoading, error, data };
};
