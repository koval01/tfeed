"use client";

import { type FC, useCallback, useEffect, useMemo, useState } from "react";
import debounce from 'lodash/debounce';

import { useModal } from "@/contexts/ModalContext";
import { usePosts } from "@/hooks/services/usePosts";
import { useInterval } from "@/hooks/utils/useInterval";
import { useChannelsStorage } from "@/hooks/utils/useChannelStorage";

import type { Body } from "@/types";

import {
    Cell, Group, IconButton, List, Panel, Search, SplitLayout, Text,
    usePlatform
} from "@vkontakte/vkui";
import { Icon24ShareExternalOutline, Icon28AddCircleOutline, Icon28RemoveCircleOutline } from "@vkontakte/icons";

import {
    Posts as PostsSkeleton,
    Profile as ProfileSkeleton
} from "@/components/feed/Skeleton";

import { Avatar } from "@/components/avatar/Avatar";
import { Posts } from "@/components/feed/post/Post";
import { FullscreenModal } from "@/components/feed/Modal";
import ErrorSnackbar from "@/components/error/ErrorSnackbar";
import { FeedHeader } from "@/components/feed/header/FeedHeader";
import { Profile as DesktopProfile } from "@/components/feed/profile/Desktop";

import { usePreview } from "@/hooks/services/usePreview";
import { useClipboard } from "@/hooks/utils/useClipboard";

import { t } from "i18next";

interface FeedProps {
    /**
     * The initial data to populate the feed.
     */
    data: Body;

    /**
     * Flag to indicate whether the initial data is being loaded.
     */
    isLoading: boolean;
}

/**
 * The Feed component displays a feed of posts.
 */
export const Feed: FC<FeedProps> = ({ data, isLoading }) => {
    const { isModalOpen, closeModal } = useModal();
    const { copyToClipboard } = useClipboard();
    const platform = usePlatform();

    const [snackbar, setSnackbar] = useState<React.ReactElement | null>(null);

    const [search, setSearch] = useState<string>('');
    const [found, setFound] = useState<boolean>(false);

    const {
        channels,
        channelsUsernames,
        isLoading: isChannelsLoading,
        addChannel,
        removeChannel
    } = useChannelsStorage();

    const { data: previewData, loading: previewLoading, fetchPreview } = usePreview();

    const debouncedSearch = useMemo(
        () => debounce((searchValue: string) => {
            if (searchValue && searchValue.length > 3 && searchValue.length < 32) {
                fetchPreview(searchValue).catch(error => {
                    console.error('Failed to fetch preview:', error);
                });
            }
        }, 600),
        [fetchPreview]
    );

    const setValidatedSearch = useCallback((value: string) => {
        if (value === '') {
            setSearch(value);
            return;
        }

        const partialRegex = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/;
        if (partialRegex.test(value)) {
            setSearch(value);
        }
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setValidatedSearch(value);
        debouncedSearch(value);
    };

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    useEffect(() => setFound(true), [previewData]);
    useEffect(() => setFound(false), [search]);

    const showErrorSnackbar = useCallback(
        (message: string, subtext?: string, Icon?: FC, iconColor?: string) => {
            if (!snackbar) {
                setSnackbar(
                    <ErrorSnackbar
                        text={message}
                        subtext={subtext}
                        onClose={() => setSnackbar(null)}
                        Icon={Icon}
                        iconColor={iconColor}
                    />
                );
            }
        },
        [snackbar]
    );

    const {
        posts,
        isFetching,
        refreshPosts,
        initializePosts,
        isRefreshing
    } = usePosts(showErrorSnackbar);

    useEffect(() => {
        if (data) {
            initializePosts(data);
        }
    }, [data, initializePosts, isLoading]);

    useInterval(() => {
        if (!isRefreshing) {
            refreshPosts(false);
        }
    }, 1e3);

    const handleAddChannel = () => {
        if (search.trim()) {
            const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{3,31}$/;

            if (!usernameRegex.test(search.trim())) {
                showErrorSnackbar(t("Invalid username format"));
                return;
            }

            const success = addChannel(search.trim());
            if (success) {
                setSearch('');
            } else {
                showErrorSnackbar(t("Channel already exists"));
            }
        }
    };

    const handleRemoveChannel = () => {
        removeChannel(search);
        setSearch('');
    }

    const onShare = () => {
        copyToClipboard(JSON.stringify(channelsUsernames));
    }

    return (
        <Panel>
            <FeedHeader isLoading={isLoading} />
            <FullscreenModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onShare={onShare}
                title={t("My channels")}
            >
                <Group>
                    <div className="flex">
                        <Search
                            value={search}
                            onChange={onChange}
                            after={null}
                            placeholder={t("Channel username")}
                            className="pr-0"
                        />
                        {platform === 'ios' && (
                            <IconButton label={t("Share")} onClick={onShare}>
                                <Icon24ShareExternalOutline />
                            </IconButton>
                        )}
                    </div>
                    <List>
                        {!search.length && channels.map((channel, index) => (
                            <Cell
                                key={`channel_${channel.username}_${index}`}
                                mode="removable"
                                before={<Avatar src={channel.avatar} />}
                                onRemove={() => removeChannel(channel.username)}
                                subtitle={`@${channel.username}`}
                            >
                                {channel.title}
                            </Cell>
                        ))}
                        {search.length > 0 && !previewLoading && previewData && found && (
                            <Cell
                                before={<Avatar src={previewData.channel.avatar} />}
                                after={
                                    channelsUsernames.includes(search) ? (
                                        <IconButton label={t("Remove")} onClick={handleRemoveChannel}>
                                            <Icon28RemoveCircleOutline />
                                        </IconButton>
                                    ) : (
                                        <IconButton label={t("Add")} onClick={handleAddChannel}>
                                            <Icon28AddCircleOutline />
                                        </IconButton>
                                    )
                                }
                                subtitle={`@${search}`}
                            >
                                {previewData.channel.title}
                            </Cell>
                        )}
                        {search.length > 0 && !previewData && !previewLoading && (
                            <Cell disabled className="block m-auto">
                                <Text className="text-center" normalize>{t("Nothing")}</Text>
                            </Cell>
                        )}
                        {channels.length === 0 && !isChannelsLoading && (
                            <Cell disabled className="block m-auto">
                                <Text className="text-center" normalize>{t("No channels added")}</Text>
                            </Cell>
                        )}
                        {isChannelsLoading && channels.length === 0 && (
                            <Cell disabled className="block m-auto">
                                <Text className="text-center" normalize>{t("Loading channels...")}</Text>
                            </Cell>
                        )}
                        {previewLoading && (
                            <Cell disabled className="block m-auto">
                                <Text className="text-center" normalize>{t("Searching...")}</Text>
                            </Cell>
                        )}
                    </List>
                </Group>
            </FullscreenModal>
            <SplitLayout center className="relative lg:right-8">
                {isLoading ? (
                    <>
                        <PostsSkeleton />
                        <ProfileSkeleton />
                    </>
                ) : (
                    <>
                        <Posts
                            posts={posts}
                            onRefresh={refreshPosts}
                            isFetching={isFetching}
                        />
                        <DesktopProfile />
                    </>
                )}
            </SplitLayout>
            {snackbar}
        </Panel>
    );
};
