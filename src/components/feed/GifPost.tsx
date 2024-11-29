import type { Post } from "@/types";

export const GifPost = ({ post }: { post: Post }) => {
    // Only render if media is GIF
    if (!post.content.media?.[0] || post.content.media[0].type !== "gif") {
        return null;
    }

    const media = post.content.media[0];
    const url = media.url;
    const thumb = media.thumb;

    return (
        <video
            className="max-h-96 h-auto w-auto"
            src={url}
            poster={thumb}
            controls={false}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
        />
    );
}
