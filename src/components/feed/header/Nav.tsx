import { Icons } from "@/components/ui/Icons";
import { DisplayTitle } from "@vkontakte/vkui";
import React from "react";

export const AppNav: React.FC = () => {
    return (
        <div className="flex items-center justify-between space-x-2 relative overflow-hidden">
            <div className="flex items-center select-none min-w-40 relative">
                <Icons.logo className="fixed left-1/2 -translate-x-1/2 size-10 text-black dark:text-white lg:hidden" />
                <DisplayTitle level="1" className="fixed left-1/2 -translate-x-1/2 text-black dark:text-white max-lg:hidden">
                    Telegram Feed
                </DisplayTitle>
            </div>
        </div>
    );
};
