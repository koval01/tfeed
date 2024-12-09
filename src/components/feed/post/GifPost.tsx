import React from "react";
import type { Post } from "@/types";

import { Spacing } from "@vkontakte/vkui";

export const GifPost = React.memo(({ post }: { post: Post }) => {
    // Only render if media is GIF
    if (!post.content.media?.[0] || post.content.media[0].type !== "gif") {
        return null;
    }

    const media = post.content.media[0];
    const url = media.url;
    const thumb = media.thumb;

    return (
        <>
            {post.content.text && <Spacing size={12} />}
            <div className="block">
                <video
                    className="max-h-svh min-h-28 h-auto w-full rounded-lg"
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
        </>
    );
});

GifPost.displayName = "GifPost";
