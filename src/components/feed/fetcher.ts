import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { useEffect, useState, type MutableRefObject } from 'react';

import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string, turnstileToken?: string) =>
    axios.get(url, {
        headers: turnstileToken ? { 'X-Turnstile-Token': turnstileToken } : {}
    }).then(res => res.data);

const useInternalSWR = (url: string | null, turnstileToken?: string) => {
    const shouldFetch = !!url && !!turnstileToken; // Check if both are available
    return useSWR(
        shouldFetch ? [url, turnstileToken] : null, // Pass `null` if fetching should be skipped
        ([url, token]) => fetcher(url, token), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    }
    );
};

export const getMore = async (channel: string, offset: number, direction: "before" | "after" = "after", turnstileToken: string) => {
    const url = `/api/v1/feed/more/${channel}/${direction}/${offset}`;
    return await fetcher(url, turnstileToken);
}

export const useBody = (
    channel: string,
    refTurnstile: MutableRefObject<TurnstileInstance | null>,
    position?: number
) => {
    const [turnstileToken, setTurnstileToken] = useState<string | undefined>(void 0);

    // Fetch Turnstile token when the hook is used
    useEffect(() => {
        const fetchToken = async () => {
            if (refTurnstile.current) {
                refTurnstile.current.reset();
                const token = await refTurnstile.current.getResponsePromise();
                setTurnstileToken(token || void 0);
            }
        };
        fetchToken();
    }, [refTurnstile]);

    const url =
        position === undefined
            ? `/api/v1/feed/body/${channel}`
            : `/api/v1/feed/body/${channel}?position=${position}`;

    // Always call `useInternalSWR` but handle `null` keys
    const swrResponse = useInternalSWR(url, turnstileToken);

    // Add a custom `isLoading` field for convenience
    return {
        ...swrResponse,
        isLoading: !turnstileToken || swrResponse.isValidating,
    };
};
