'use client';

import axios from 'axios';
import useSWR from 'swr';

import { Feed } from "@/components/feed";
import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

const fetcher = (url: string) => axios.get(url).then(res => res.data)

interface ChannelPageProps {
    params: {
        channel: string;
    };
}

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
    const { channel } = params;
    const { data, error, isLoading } = useSWR(`https://telegram.koval.page/v1/body/${channel}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    })

    return (
        <SplitLayout header={<PanelHeader delimiter="none" />}>
            <SplitCol autoSpaced>
                <Feed data={data} error={error} isLoading={isLoading} />
            </SplitCol>
        </SplitLayout>
    );
}

export default ChannelPage;
