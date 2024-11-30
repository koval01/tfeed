import type { Post } from "@/types";

import { Icon28StickerSmileOutline } from "@vkontakte/icons";
import { ContentBadge, Footnote, Image } from "@vkontakte/vkui";

const ImageSticker = ({ url }: { url: string }) => (
    <Image
        src={url}
        alt={"Sticker"}
        widthSize={"auto"}
        heightSize={"auto"}
        fallbackIcon={
            <Icon28StickerSmileOutline width={96} height={96} />
        }
        noBorder
        keepAspectRatio
        withTransparentBackground
        className="!max-w-72 rounded-none"
    />
)

const StickerComponent = ({ post }: { post: Post }) => {
    const media = post.content.media[0];
    const url = media.url;
    const thumb = media.thumb;

    return (
        /\.webm(\?|$)/i.test(url) ?
            (
                <video
                    className="max-h-72 w-auto !rounded-none"
                    src={url}
                    poster={thumb}
                    controls={false}
                    autoPlay
                    muted
                    loop
                    playsInline
                    disablePictureInPicture
                />
            ) : <ImageSticker url={url} />
    );
}

export const Sticker = ({ post }: { post: Post }) => {
    // Only render if media is round video
    if (!post.content.media?.[0] || post.content.media[0].type !== "sticker") {
        return null;
    }

    return (
        <div className="block space-y-2 md:space-y-3">
            <StickerComponent post={post} />
            <ContentBadge size="m">
                <ContentBadge.SlotIcon>
                    <Icon28StickerSmileOutline />
                </ContentBadge.SlotIcon>
                <Footnote weight="1" caps>
                    post
                </Footnote>
            </ContentBadge>
        </div>
    );
}
