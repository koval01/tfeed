import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string, turnstileToken?: string) =>
    axios.get(url, {
        headers: turnstileToken ? { 'X-Turnstile-Token': turnstileToken } : {}
    }).then(res => res.data);

const useInternalSWR = (url: string, turnstileToken?: string) => useSWR(
    [url, turnstileToken], // Passing key as array to differentiate requests
    ([url, token]) => fetcher(url, token), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
);

export const getMore = async (channel: string, offset: number, direction: "before" | "after" = "after", turnstileToken: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/v1/more/${channel}/${direction}/${offset}`;
    return await fetcher(url, turnstileToken);
}

export const useBody = (channel: string, position?: number) => {
    const url = position === undefined
        ? `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}?position=${position}`;
    return useInternalSWR(url);
}
