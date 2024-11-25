import type { FC } from "react";
import type { ClassValue } from "clsx";
import type { Channel, Post } from "@/types/body";

export interface PostsProps {
    channel: Channel;
    posts: Post[];
    onRefresh: () => void;
    isFetching: boolean;
    isFetchingMore: boolean;
}

export interface PostProps {
    item: Post;
    channel: Channel;
}

export interface LoadingMoreProps {
    isFetchingMore: boolean;
}

export interface FooterComponentProps {
    Icon: FC;
    context: string;
    iconSize?: number;
    className?: ClassValue;
}

export interface PostBodyProps { channel: Channel, post: Post }
