import { FC } from "react";

import { Subhead, Tooltip } from "@vkontakte/vkui";

import { Icon16VerifiedProps } from "@vkontakte/icons/dist/typings/16/verified_16";
import { Icon20VerifiedProps } from "@vkontakte/icons/dist/typings/20/verified_20";

interface VerifiedProps {
    className: string;
    Icon: FC<Icon20VerifiedProps> | FC<Icon16VerifiedProps>;
}

const Header = () => (
    <span className="font-semibold text-[--vkui--color_text_link] block text-left">
        Verified channel
    </span>
)

const Content = () => (
    <div className="mt-2">
        <Subhead className="text-left">
            This pop-up window is a confirmation that this action channel is verified.
        </Subhead>
    </div>
)

export const Verified = ({ className, Icon }: VerifiedProps) => (
    <Tooltip 
        header={<Header />} 
        text={<Content />}
    >
        <Icon className={className} />
    </Tooltip>
)
