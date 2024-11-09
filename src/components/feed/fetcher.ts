import axios from 'axios';
import useSWR from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const more = (channel: string, offset: number, refresh: boolean = false) => {
    return useSWR(
        `${process.env.NEXT_PUBLIC_API_HOST}/v1/more/${channel}/${!refresh ? "before" : "after"}/${offset}`, 
    fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
}

export const body = (channel: string, position: number | null = null) => {
    return useSWR(`${process.env.NEXT_PUBLIC_API_HOST}/v1/body/${channel}/${position}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
}
