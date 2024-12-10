import React, { createContext, useContext, useRef } from 'react';

interface MediaContextType {
    registerMedia: (element: HTMLMediaElement) => () => void;
    playMedia: (element: HTMLMediaElement) => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const mediaElements = useRef<Set<HTMLMediaElement>>(new Set());

    const registerMedia = (element: HTMLMediaElement) => {
        mediaElements.current.add(element);
        return () => {
            mediaElements.current.delete(element);
        };
    };

    const playMedia = (elementToPlay: HTMLMediaElement) => {
        mediaElements.current.forEach((element) => {
            if (element !== elementToPlay && !element.paused) {
                element.pause();
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
