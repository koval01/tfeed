import { Channel, Post } from "@/types/body";

export interface PostsProps {
    channel: Channel;
    posts: Post[];
    onRefresh: () => void;
    isFetching: boolean;
    isFetchingMore: boolean;
    noMorePosts: boolean;
}

export interface PostBodyProps { channel: Channel, post: Post }
