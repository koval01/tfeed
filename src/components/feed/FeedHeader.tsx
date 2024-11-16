import { FC } from 'react';

import { PanelHeader } from "@vkontakte/vkui";

import { Channel } from '@/types';

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
            <div className="inline-block items-center overflow-hidden lg:hidden">
                <SubscribeButton channel={channel} />
            </div>
        }
    />
);
