'use client';

export const runtime = 'edge';

import { useRef } from 'react';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import type { ChannelPageProps } from '@/types/channel';

import { useBody } from '@/components/feed/fetcher';
import { Feed } from "@/components/feed";
import { Error } from "@/components/Error";

import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";
import { Turnstile } from '@marsidev/react-turnstile';

const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
    const { channel } = params;
    const refTurnstile = useRef<TurnstileInstance | null>(null);
    
    const { data, error, isLoading } = useBody(channel, refTurnstile);

    return (
        <>
            <SplitLayout
                header={!error ? <PanelHeader delimiter="none" /> : null}
                className={isLoading ? "overflow-hidden" : ""}
            >
                <SplitCol autoSpaced>
                    {!error
                        ? <Feed data={data} isLoading={isLoading} refTurnstile={refTurnstile} />
                        : <Error error={error} />
                    }
                </SplitCol>
            </SplitLayout>
            <Turnstile ref={refTurnstile} siteKey={process.env.NEXT_PUBLIC_TURNSTILE_KEY as string} />
        </>
    );
}

export default ChannelPage;
