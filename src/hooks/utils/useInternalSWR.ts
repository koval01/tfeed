import axios from "axios";
import useSWR, { type SWRResponse } from "swr";

const fetcher = (url: string): Promise<any> => axios.get(url).then(res => res.data);

export const useInternalSWR = <Data = any, Error = any>(
    url: string
): SWRResponse<Data, Error> => {
    return useSWR<Data, Error>(url, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });
};
