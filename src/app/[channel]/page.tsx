"use client";

import type { ChannelPageProps } from "@/types/channel";
import React, { use } from "react";

import { useBody } from "@/hooks/services/useBody";

import { Error } from "@/components/error/Error";
import { Feed } from "@/components/feed/Feed";

import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

export const runtime = "edge";
export const dynamic = "auto";

/**
 * ChannelPage component for displaying a specific channel's feed.
 * @param params - ChannelPageProps containing channel parameters.
 */
const ChannelPage: React.FC<ChannelPageProps> = props => {
    const params = use(props.params);
    const { channel } = params;
    const { data, error, isLoading } = useBody(channel);

    return (
        <SplitLayout
            header={!error ? <PanelHeader delimiter="none" /> : null}
            className={isLoading ? "fixed" : ""}
            // In data loading mode, the page is just a dicorporation
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
