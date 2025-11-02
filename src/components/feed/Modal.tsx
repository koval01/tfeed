import React from 'react';
import {
    ModalRoot,
    ModalPage,
    ModalPageHeader,
    PanelHeaderClose,
    PanelHeaderButton,
    Group,
    Text,
    usePlatform,
    useAdaptivityConditionalRender,
} from '@vkontakte/vkui';
import { Icon24Dismiss } from '@vkontakte/icons';

interface FullscreenModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

export const FullscreenModal: React.FC<FullscreenModalProps> = ({
    isOpen,
    onClose,
    title = 'Modal',
    children,
}) => {
    const { sizeX } = useAdaptivityConditionalRender();
    const platform = usePlatform();

    const modal = (
        <ModalRoot activeModal={isOpen ? 'fullscreen' : null} onClose={onClose}>
            <ModalPage
                id="fullscreen"
                onClose={onClose}
                settlingHeight={100}
                hideCloseButton={platform === 'ios'}
                header={
                    <ModalPageHeader
                        before={
                            sizeX.compact &&
                            platform === 'android' && (
                                <PanelHeaderClose
                                    className={sizeX.compact.className}
                                    onClick={onClose}
                                />
                            )
                        }
                        after={
                            platform === 'ios' && (
                                <PanelHeaderButton onClick={onClose}>
                                    <Icon24Dismiss />
                                </PanelHeaderButton>
                            )
                        }
                    >
                        {title}
                    </ModalPageHeader>
                }
            >
                {children || (
                    <Group>
                        <Text>Nothing here</Text>
                    </Group>
                )}
            </ModalPage>
        </ModalRoot>
    );

    return modal;
};
