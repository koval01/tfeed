import { AxiosError } from "axios";

interface ErrorActions {
    click: () => void;
    name: string;
}

export interface Error {
    header?: string;
    description?: string;
    actions?: ErrorActions;
    error?: AxiosError
}

export interface ServerError {
    detail?: string;
}
