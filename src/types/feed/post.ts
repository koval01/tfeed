import { Channel, Post } from "@/types/body";

export interface PostsProps {
    channel: Channel;
    posts: Post[];
    onRefresh: () => void;
    isFetching: boolean;
}

export interface PostBodyProps { channel: Channel, post: Post }
