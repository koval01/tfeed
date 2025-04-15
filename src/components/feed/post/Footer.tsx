"use client";

import { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import type {
    LoadingMoreProps
} from "@/types/feed/post";

import { Title, Subhead, Group } from '@vkontakte/vkui';

import { selectNoLoadMore } from '@/lib/store';
import { t } from "i18next";

import { Icons } from "@/components/ui/Icons";

/**
 * Animated ripple loader component with proper centering
 */
const RippleLoader = () => (
    <div className="flex justify-center items-center h-32 py-4">
        <div className="relative flex items-center justify-center size-20">
            {/* Ripple layers */}
            <span className="absolute inset-0 rounded-full bg-[--vkui--color_background_accent] opacity-10 dark:opacity-15 animate-ripple-slow scale-0 origin-center"></span>
            <span className="absolute inset-0 rounded-full bg-[--vkui--color_background_accent] opacity-15 dark:opacity-20 animate-ripple-medium scale-0 origin-center animation-delay-300"></span>
            <span className="absolute inset-0 rounded-full bg-[--vkui--color_background_accent] opacity-20 dark:opacity-25 animate-ripple-fast scale-0 origin-center animation-delay-600"></span>

            {/* Central icon */}
            <div className="z-10 size-14 bg-[--vkui--color_background_secondary] dark:bg-[--vkui--color_background_tertiary] rounded-full flex items-center justify-center 
                     shadow-sm dark:shadow-none border border-[--vkui--color_background_accent]">
                <Icons.logo className="size-7 text-[--vkui--color_text_primary] animate-pulse-slow" />
            </div>
        </div>
    </div>
);

/**
 * End of content component with elegant styling
 */
const EndOfContent = () => (
    <div className="relative text-center">
        <Title
            className="opacity-80 bg-clip-text text-transparent bg-gradient-to-r from-[--vkui--color_text_secondary] to-[--vkui--color_text_tertiary]"
            weight="2"
            level="2"
        >
            {t("feedTheEnd")}
        </Title>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5 mt-0.5 bg-gradient-to-r from-transparent via-[--vkui--color_background_accent] to-transparent opacity-20 dark:opacity-40 animate-pulse-slow"></div>
    </div>
);

/**
 * Loading status message with timeout for long wait message
 */
const useLoadingMessage = (isFetchingMore: boolean) => {
    const [showLongWaitMessage, setShowLongWaitMessage] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isFetchingMore) {
            timerRef.current = setTimeout(() => {
                setShowLongWaitMessage(true);
            }, 5e3);
        } else {
            timerRef.current && clearTimeout(timerRef.current);
            setShowLongWaitMessage(false);
        }

        return () => {
            timerRef.current && clearTimeout(timerRef.current);
        };
    }, [isFetchingMore]);

    return showLongWaitMessage ? t("loadingMoreWaitMore") : t("loadingMoreWait");
};

/**
 * Main infinite feed loader component
 */
export const InfiniteFeedLoader = memo(({ isFetchingMore }: LoadingMoreProps) => {
    const noMorePosts = useSelector(selectNoLoadMore);
    const loadingMessage = useLoadingMessage(isFetchingMore);

    return (
        <Group mode="plain" className="py-0 flex justify-center items-center">
            <div className="relative w-full pt-10 pb-12 md:border-x dark:border-[#2f3336]">
                {noMorePosts ? (
                    <EndOfContent />
                ) : (
                    <>
                        <div className="block">
                            {isFetchingMore && <RippleLoader />}
                        </div>
                        <div className="block text-center">
                            <Subhead className="opacity-50" weight="2">
                                {loadingMessage}
                            </Subhead>
                        </div>
                    </>
                )}
            </div>
        </Group>
    );
});

InfiniteFeedLoader.displayName = "InfiniteFeedLoader";
