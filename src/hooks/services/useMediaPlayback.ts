import { useEffect, useCallback } from 'react';
import { useMedia } from '@/contexts/MediaContext';

import ReactPlayer from 'react-player';

type MediaRef = React.RefObject<HTMLMediaElement | ReactPlayer | null>;

export const useMediaPlayback = (mediaRef: MediaRef) => {
    const { registerMedia, playMedia } = useMedia();

    const handlePlay = useCallback(() => {
        if (mediaRef.current) {
            playMedia(mediaRef.current);
        }
    }, [mediaRef, playMedia]);

    useEffect(() => {
        const element = mediaRef.current;
        if (!element) return;

        const unregister = registerMedia(element);

        if (element instanceof HTMLMediaElement) {
            element.addEventListener('play', handlePlay);

            return () => {
                element.removeEventListener('play', handlePlay);
                unregister();
            };
        } else {
            return () => {
                unregister();
            };
        }
    }, [mediaRef, registerMedia, handlePlay]);

    return {
        onPlay: handlePlay
    };
};
