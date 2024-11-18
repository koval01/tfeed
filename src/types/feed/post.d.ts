import { Channel, Post } from "@/types/body";

export interface PostsProps {
    channel: Channel;
    posts: Post[];
    onRefresh: () => void;
    isFetching: boolean;
    isFetchingMore: boolean;
    noMorePosts: boolean;
}

export interface PostProps {
    item: Post;
    channel: Channel;
}

export interface LoadingMoreProps {
    isFetchingMore: boolean;
    noMorePosts: boolean;
}

export interface PostBodyProps { channel: Channel, post: Post }
