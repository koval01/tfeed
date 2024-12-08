import type { PollOptions, Poll as PollProp } from "@/types";

import {
    Caption,
    FormItem,
    Headline,
    Progress,
    Subhead
} from "@vkontakte/vkui";

import { t } from "i18next";

/**
 * Header component for the Poll.
 * Displays the poll question, type, and total votes.
 */
const PollHeader = ({ poll }: { poll: PollProp }): JSX.Element => (
    <>
        <Headline weight="1" level="2" Component="h4" useAccentWeight>
            {poll.question}
        </Headline>
        <div className="flex space-x-1.5 text-[--vkui--color_text_secondary]">
            <Subhead className="font-normal text-xs" Component="h5">{t(poll.type)}</Subhead>
            <span className="align-top leading-3">|</span>
            <Caption>{poll.votes} {t("votes")}</Caption>
        </div>
    </>
);

/**
 * Single poll option with a progress bar and percentage display.
 */
const PollOption = ({ option }: { option: PollOptions }): JSX.Element => (
    <div className="flex items-center relative justify-between max-md:pt-1 pt-3 pb-0">
        <div className="block w-full">
            <FormItem
                id="progresslabel"
                className="p-0 pr-2"
                top={option.name}
                topComponent="h5">
                <Progress aria-labelledby="progresslabel" value={option.percent} />
            </FormItem>
        </div>
        <div className="flex w-[34px] items-center whitespace-nowrap overflow-hidden text-neutral-500">
            {option.percent}%
        </div>
    </div>
);

/**
 * Main Poll component that displays a question, its options, and voting statistics.
 */
export const Poll = ({ poll }: { poll: PollProp }): JSX.Element => (
    <div className="block mt-2 break-words text-sm">
        <PollHeader poll={poll} />
        <div className="block min-w-[240px] text-xs mb-2.5">
            {poll.options.map((item, index) => (
                <PollOption key={`poll__option_item_${poll.votes}_${index}`} option={item} />
            ))}
        </div>
    </div>
);
