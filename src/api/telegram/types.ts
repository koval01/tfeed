export interface TelegramChannel {
    title: string;
    subscribers: string;
    is_verified: boolean;
    description?: string;
    avatar?: string;
}

export interface Preview {
    channel: TelegramChannel;
}

export interface ParserOptions {
    timeout?: number;
    retries?: number;
}

export interface ParserResponse<T> {
    success: boolean;
    data?: T;
    error?: Error;
}
