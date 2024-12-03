import React from "react";
import {
    Group,
    Paragraph,
    Placeholder,
    Spacing,
    SplitCol,
    Title,
    Skeleton,
    Flex,
    Footnote,
} from "@vkontakte/vkui";

import { random } from "lodash";

/**
 * **Profile Component**
 * A skeleton placeholder for the user profile sidebar.
 *
 * @returns The Profile skeleton component.
 */
export const Profile: React.FC = () => (
    <SplitCol
        width={280}
        maxWidth={280}
        className="max-lg:hidden ScrollStickyWrapper pt-3"
    >
        <div className="fixed w-[345px]">
            <Group className="select-none p-0">
                <Placeholder
                    icon={
                        <Skeleton
                            width={96}
                            height={96}
                            className="rounded-full"
                        />
                    }
                    header={
                        <Title>
                            <Skeleton width={250} />
                        </Title>
                    }
                    action={
                        <>
                            <Spacing size={12} />
                            <Paragraph>
                                <Skeleton width={170} />
                                <Skeleton width={200} />
                                <Skeleton width={140} />
                            </Paragraph>
                            <Spacing size={16} />
                            <Skeleton width={110} height={36} />
                        </>
                    }
                >
                    <Skeleton width={120} />
                </Placeholder>
            </Group>
        </div>
    </SplitCol>
);

/**
 * **PostHeader Component**
 * Displays a skeleton placeholder for the post header, including a user avatar and name.
 *
 * @returns The PostHeader skeleton component.
 */
const PostHeader: React.FC = () => (
    <Flex className="flex-row select-none">
        <Skeleton width={40} height={40} className="mr-3 rounded-full" />
        <div className="flex flex-col flex-auto mr-2.5">
            <Title level="3">
                <Skeleton width={180} />
            </Title>
            <Skeleton width={80} height={13} />
        </div>
    </Flex>
);

/**
 * **PostBody Component**
 * Displays a skeleton placeholder for the main body of a post.
 *
 * @returns The PostBody skeleton component.
 */
const PostBody: React.FC<{ length?: number }> = ({ length = 5 }) => (
    <Footnote weight="2" className="whitespace-pre-line">
        {Array.from({ length }).map((_, index) => (
            <Skeleton key={index} width={`${random(80, 100)}%`} />
        ))}
    </Footnote>
);

/**
 * **Post Component**
 * Combines PostHeader and PostBody to create a complete post skeleton.
 * Wrapped in React.memo for performance optimization.
 *
 * @returns The complete Post skeleton component
 */
export const Post: React.FC<{ rows?: number }> = React.memo(({ rows = 5 }) => (
    <Group>
        <div className="py-2.5 px-4">
            <PostHeader />
            <Spacing />
            <PostBody length={rows} />
        </div>
    </Group>
));

Post.displayName = "Post";

/**
 * **Posts Component**
 * Displays a skeleton placeholder for a list of posts.
 *
 * @returns The Posts skeleton component.
 */
export const Posts: React.FC = () => (
    <SplitCol
        width="100%"
        maxWidth="560px"
        stretchedOnMobile
        autoSpaced
        className="pt-3"
    >
        <div className="md:max-w-[680px] max-md:mx-0 max-lg:mx-auto px-0">
            {Array.from({ length: 10 }).map((_, index) => (
                <Post key={index} />
            ))}
        </div>
    </SplitCol>
);

/**
 * **ChannelNavSkeleton Component**
 * A skeleton placeholder for a channel navigation bar.
 *
 * @returns The ChannelNavSkeleton component.
 */
export const ChannelNavSkeleton: React.FC = () => (
    <div
        className="block select-none items-center space-x-2 pl-2 overflow-hidden py-1"
    >
        <div className="inline-block overflow-hidden float-left mr-2 relative">
            <Skeleton width={36} height={36} className="rounded-full" />
        </div>
        <div className="flex pt-2">
            <Skeleton width={120} height={13} />
        </div>
        <div className="mb-0.5 mt-px">
            <Skeleton width={100} height={10} />
        </div>
    </div>
);
