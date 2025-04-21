import React from "react";
import type { Post } from "@/types";

import { Icon28StickerSmileOutline } from "@vkontakte/icons";
import { Div, Headline, Spacing } from "@vkontakte/vkui";
import { LazyImage as Image } from "@/components/media/LazyImage";
import { t } from "i18next";

const Fallback = () => (
    <Div>
        <div className="flex">
            <Icon28StickerSmileOutline className="m-auto justify-center" width={96} height={96} />
        </div>
        <Headline className="text-center" Component="h4">
            {t("error_sticker")}
        </Headline>
    </Div>
);

const ImageSticker = ({ url }: { url: string }) => (
    <div className="relative block w-fit h-auto">
        <Image
            src={url}
            alt={"Sticker"}
            widthSize={"100%"}
            heightSize={"100%"}
            fallbackIcon={<Fallback />}
            noBorder
            keepAspectRatio
            withTransparentBackground
            className="!max-w-72 !min-w-full rounded-none aspect-square"
        />
    </div>
)

const StickerComponent = ({ post }: { post: Post }) => {
    const media = post.content.media[0];
    const url = media?.url;
    const thumb = media.thumb;

    if (/\.webm(\?|$)/i.test(url || "")) {
        return (<video
            className="max-h-72 w-auto !rounded-none"
            src={url}
            poster={thumb}
            controls={false}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
        />)
    }

    if (/\.(webp|png)(\?|$)/i.test(url || "")) {
        return <ImageSticker url={url as string} />;
    }

    return (
        <div className="max-w-72 opacity-50">
            <Fallback />
        </div>
    );
}

export const Sticker = React.memo(({ post }: { post: Post }) => {
    // Only render if media is round video
    if (!post.content.media?.[0] || post.content.media[0].type !== "sticker") {
        return null;
    }

    return (
        <div className="relative block min-h-72">
            {post.content.text && <Spacing size={12} />}
            <StickerComponent post={post} />
        </div>
    );
});

Sticker.displayName = "Sticker";
