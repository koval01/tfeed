import type { Post, PreviewLink as PreviewLinkProp } from "@/types";

import { TextComponent } from "@/components/feed/TextComponent";
import { EllipsisText, Spacing } from "@vkontakte/vkui";

import "@/styles/components/previewLink.css";

const Preview = ({ preview }: { preview: PreviewLinkProp }) => (
    <>
        <Spacing />
        <a className="message_link_preview select-none" href={preview.url} target="_blank">
            {preview.thumb ?
                <i className="link_preview_right_image" style={{ backgroundImage: `url(${preview.thumb})` }} />
                : null}
            <div className="link_preview_site_name" dir="auto">
                {preview.site_name}
            </div>
            <div className="link_preview_title" dir="auto">
                <EllipsisText className="relative text-neutral-950 dark:text-neutral-200 opacity-100">
                    {preview.title}
                </EllipsisText>
            </div>
            <div className="link_preview_description text-neutral-700 dark:text-neutral-400" dir="auto">
                <TextComponent htmlString={preview.description?.html} />
            </div>
        </a>
    </>
);

export const PreviewLink = ({ post }: { post: Post }) => {
    const preview = post.content.preview_link;

    if (!preview?.site_name)
        return null;

    return preview && <Preview preview={preview} />;
};
