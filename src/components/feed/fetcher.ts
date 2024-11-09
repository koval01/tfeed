import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const useMore = (channel: string, offset: number, refresh: boolean = false) => {
    return useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/v1/more/${channel}/${!refresh ? "before" : "after"}/${offset}`,
        fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    );
}

export const useBody = (channel: string, position?: number) => {
    const url = position === undefined
        ? `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}?position=${position}`;

    return useSWR(url, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
}
