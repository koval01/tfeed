interface Channel {
    title: string;
    subscribers: string;
    is_verified: boolean;
    description?: string;
    avatar?: string;
}

export interface Preview {
    channel: Channel;
}
