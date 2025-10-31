"use client";

import React from "react";

import { useBody } from "@/hooks/services/useBody";

import { Error } from "@/components/error/Error";
import { Feed } from "@/components/feed/Feed";

import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";

const FeedPage: React.FC = () => {
    const key = "TF_channels";
    if (!window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, JSON.stringify(["durov", "telegram", "lafaelka"]))
    }
    const channels = JSON.parse(window.localStorage.getItem(key) || "");
    const { data, error, isLoading } = useBody(channels);

    return (
        <SplitLayout
            header={!error ? <PanelHeader delimiter="none" /> : null}
            className={isLoading ? "fixed" : ""}
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

export default FeedPage;
