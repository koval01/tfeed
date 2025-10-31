interface Channel {
    title: string;
    subscribers: string;
    description: string;
    avatar: string;
    is_verified: boolean;
}

export interface ChannelsData {
    [key: string]: {
        channel: Channel;
    };
}
