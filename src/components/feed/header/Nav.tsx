import { DisplayTitle } from "@vkontakte/vkui";
import React from "react";

export const AppNav: React.FC = () => {
    return (
        <div className="flex items-center justify-between space-x-2 relative overflow-hidden">
            <div className="flex items-center select-none min-w-40 relative">
                <DisplayTitle level="1" className="text-neutral-700 dark:text-white fixed left-1/2 -translate-x-1/2">
                    TFeed
                </DisplayTitle>
            </div>
        </div>
    );
};
