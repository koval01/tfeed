import type { SWRResponse } from "swr";
import { useInternalSWR } from "@/hooks/utils/useInternalSWR";
import type { ChannelsData } from "@/types/channels";

export const useChannels = (
    channels: string[] | null
): SWRResponse<ChannelsData, any> => {
    const apiHost = process.env.NEXT_PUBLIC_API_HOST;
    const url = `${apiHost}/v1/previews`;
    return useInternalSWR<ChannelsData>(url, channels);
};
