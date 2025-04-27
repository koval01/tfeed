import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { load } from 'recaptcha-v3';
import axios from 'axios';

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

            const url = new URL('/v1/ai/generate', process.env.NEXT_PUBLIC_API_HOST).toString();

            const response = await axios.post(url, {
                channel: channelUsername,
                identifier: postId,
                lang: i18n.language
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Recaptcha-Token': token
                }
            });

            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : err instanceof Error
                    ? err.message
                    : 'Unknown error occurred';

            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { fetchIntelligence, isLoading, error, data };
};
