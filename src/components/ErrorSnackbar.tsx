'use client'

import { FC } from "react";
import { Icon28ErrorCircleOutline } from "@vkontakte/icons";
import { Snackbar } from "@vkontakte/vkui";

interface ErrorSnackbarProps {
    text: string;
    onClose: () => void;
    Icon?: FC;
    iconColor?: string | null;
}

const ErrorSnackbar: FC<ErrorSnackbarProps> = ({ 
    text, 
    onClose, 
    Icon = Icon28ErrorCircleOutline, 
    iconColor = "--vkui--color_icon_negative" 
}) => {
    return (
        <Snackbar
            onClose={onClose}
            before={<Icon fill={!iconColor ? "" : `var(${iconColor})`} />}
        >
            {text}
        </Snackbar>
    );
};

export default ErrorSnackbar;
