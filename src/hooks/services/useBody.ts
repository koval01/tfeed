import type { SWRResponse } from "swr";
import { useInternalSWR } from "@/hooks/utils/useInternalSWR";

export const useBody = (
    channels: string[]
): SWRResponse<any, any> => {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    const url = `${apiHost}/v1/feed`;
    return useInternalSWR(url, { channels });
};
