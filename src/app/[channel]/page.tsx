"use client";

import React from "react";
import { ChannelPageProps } from "@/types/channel";
import { useBody } from "@/components/feed/fetcher";
import { Feed } from "@/components/feed";
import { Error } from "@/components/Error";

import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

export const runtime = "edge";

/**
 * ChannelPage component for displaying a specific channel's feed.
 * @param params - ChannelPageProps containing channel parameters.
 */
const ChannelPage: React.FC<ChannelPageProps> = ({ params }) => {
    const { channel } = params;
    const { data, error, isLoading } = useBody(channel);

    return (
        <SplitLayout
            header={!error ? <PanelHeader delimiter="none" /> : null}
            className={isLoading ? "overflow-hidden" : ""}
        >
            <SplitCol>
                {!error ? (
                    <Feed data={data} isLoading={isLoading} />
                ) : (
                    <Error error={error} />
                )}
            </SplitCol>
        </SplitLayout>
    );
};

export default ChannelPage;
