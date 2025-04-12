import axios, { AxiosResponse } from 'axios';

type Direction = 'before' | 'after';

type ApiResponse<T = any> = T;

const checkOnline = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && window.navigator) {
        return window.navigator.onLine;
    }
    return true; // Assume online if window is not available (SSR)
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const createApiClient = (baseURL: string) => {
    const client = axios.create({
        baseURL,
        timeout: 1e4,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const fetcher = async <T>(
        url: string,
        options?: {
            fastRetries?: number;      // Number of fast retries (default: 3)
            fastRetryDelay?: number;   // Delay for fast retries in ms (default: 300ms)
            slowRetryDelay?: number;   // Delay for slow retries in ms (default: 8000ms)
        }
    ): Promise<T> => {
        const {
            fastRetries = 3,
            fastRetryDelay = 300,
            slowRetryDelay = 8000
        } = options || {};

        try {
            const isOnline = await checkOnline();
            if (!isOnline) {
                await wait(slowRetryDelay); // Use slow delay if offline
                return fetcher<T>(url, { fastRetries, fastRetryDelay, slowRetryDelay });
            }

            const response = await client.get(url);
            return response.data;

        } catch (error) {
            // Infinite slow retries after fast retries are exhausted
            const remainingFastRetries = fastRetries - 1;
            const isFastRetry = remainingFastRetries >= 0;

            await wait(isFastRetry ? fastRetryDelay : slowRetryDelay);

            return fetcher<T>(url, {
                fastRetries: remainingFastRetries,
                fastRetryDelay,
                slowRetryDelay
            });
        }
    };

    return {
        getMore: async <T = any>(
            channel: string,
            offset: number,
            direction: Direction = 'after'
        ): Promise<T> => {
            const endpoint = `/v1/more/${channel}/${direction}/${offset}`;
            return fetcher<T>(endpoint);
        },
    };
};

const apiHost = process.env.NEXT_PUBLIC_API_HOST;
if (!apiHost) {
    throw new Error('NEXT_PUBLIC_API_HOST environment variable is not defined');
}

export const apiClient = createApiClient(apiHost);
