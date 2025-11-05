import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalStorage } from '@/hooks/utils/useLocalStorage';
import { useChannels } from '@/hooks/services/useChannels';

export interface Channel {
    username: string;
    title: string;
    subscribers: string;
    description: string;
    avatar: string;
    is_verified: boolean;
}

export const useChannelsStorage = () => {
    const [channelsUsernames, setChannelsUsernames] = useLocalStorage<string[]>(
        'TF_channels',
        ["durov", "telegram", "lafaelka"]
    );

    const [channels, setChannels] = useState<Channel[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Use refs to track previous values and prevent infinite loops
    const previousUsernamesRef = useRef<string[]>([]);
    const isProcessingRef = useRef(false);

    // Memoize the unknown usernames calculation
    const getUnknownUsernames = useCallback(() => {
        const existingUsernames = new Set(channels.map(ch => ch.username));
        return channelsUsernames.filter(username => !existingUsernames.has(username));
    }, [channelsUsernames, channels]);

    const unknownUsernames = getUnknownUsernames();

    // Only fetch if there are unknown usernames AND they're different from previous
    const shouldFetch = unknownUsernames.length > 0 &&
        JSON.stringify(unknownUsernames) !== JSON.stringify(previousUsernamesRef.current);

    const { data: newChannelsData, isLoading: isChannelsLoading } = useChannels(
        shouldFetch ? unknownUsernames : null
    );

    // Effect for processing new channel data
    useEffect(() => {
        // Prevent concurrent processing
        if (isProcessingRef.current) return;

        if (newChannelsData && !isChannelsLoading && Object.keys(newChannelsData).length > 0) {
            isProcessingRef.current = true;

            const formattedChannels: Channel[] = Object.entries(newChannelsData)
                .filter(([_, channelData]) => channelData && channelData.channel)
                .map(([username, channelData]) => ({
                    username,
                    title: channelData.channel.title,
                    subscribers: channelData.channel.subscribers,
                    description: channelData.channel.description,
                    avatar: channelData.channel.avatar,
                    is_verified: channelData.channel.is_verified
                }));

            const receivedUsernames = new Set(formattedChannels.map(ch => ch.username));
            const missingUsernames = unknownUsernames.filter(username => !receivedUsernames.has(username));

            // Update usernames first (remove missing ones)
            if (missingUsernames.length > 0) {
                setChannelsUsernames(prev =>
                    prev.filter(username => !missingUsernames.includes(username))
                );
            }

            // Then update channels
            setChannels(prev => {
                const newChannels = formattedChannels.filter(
                    newChannel => !prev.some(existing => existing.username === newChannel.username)
                );
                return [...prev, ...newChannels];
            });

            setIsLoading(false);
            // Update previous usernames ref
            previousUsernamesRef.current = unknownUsernames;

            // Reset processing flag after state updates
            setTimeout(() => {
                isProcessingRef.current = false;
            }, 0);
        }
    }, [newChannelsData, isChannelsLoading, unknownUsernames, setChannelsUsernames]);

    // Effect for syncing channels with usernames - use a more specific condition
    useEffect(() => {
        const currentUsernames = new Set(channelsUsernames);
        const shouldUpdate = channels.some(channel => !currentUsernames.has(channel.username));

        if (shouldUpdate) {
            setChannels(prev => prev.filter(channel =>
                channelsUsernames.includes(channel.username)
            ));
        }
    }, [channelsUsernames, channels]); // Only update when channelsUsernames changes significantly

    const addChannel = useCallback((username: string) => {
        const normalizedUsername = username.trim().toLowerCase();
        if (!channelsUsernames.includes(normalizedUsername)) {
            const newUsernames = [...channelsUsernames, normalizedUsername];
            setChannelsUsernames(newUsernames);

            if (!channels.some(ch => ch.username === normalizedUsername)) {
                setIsLoading(true);
            }
            return true;
        }
        return false;
    }, [channelsUsernames, setChannelsUsernames, channels]);

    const removeChannel = useCallback((username: string) => {
        const normalizedUsername = username.trim().toLowerCase();
        const newUsernames = channelsUsernames.filter(u => u !== normalizedUsername);
        setChannelsUsernames(newUsernames);
    }, [channelsUsernames, setChannelsUsernames]);

    const clearChannels = useCallback(() => {
        setChannelsUsernames([]);
        setChannels([]);
    }, [setChannelsUsernames]);

    return {
        channels,
        channelsUsernames,
        isLoading: isLoading || isChannelsLoading,
        addChannel,
        removeChannel,
        clearChannels
    };
};
