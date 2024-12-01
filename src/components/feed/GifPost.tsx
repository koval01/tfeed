import type { Post } from "@/types";

import { Icon28GifOutline } from "@vkontakte/icons";
import { ContentBadge, Footnote } from "@vkontakte/vkui";

export const GifPost = ({ post }: { post: Post }) => {
    // Only render if media is GIF
    if (!post.content.media?.[0] || post.content.media[0].type !== "gif") {
        return null;
    }

    const media = post.content.media[0];
    const url = media.url;
    const thumb = media.thumb;

    return (
        <div className="block space-y-2 md:space-y-3">
            <video
                className="max-h-svh h-auto w-full"
                src={url}
                poster={thumb}
                controls={false}
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
            />
            <ContentBadge size="m" className="select-none">
                <ContentBadge.SlotIcon>
                    <Icon28GifOutline />
                </ContentBadge.SlotIcon>
                <Footnote weight="1" caps>
                    post
                </Footnote>
            </ContentBadge>
        </div>
    );
}
