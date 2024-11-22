import { Channel, TitleProps } from "@/types";

import { TextComponent } from "@/components/feed/TextComponent";
import { Verified } from "@/components/feed/Verified";
import { Avatar } from "@/components/Avatar";

import { Icon16Verified } from "@vkontakte/icons";
import { Button, EllipsisText, Headline } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

const NavAvatar = ({ channel }: { channel: Channel }) => (
    <div className="inline-block items-baseline overflow-hidden float-left mr-2 relative">
        <Avatar src={channel.avatar} size={36} name={channel.title.string} />
    </div>
)

const Title = ({ children, verified }: TitleProps) => (
    <div className="inline-flex items-super text-sm font-medium relative -top-1">
        <div className="whitespace-nowrap text-ellipsis overflow-hidden">
            {children}
        </div>
        {verified && (
            <div className="inline-block overflow-hidden size-4 ml-1 leading-none">
                <Verified className="inline-flex text-[--vkui--color_icon_accent]" Icon={Icon16Verified} />
            </div>
        )}
    </div>
)

const SubscribersCounter = ({ channel }: { channel: Channel }) => {
    const { t } = useTranslation();

    return (
        <div className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] leading-[14px] pb-1 relative -top-1 vkuiPlaceholder__text">
            {channel.counters.subscribers} {t("subscribers")}
        </div>
    )
}

const ChannelTitle = ({ channel }: { channel: Channel }) => (
    <Title verified={channel.labels.includes("verified")}>
        <EllipsisText className="max-w-[calc(50vw-52px)]">
            <TextComponent htmlString={channel.title.html} />
        </EllipsisText>
    </Title>
)

export const SubscribeButton = ({ channel }: { channel: Channel }) => {
    const { t } = useTranslation();

    return (
        <div className="block pr-1 w-full">
            <Button
                appearance="accent-invariable"
                size="s"
                onClick={() => { window.open(`https://t.me/${channel.username}`, "_blank") }}
            >
                <Headline level="2">{t("Subscribe")}</Headline>
            </Button>
        </div>
    )
}

const Nav = ({ channel }: { channel: Channel }) => (
    <div className="flex items-center relative justify-between space-x-2 overflow-hidden py-1.5 md:pt-3">
        <div className="block select-none items-center">
            <NavAvatar channel={channel} />
            <ChannelTitle channel={channel} />
            <SubscribersCounter channel={channel} />
        </div>
    </div>
)

export const ChannelNav = ({ channel }: { channel?: Channel }) => (
    channel && <Nav channel={channel} />
)
