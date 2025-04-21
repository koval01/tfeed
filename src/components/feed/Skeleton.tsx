import React, { memo } from "react";

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

import { useWindowSize } from "@/hooks/utils/useWindowSize";

/**
 * **Profile Component**
 * A skeleton placeholder for the user profile sidebar.
 *
 * @returns The Profile skeleton component.
 */
export const Profile: React.FC = () => {
    const { isXl } = useWindowSize();

    return (
        <SplitCol
            width={280}
            maxWidth={280}
            className="max-lg:hidden ScrollStickyWrapper pt-3"
        >
            <div className="fixed w-[345px]">
                <Group className="select-none p-0" mode="plain">
                    <div className="relative block border dark:border-[#2f3336] rounded-2xl">
                        <Placeholder
                            className="pb-6 pt-10 sm:pt-8"
                            icon={
                                <Skeleton
                                    width={isXl ? 96 : 80}
                                    height={isXl ? 96 : 80}
                                    className="rounded-full"
                                />
                            }
                            title={
                                <Title Component="h1">
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
                    </div>
                </Group>
            </div>
        </SplitCol>
    )
};

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
            <Title level="3" Component="h3">
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
const PostBody: React.FC<{ length?: number, noAnimation?: boolean }> = (
    { length = 5, noAnimation = false }
) => (
    <Footnote weight="2" className="whitespace-pre-line" useAccentWeight>
        {Array.from({ length }).map((_, index) => (
            <Skeleton
                key={`skeleton__row_item_${index}`}
                width="100%"
                noAnimation={noAnimation}
            />
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
export const Post: React.FC<{ rows?: number, noAnimation?: boolean }> = memo((
    { rows = 5, noAnimation = false }
) => (
    <div>
        <Group mode="plain" className="py-0">
            <div className="border-b md:border-x dark:border-[#2f3336]">
                <div className="py-2 px-2.5">
                    <PostHeader />
                    <Spacing />
                    <PostBody length={rows} noAnimation={noAnimation} />
                </div>
            </div>
        </Group>
    </div>
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
        maxWidth="600px"
        stretchedOnMobile
        autoSpaced
        className="md:pt-0"
    >
        <div className="md:max-w-[680px] max-md:mx-0 max-lg:mx-auto px-0">
            <FeedProfileSkeleton />
            {Array.from({ length: 10 }).map((_, index) => (
                <Post key={`skeleton_post_${index}`} />
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
export const ChannelNavSkeleton: React.FC = memo(() => (
    <div
        className="relative max-md:-top-0.5 block select-none items-center space-x-2 py-1.5 pl-[5px] md:pt-3 overflow-hidden"
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
));
ChannelNavSkeleton.displayName = "ChannelNavSkeleton";

export const FeedProfileSkeleton = memo(() => {
    const { isSm } = useWindowSize();

    return (
        <Group mode="plain" className="lg:hidden py-0 select-none">
            <div className="w-full bg-white dark:bg-black border-b md:border-x dark:border-[#2f3336]">
                {/* Cover Photo */}
                <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full">
                    <Skeleton className="relative -top-1 rounded-none" width="100%" height="192px" />
                </div>

                <div className="relative px-4">
                    {/* Profile Picture */}
                    <div className="absolute -top-14 sm:-top-16 left-4 border-[3px] sm:border-4 border-white dark:border-black rounded-full">
                        <Skeleton width={isSm ? 128 : 96} height={isSm ? 128 : 96} className="rounded-full" />
                    </div>

                    {/* Follow Button */}
                    <div className="flex justify-end pt-3">
                        <Skeleton width={isSm ? 102 : 98} height={isSm ? 36 : 32} className="rounded-full" />
                    </div>

                    <div className="mt-10">
                        {/* Title with verified placeholder */}
                        <div className="flex items-center">
                            <Skeleton width={180} height={28} />
                        </div>

                        {/* Username */}
                        <Skeleton width={100} height={16} className="mt-1" />

                        <Spacing size={14} />

                        {/* Description */}
                        <div className="py-0.5 space-y-1">
                            <Skeleton width="100%" height={14} />
                            <Skeleton width="90%" height={14} />
                            <Skeleton width="80%" height={14} />
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-4 my-3">
                            <Skeleton width={60} height={16} />
                            <Skeleton width={60} height={16} />
                            <Skeleton width={60} height={16} />
                        </div>
                    </div>
                </div>
            </div>
        </Group>
    )
});

FeedProfileSkeleton.displayName = "FeedProfileSkeleton";
