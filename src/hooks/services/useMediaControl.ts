import { useCallback } from 'react';
import { useMedia } from '@/contexts/MediaContext';

export const useMediaControl = () => {
    const { pauseAllMedia } = useMedia();

    const stopAllMedia = useCallback(() => {
        pauseAllMedia();
    }, [pauseAllMedia]);

    return { stopAllMedia };
};
