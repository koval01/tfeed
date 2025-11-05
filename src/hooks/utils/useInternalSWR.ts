import axios from "axios";
import useSWR, { type SWRResponse } from "swr";

const universalFetcher = ([url, body, method = 'POST']: [string, any?, string?]): Promise<any> => {
    if (method === 'GET' || body === undefined || body === null) {
        return axios.get(url).then(res => res.data);
    }
    return axios.post(url, body).then(res => res.data);
};

export const useInternalSWR = <Data = any, Error = any>(
    url: string,
    body?: any,
    options?: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        skip?: boolean;
    }
): SWRResponse<Data, Error> => {
    const method = options?.method || (body === undefined ? 'GET' : 'POST');
    const shouldFetch = options?.skip ? false : (body === null ? null : true);

    return useSWR<Data, Error>(
        shouldFetch ? [url, body, method] : null,
        universalFetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );
};