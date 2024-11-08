'use client';

export const runtime = 'edge';

import axios from 'axios';
import useSWR from 'swr';

import { useParams } from 'next/navigation';

import { Feed } from "@/components/feed";
import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

const fetcher = (url: string) => axios.get(url).then(res => res.data)

export default function Home() {
    const { channel } = useParams();
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
