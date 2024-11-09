'use client';

export const runtime = 'edge';

import { ChannelPageProps } from '@/types/channel';

import { body } from '@/components/feed/fetcher';
import { Feed } from "@/components/feed";

import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
    const { channel } = params;
    const { data, error, isLoading } = body(channel);

    return (
        <SplitLayout header={<PanelHeader delimiter="none" />} className={isLoading ? "overflow-hidden" : ""}>
            <SplitCol autoSpaced>
                <Feed data={data} error={error} isLoading={isLoading} />
            </SplitCol>
        </SplitLayout>
    );
}

export default ChannelPage;
