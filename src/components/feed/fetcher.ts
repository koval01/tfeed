import axios from "axios";
import useSWR, { SWRResponse } from "swr";

type Direction = "before" | "after";

// Fetcher
const fetcher = (url: string): Promise<any> => axios.get(url).then(res => res.data);

// SWR Wrapper
const useInternalSWR = <Data = any, Error = any>(
    url: string
): SWRResponse<Data, Error> => {
    return useSWR<Data, Error>(url, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });
};

// Runtime Environment Validation
const getApiHost = (): string => {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    if (!apiHost) {
        throw new Error("Environment variable NEXT_PUBLIC_API_HOST is not defined.");
    }
    return apiHost;
};

// API Functions
export const getMore = async (
    channel: string,
    offset: number,
    direction: Direction = "after"
): Promise<any> => {
    const apiHost = getApiHost();
    const url = `${apiHost}/v1/more/${channel}/${direction}/${offset}`;
    return await fetcher(url);
};

export const useBody = (
    channel: string,
    position?: number
): SWRResponse<any, any> => {
    const apiHost = getApiHost();
    const url =
        position === undefined
            ? `${apiHost}/v1/body/${channel}`
            : `${apiHost}/v1/body/${channel}?position=${position}`;
    return useInternalSWR(url);
};
