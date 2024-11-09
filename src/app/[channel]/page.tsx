'use client';

export const runtime = 'edge';

import { ChannelPageProps } from '@/types/channel';

import { body } from '@/components/feed/fetcher';
import { Feed } from "@/components/feed";
import { Error } from "@/components/Error";

import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
    const { channel } = params;
    const { data, error, isLoading } = body(channel);

    return (
        <SplitLayout header={!error ? <PanelHeader delimiter="none" /> : null} className={isLoading ? "overflow-hidden" : ""}>
            <SplitCol autoSpaced>
                {!error ? <Feed data={data} isLoading={isLoading} /> : <Error error={error} />}
            </SplitCol>
        </SplitLayout>
    );
}

export default ChannelPage;
