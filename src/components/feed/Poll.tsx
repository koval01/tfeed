import type { Poll as PollProp, PollOptions } from "@/types";

import { Icon20CheckSquareOutline } from "@vkontakte/icons";
import {
    Caption,
    FormItem,
    Headline,
    Progress,
    Subhead
} from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

const PollHeader = ({ poll }: { poll: PollProp }) => {
    const { t } = useTranslation();

    return (
        <>
            <Headline weight="1" level="2" className="text-[--vkui--color_text_contrast]">
                {poll.question}
            </Headline>
            <div className="flex space-x-1.5 text-[--vkui--color_text_muted]">
                <div>
                    <Subhead className="font-normal text-xs">
                        {t(poll.type)}
                    </Subhead>
                </div>
                <div>
                    <span className="align-top leading-3 text-[--vkui--color_text_secondary]">|</span>
                </div>
                <div>
                    <Caption>
                        {poll.votes} {t("votes")}
                    </Caption>
                </div>
            </div>
        </>
    );
}

const PollOption = ({ option }: { option: PollOptions }) => (
    <div className="flex items-center relative justify-between max-md:pt-1 pt-3 pb-0">
        <div className="block w-full">
            <FormItem id="progresslabel" className="p-0 pr-2" top={option.name}>
                <Progress aria-labelledby="progresslabel" value={option.percent} />
            </FormItem>
        </div>
        <div className="flex w-8 items-center whitespace-nowrap overflow-hidden vkuiPlaceholder__text">
            {option.percent}%
        </div>
    </div>
)

export const Poll = ({ poll }: { poll: PollProp }) => (
    <div className="block mt-2 break-words text-sm">
        <PollHeader poll={poll} />
        <div className="block min-w-[240px] text-xs mb-2.5">
            {poll.options.map((item, index) =>
                <PollOption key={index} option={item} />
            )}
        </div>
    </div>
);
