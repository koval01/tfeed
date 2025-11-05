interface Channel {
    title: string;
    subscribers: string;
    description: string;
    avatar: string;
    is_verified: boolean;
}

export interface PreviewData {
    channel: Channel;
}

export interface ChannelsData {
    [key: string]: {
        channel: Channel;
    };
}
