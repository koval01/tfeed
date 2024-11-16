import { cn } from "@/lib/utils";

import {
    Group, 
    Paragraph, 
    Placeholder, 
    Spacing, 
    SplitCol, 
    Title,
    Skeleton,
    useAdaptivityConditionalRender, 
    Flex,
    Footnote
} from "@vkontakte/vkui";

export const Profile = () => {
    const { viewWidth } = useAdaptivityConditionalRender();

    return viewWidth.tabletPlus && (
        <SplitCol className={cn(viewWidth.tabletPlus.className, "ScrollStickyWrapper")} width={280} maxWidth={280}>
            <div className="fixed" style={{ width: "345px" }}>
                <Group className="select-none p-0">
                    <Placeholder
                        icon={<Skeleton width={96} height={96} className="rounded-full" />}
                        header={<Title><Skeleton width={250} /></Title>}
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
}

const PostHeader = () => (
    <Flex className="flex-row select-none">
        <Skeleton width={40} height={40} className="mr-3 rounded-full" />
        <div className="flex flex-col flex-auto mr-2.5">
            <div>
                <Title level="3">
                    <Skeleton width={180} />
                </Title>
            </div>
            <div>
                <Skeleton width={80} height={13} />
            </div>
        </div>
    </Flex>
);

const PostBody = () => (
    <Footnote weight="2" className="whitespace-pre-line">
        <Skeleton width="95%" />
        <Skeleton width="100%" />
        <Skeleton width="90%" />
        <Skeleton width="80%" />
        <Skeleton width="85%" />
    </Footnote>
);

export const Posts = () => (
    <SplitCol width="100%" maxWidth="560px" stretchedOnMobile autoSpaced>
        {[...Array(10)].map((_, index) => (
            <Group key={index}>
                <div className="py-2.5 px-4">
                    <PostHeader />
                    <Spacing />
                    <PostBody />
                </div>
            </Group>
        ))}
    </SplitCol>
);

export const ChannelNavSkeleton = () => (
    <div className="block select-none items-center space-x-2 md:pl-0 pl-2 overflow-hidden py-1.5">
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
)
