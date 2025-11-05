import React, { memo } from "react";

import {
    Group,
    Spacing,
    SplitCol,
    Title,
    Skeleton,
    Flex,
    Footnote,
    HorizontalScroll,
    Header,
    HorizontalCell,
    ButtonGroup,
    Button,
    CustomScrollView,
    SimpleCell,
    EllipsisText,
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
        <SplitCol className="max-lg:hidden pt-3 ScrollStickyWrapper" width={280} maxWidth={280}>
                <div className="fixed w-[345px]">
                    <Group className="select-none p-0" mode="plain">
                        <div className="relative block border dark:border-[#2f3336] rounded-2xl pt-2">
                            <CustomScrollView className="h-96">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <SimpleCell
                                    key={`ske_feed_d_ch_${index}`}
                                    before={<Skeleton width={48} height={48} className="rounded-full" />}
                                    subtitle={
                                    <EllipsisText>
                                            <Skeleton width={64} height={12} />
                                    </EllipsisText>}
                                >
                                    <EllipsisText>
                                        <Skeleton width={150} height={16} />
                                    </EllipsisText>
                                </SimpleCell>
                            ))}
                            </CustomScrollView>
                        </div>
                    </Group>
                    <div className="block pt-2 m-auto">
                        <ButtonGroup mode="vertical" gap="m" className="min-w-48 block">
                        <Skeleton width={"100%"} height={36} />
                        </ButtonGroup>
                    </div>
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

export const FeedProfileItem = () => (
    <>
        {Array.from({ length: 5 }).map((_, index) => (
            <HorizontalCell hasHover={false} key={`skeleton_av_feed_${index}`} size="s" title={<Skeleton width={36} height={10} />}>
                <Skeleton height={56} width={56} className="rounded-full" />
            </HorizontalCell>
        ))}
    </>
)

export const FeedProfileSkeleton = () => (
    <Group mode="plain" className="lg:hidden py-0 select-none">
        <div className="w-full bg-white dark:bg-black border-b md:border-x dark:border-[#2f3336]">
            <Group header={<Header><Skeleton width={64} height={16} /></Header>} mode="plain">
                <HorizontalScroll arrowSize="s" showArrows={false} >
                    <FeedProfileItem />
                </HorizontalScroll>
            </Group>
        </div>
    </Group>
);
