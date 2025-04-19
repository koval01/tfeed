import { memo } from "react";
import type { Channel, Counters, TitleProps } from "@/types";

import { useWindowSize } from "@/hooks/utils/useWindowSize";

import { Icon20Verified } from "@vkontakte/icons";
import { DisplayTitle, EllipsisText, Group, Paragraph, Spacing } from "@vkontakte/vkui";

import { Verified as VerifiedTT } from "@/components/feed/post/Verified";
import { TextComponent } from "@/components/feed/TextComponent";
import { Avatar } from "@/components/avatar/Avatar";

import { Trans } from "react-i18next";
import { cn } from "@/lib/utils/clsx";


const Verified = ({ verified }: { verified: boolean }) => (
    verified && <VerifiedTT className="align-baseline inline-block text-[--vkui--color_icon_accent]" Icon={Icon20Verified} />
);

const Title = ({ children, verified }: TitleProps) => (
    <div className="inline-flex items-center max-w-60">
        <DisplayTitle className="!leading-7 w-full whitespace-nowrap text-lg lg-h:text-xl" level="3">
            <EllipsisText>{children}</EllipsisText>
        </DisplayTitle>
        <div className="inline ml-1"><Verified verified={verified} /></div>
    </div>
);

const Description = ({ html }: { html: string }) => (
    <Paragraph className="select-text text-xs md-h:text-sm lg-h:text-base">
        <TextComponent htmlString={html} />
    </Paragraph>
);

const StatsItem = ({ tkey, value }: { tkey: string; value: number }) => (
    <span className="relative">
        <strong>{value}</strong> <Trans i18nKey={tkey} />
    </span>
);

const Stats = ({ counters }: { counters: Counters }) => (
    <div className="flex flex-wrap gap-4 text-sm my-3">
        {Object.entries(counters).map(([key, value]) => (
            <StatsItem key={`stats_counter__${key}`} tkey={key} value={value} />
        ))}
    </div>
);

const FollowButton = ({ username }: { username: string }) => (
    <button
        className={cn(
            "px-3 sm:px-4 py-1.5 sm:py-2 max-sm:text-sm",
            "bg-black dark:bg-white text-white dark:text-black transition",
            "hover:bg-gray-800 dark:hover:bg-gray-200",
            "font-bold rounded-full"
        )}
        onClick={() => window.open(`https://t.me/${username}`, "_blank")}
    >
        Subscribe
    </button>
);

const ProfilePicture = ({ avatar, title }: { avatar: string | undefined; title: string }) => {
    const { isSm } = useWindowSize();

    return (
        <div className="absolute -top-14 sm:-top-16 left-4 border-[3px] sm:border-4 border-white dark:border-black rounded-full">
            <div className="size-24 sm:size-32 rounded-full bg-gray-300 dark:bg-gray-700">
                <Avatar size={isSm ? 128 : 96} src={avatar ?? ""} name={title} />
            </div>
        </div>
    );
};

const CoverPhoto = ({ avatar }: { avatar: string | undefined }) => (
    <div className="h-48 bg-gray-200 dark:bg-gray-800 w-full">
        <div
            style={{ backgroundImage: `url("${avatar ?? ""}")` }}
            className="relative block h-full w-full bg-[length:56px_56px] sm:bg-[length:72px_72px] bg-[center_top_1rem]"
        >
            <div className="relative w-full h-full backdrop-blur" />
        </div>
    </div>
);

const Username = ({ username }: { username: string }) => (
    <p className="text-gray-500">@{username}</p>
);

export const FeedProfile = memo(({ channel }: { channel: Channel }) => (
    <Group mode="plain" className="lg:hidden py-0 select-none">
        <div className="w-full bg-white dark:bg-black border-b md:border-x dark:border-[#2f3336]">
            <CoverPhoto avatar={channel.avatar} />
            <div className="relative px-4">
                <ProfilePicture avatar={channel.avatar} title={channel.title.string} />
                <div className="flex justify-end pt-3">
                    <FollowButton username={channel.username} />
                </div>
                <div className="mt-10">
                    <Title verified={channel?.labels?.includes("verified") ?? false}>
                        <TextComponent htmlString={channel.title.html} />
                    </Title>
                    <Username username={channel.username} />
                    <Spacing size={14} />
                    <div className="py-0.5 select-text">
                        {channel.description && <Description html={channel.description.html} />}
                    </div>
                    <Stats counters={channel.counters} />
                </div>
            </div>
        </div>
    </Group>
));
FeedProfile.displayName = "FeedProfile";
