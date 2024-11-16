import { FC } from "react";

import { Subhead, Tooltip } from "@vkontakte/vkui";

import { Icon16VerifiedProps } from "@vkontakte/icons/dist/typings/16/verified_16";
import { Icon20VerifiedProps } from "@vkontakte/icons/dist/typings/20/verified_20";

interface VerifiedProps {
    className: string;
    Icon: FC<Icon20VerifiedProps> | FC<Icon16VerifiedProps>;
    channelName?: string;
}

const Header = () => (
    <span className="font-semibold text-[--vkui--color_text_link] block text-left">
        Verified channel
    </span>
)

const Message = ({ channelName }: { channelName?: string }) => (
    channelName ?
        <>This popup confirms that the <b className="text-[--vkui--color_icon_accent]">{channelName}</b> is indeed verified.</>
        :
        "This pop-up window is a confirmation that this channel is really verified."
)

const Content = ({ channelName }: { channelName?: string }) => (
    <div className="mt-2">
        <Subhead className="text-left">
            <Message channelName={channelName} />
        </Subhead>
    </div>
)

export const Verified = ({ className, Icon, channelName }: VerifiedProps) => (
    <Tooltip 
        header={<Header />} 
        text={<Content channelName={channelName} />}
    >
        <Icon className={className} />
    </Tooltip>
)
