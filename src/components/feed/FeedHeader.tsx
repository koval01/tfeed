import type { FC } from 'react';
import type { Channel } from '@/types';

import { PanelHeader } from "@vkontakte/vkui";

import { ChannelNav, SubscribeButton } from "@/components/feed/Nav";
import { ChannelNavSkeleton } from "@/components/feed/Skeleton";

interface FeedHeaderProps {
    channel: Channel;
    isLoading: boolean;
}

export const FeedHeader: FC<FeedHeaderProps> = ({ channel, isLoading }) => (
    <PanelHeader
        before={isLoading ? <ChannelNavSkeleton /> : <ChannelNav channel={channel} />}
        after={
            !isLoading && (
                <div className="inline-block items-center overflow-hidden lg:hidden">
                    <SubscribeButton channel={channel} />
                </div>
            )
        }
    />
);
