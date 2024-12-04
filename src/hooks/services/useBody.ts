import type { SWRResponse } from "swr";
import { useInternalSWR } from "@/hooks/utils/useInternalSWR";

export const useBody = (
    channel: string,
    position?: number
): SWRResponse<any, any> => {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    const url =
        position === undefined
            ? `${apiHost}/v1/body/${channel}`
            : `${apiHost}/v1/body/${channel}?position=${position}`;
    return useInternalSWR(url);
};
