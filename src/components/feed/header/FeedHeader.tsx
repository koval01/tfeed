import { type FC } from 'react';

import { IconButton, PanelHeader } from "@vkontakte/vkui";

import { AppNav } from "@/components/feed/header/Nav";
import { Icon28ListLikeFill } from '@vkontakte/icons';
import { useModal } from '@/contexts/ModalContext';
import { cn } from '@/lib/utils/clsx';

interface FeedHeaderProps {
    isLoading: boolean;
}

export const FeedHeader: FC<FeedHeaderProps> = ({ isLoading }) => {
    const { openModal, isModalOpen } = useModal();

    return (
        <>
            <PanelHeader
                className={cn("h-12 transition-opacity duration-300", isModalOpen ? 'opacity-0' : '')}
                before={<AppNav />}
                after={
                    !isLoading && (
                        <div className="relative inline-block items-center overflow-hidden">
                            <div className='block lg:hidden'>
                                <IconButton label="Button" onClick={openModal}>
                                    <Icon28ListLikeFill />
                                </IconButton>
                            </div>
                        </div>
                    )
                }
                delimiter='none'
                transparent
            />
            <div className={cn("fixed z-[5] bg-white/70 dark:bg-black/70 h-12 w-screen transition-opacity duration-300", isModalOpen ? 'opacity-0' : '')}>
                <div className="relative block h-full backdrop-blur-xl backdrop-saturate-[180%]">
                    <div className="relative block h-full border-b dark:border-[#2f3336]" />
                </div>
            </div>
        </>
    )
};
