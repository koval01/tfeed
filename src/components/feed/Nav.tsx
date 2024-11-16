import { Channel, TitleProps } from "@/types";

import { TextComponent } from "@/components/feed/TextComponent";
import { Verified } from "@/components/feed/Verified";
import { Avatar } from "@/components/Avatar";

import { Icon16Verified } from "@vkontakte/icons";
import { Button, Headline } from "@vkontakte/vkui";

import { useRouter } from "next/navigation";

const NavAvatar = ({ channel }: { channel: Channel }) => (
    <div className="inline-block overflow-hidden float-left mr-2 relative">
        <Avatar src={channel.avatar} size={36} name={channel.title.string} />
    </div>
)

const Title = ({ children, verified }: TitleProps) => (
    <div className="flex text-sm font-medium mt-0.5">
        <div className="whitespace-nowrap text-ellipsis overflow-hidden">
            {children}
        </div>
        {verified && (
            <div className="inline-block overflow-hidden size-4 ml-1 leading-4 align-baseline">
                <Verified className="inline-flex text-[--vkui--color_icon_accent]" Icon={Icon16Verified} />
            </div>
        )}
    </div>
)

const SubscribersCounter = ({ channel }: { channel: Channel }) => (
    <div className="whitespace-nowrap text-ellipsis overflow-hidden text-[12px] leading-[14px] mb-0.5 mt-px vkuiPlaceholder__text">
        {channel.counters.subscribers} subscribers
    </div>
)

const ChannelTitle = ({ channel }: { channel: Channel }) => (
    <Title verified={channel.labels.includes("verified")}>
        <TextComponent htmlString={channel.title.html} />
    </Title>
)

export const SubscribeButton = ({ channel }: { channel: Channel }) => (
    <div className="block mr-0 md:pr-0 pr-2 w-full">
        <Button
            appearance="accent-invariable"
            size="s"
            onClick={() => { window.open(`https://t.me/${channel.username}`, "_blank") }}
        >
            <Headline level="2">Subscribe</Headline>
        </Button>
    </div>
)

const Nav = ({ channel }: { channel: Channel }) => (
    <div className="flex items-center relative justify-between space-x-2 md:pl-0 pl-2 overflow-hidden py-1.5">
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
