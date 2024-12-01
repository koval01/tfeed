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
        <div className="block">
            <video
                className="max-h-svh h-auto w-full rounded-lg"
                src={url}
                poster={thumb}
                controls={false}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
            />
        </div>
    );
}
