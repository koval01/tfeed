import type { Channel } from '@/types';
import type { FC } from 'react';

import { PanelHeader } from "@vkontakte/vkui";

import { ChannelNav, SubscribeButton } from "@/components/feed/header/Nav";
import { ChannelNavSkeleton } from "@/components/feed/Skeleton";

interface FeedHeaderProps {
    channel: Channel;
    isLoading: boolean;
}

export const FeedHeader: FC<FeedHeaderProps> = ({ channel, isLoading }) => (
    <>
        <PanelHeader
            before={isLoading ? <ChannelNavSkeleton /> : <ChannelNav channel={channel} />}
            after={
                !isLoading && (
                    <div className="relative max-md:-top-1 inline-block items-center overflow-hidden lg:hidden">
                        <SubscribeButton channel={channel} />
                    </div>
                )
            }
            delimiter='none'
            shadow={false}
            transparent
        />
        <div className="fixed z-[5] bg-white/70 dark:bg-black/70 h-12 w-screen">
            <div className="relative block h-full backdrop-blur-xl backdrop-saturate-[180%]">
                <div className="relative block h-full border-b dark:border-[#2f3336]" />
            </div>
        </div>
    </>
);
