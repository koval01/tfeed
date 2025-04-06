import type { Channel, Post } from "@/types";

export const handleRedirect = (channel: Channel, post: Post) => {
    window.open(`https://t.me/${channel.username}/${post.id}`, "_blank");
}
