import { useEffect } from 'react';
import { useMedia } from '@/contexts/MediaContext';

export const useMediaPlayback = (mediaRef: React.RefObject<HTMLMediaElement | null>) => {
    const { registerMedia, playMedia } = useMedia();

    useEffect(() => {
        const element = mediaRef.current;
        if (!element) return;

        const unregister = registerMedia(element);

        const handlePlay = () => {
            playMedia(element);
        };

        element.addEventListener('play', handlePlay);

        return () => {
            element.removeEventListener('play', handlePlay);
            unregister();
        };
    }, [mediaRef, registerMedia, playMedia]);
};
