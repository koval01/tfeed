import type { Post, PreviewLink as PreviewLinkProp } from "@/types";

import { TextComponent } from "@/components/feed/TextComponent";
import { EllipsisText, Spacing } from "@vkontakte/vkui";

import "@/styles/components/previewLink.css";

const Preview = ({ preview }: { preview: PreviewLinkProp }) => {
    const _preview = preview.thumb ? preview.thumb : "/web-app-manifest-512x512.png";

    return (
        <>
            <Spacing />
            <a className="message_link_preview" href={preview.url} target="_blank">
                <i className="link_preview_right_image" style={{ backgroundImage: `url(${_preview})` }}></i>
                <div className="link_preview_site_name" dir="auto">
                    {preview.site_name}
                </div>
                <div className="link_preview_title" dir="auto">
                    <EllipsisText className="relative text-neutral-950 dark:text-neutral-200 opacity-100">
                        {preview.title}
                    </EllipsisText>
                </div>
                <div className="link_preview_description text-neutral-700 dark:text-neutral-600" dir="auto">
                    <TextComponent htmlString={preview.description?.html} />
                </div>
            </a>
        </>
    )
};

export const PreviewLink = ({ post }: { post: Post }) => {
    const preview = post.content.preview_link;

    if (!preview?.site_name)
        return null;

    return preview && <Preview preview={preview} />;
};
