import axios from "axios";
import useSWR, { type SWRResponse } from "swr";

const fetcher = ([url, body]: [string, any]): Promise<any> =>
    axios.post(url, body).then(res => res.data);

export const useInternalSWR = <Data = any, Error = any>(
    url: string, body: any
): SWRResponse<Data, Error> => {
    return useSWR<Data, Error>([url, body], fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });
};
