import { type FC } from 'react';

import { PanelHeader } from "@vkontakte/vkui";

import { AppNav } from "@/components/feed/header/Nav";

interface FeedHeaderProps {
    isLoading: boolean;
}

export const FeedHeader: FC<FeedHeaderProps> = ({ isLoading }) => (
    <>
        <PanelHeader
            className="h-12"
            before={<AppNav />}
            after={
                !isLoading && (
                    <div className="relative max-md:-top-1 inline-block items-center overflow-hidden">
                        <div />
                    </div>
                )
            }
            delimiter='none'
            transparent
        />
        <div className="fixed z-[5] bg-white/70 dark:bg-black/70 h-12 w-screen">
            <div className="relative block h-full backdrop-blur-xl backdrop-saturate-[180%]">
                <div className="relative block h-full border-b dark:border-[#2f3336]" />
            </div>
        </div>
    </>
);
