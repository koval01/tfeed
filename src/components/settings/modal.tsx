import React from "react";

import { Button, ButtonGroup, ModalCardBase, PopoutWrapper, Spacing } from "@vkontakte/vkui";

import { useTranslation } from "react-i18next";

interface ModalProps {
    header: string | TemplateStringsArray | (string | TemplateStringsArray)[];
    subheader: string | TemplateStringsArray | (string | TemplateStringsArray)[];
    content: React.JSX.Element;
    icon?: React.JSX.Element | null;
    onClose: (e: any) => void;
    onUpdate?: (e: any) => void;
    disabled: boolean;
    actionButtonText?: string
}

const Modal = ({ header, subheader, content, icon, onClose, onUpdate, disabled, actionButtonText }: ModalProps) => {
    const { t } = useTranslation();

    return (
        <PopoutWrapper onClick={onClose}>
            <ModalCardBase
                style={{ minWidth: 340 }}
                icon={icon}
                header={t(header)}
                subheader={t(subheader)}
                dismissButtonMode="none"
                actions={
                    <React.Fragment>
                        <Spacing size={16} />
                        <ButtonGroup mode="horizontal" gap="s" stretched>
                            <Button size="l" mode="primary" stretched onClick={onUpdate} disabled={disabled}>
                                {t(actionButtonText || "Save")}
                            </Button>
                            <Button size="l" mode="secondary" stretched onClick={onClose} disabled={disabled}>
                                {t("Close")}
                            </Button>
                        </ButtonGroup>
                    </React.Fragment>
                }
            >
                {content}
            </ModalCardBase>
        </PopoutWrapper>
    );
}

export default Modal;
