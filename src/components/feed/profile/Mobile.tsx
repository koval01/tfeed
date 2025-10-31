import { memo } from "react";
import { EllipsisText, Group, Header, HorizontalCell, HorizontalScroll } from "@vkontakte/vkui";
import { t } from "i18next";
import { Avatar } from "@/components/avatar/Avatar";
import { useChannels } from "@/hooks/services/useChannels";
import { FeedProfileItem } from "@/components/feed/Skeleton";

const Channels = () => {
    const channels = JSON.parse(window.localStorage.getItem("TF_channels") || "");
    const { data, error, isLoading } = useChannels(channels);

    return(
    <Group header={<Header>{t("Channels")}</Header>} mode="plain">
            <HorizontalScroll arrowSize="s">
                {isLoading && !error ? (
                    <FeedProfileItem />
                ) : (
                    data &&
                    Object.values(data).map(({ channel }, index) => (
                        <HorizontalCell
                            hasHover={false}
                            key={`feed_m_ch_${index}`}
                            size="s"
                            title={<EllipsisText>{channel.title}</EllipsisText>}
                        >
                            <Avatar src={channel.avatar} size={56} name={channel.title} />
                        </HorizontalCell>
                    ))
                )}
            </HorizontalScroll>
    </Group>
)
};

export const FeedProfile = memo(() => (
    <Group mode="plain" className="lg:hidden py-0 select-none">
        <div className="w-full bg-white dark:bg-black border-b md:border-x dark:border-[#2f3336]">
            <Channels />
        </div>
    </Group>
));
FeedProfile.displayName = "FeedProfile";
