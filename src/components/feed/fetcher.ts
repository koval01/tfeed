import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const useInternalSWR = (url: string) => useSWR(
    url, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
});

export const getMore = async (channel: string, offset: number, refresh: boolean = false) => {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/v1/more/${channel}/${!refresh ? "before" : "after"}/${offset}`;
    return await fetcher(url);
}

export const useBody = (channel: string, position?: number) => {
    const url = position === undefined
        ? `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}?position=${position}`;
    return useInternalSWR(url);
}
