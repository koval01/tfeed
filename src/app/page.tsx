"use client";

import React from "react";

import { useBody } from "@/hooks/services/useBody";
import { Error } from "@/components/error/Error";
import { Feed } from "@/components/feed/Feed";
import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";
import { useChannelsStorage } from "@/hooks/utils/useChannelStorage";

const FeedPage: React.FC = () => {
    const {
        channelsUsernames,
        isLoading
    } = useChannelsStorage();

    const { data, error, isLoading: isBodyLoading } = useBody(channelsUsernames);

    const isPageLoading = isLoading || isBodyLoading;

    return (
        <SplitLayout
            header={!error ? <PanelHeader delimiter="none" /> : null}
            className={isPageLoading ? "fixed" : ""}
        >
            <SplitCol>
                {!error ? (
                    <Feed
                        data={data}
                        isLoading={isPageLoading}
                    />
                ) : (
                    <Error error={error} />
                )}
            </SplitCol>
        </SplitLayout>
    );
};

export default FeedPage;
