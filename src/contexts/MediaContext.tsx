import React, { createContext, useContext, useRef } from 'react';
import ReactPlayer from 'react-player';

type MediaElement = HTMLMediaElement | ReactPlayer;

interface MediaContextType {
    registerMedia: (element: MediaElement) => () => void;
    playMedia: (element: MediaElement) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

const isReactPlayer = (element: MediaElement): element is ReactPlayer => {
    return 'getInternalPlayer' in element;
};

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mediaElements = useRef<Set<MediaElement>>(new Set());

    const registerMedia = (element: MediaElement) => {
        mediaElements.current.add(element);
        return () => {
            mediaElements.current.delete(element);
        };
    };

    const playMedia = (elementToPlay: MediaElement) => {
        mediaElements.current.forEach((element) => {
            if (element !== elementToPlay) {
                if (element instanceof HTMLMediaElement && !element.paused) {
                    element.pause();
                } else if (isReactPlayer(element)) {
                    // React-player specific handling
                    element.getInternalPlayer()?.pause();
                }
            }
        });
    };

    return (
        <MediaContext.Provider value={{ registerMedia, playMedia }}>
            {children}
        </MediaContext.Provider>
    );
};

export const useMedia = () => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error('useMedia must be used within a MediaProvider');
    }
    return context;
};