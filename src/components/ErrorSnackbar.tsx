'use client'

import { FC } from "react";
import { Icon28ErrorCircleOutline } from "@vkontakte/icons";
import { Snackbar } from "@vkontakte/vkui";

interface ErrorSnackbarProps {
    text: string;
    onClose: () => void;
}

const ErrorSnackbar: FC<ErrorSnackbarProps> = ({ text, onClose }) => {
    return (
        <Snackbar
            onClose={onClose}
            before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
        >
            {text}
        </Snackbar>
    );
};

export default ErrorSnackbar;
