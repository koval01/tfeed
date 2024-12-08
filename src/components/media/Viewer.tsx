import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { calculateEndDimensions } from '@/helpers/calcEndDimensions';

import { RootState } from '@/lib/store';
import { closeViewer, resetViewer, updateViewer } from '@/store/viewerSlice';

import { NextImage as Image } from '@/components/media/NextImage';
import { cn } from '@/lib/utils';
import { unblockScroll } from '@/store/scrollSlice';

import _ from 'lodash';

import '@/styles/components/mediaGrid.css';

const MediaViewer: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const dispatch = useDispatch();
    const { selectedMedia, isAnimating, isClosing, isOverlayVisible, transitionStyle } = useSelector(
        (state: RootState) => state.viewer
    );

    const closeOverlay = useCallback(() => {
        dispatch(closeViewer());
        dispatch(unblockScroll());

        setTimeout(() => {
            dispatch(resetViewer());
        }, 250);
    }, [dispatch]);

    useEffect(() => {
        const savedVolume = localStorage.getItem('TF_mediaVolume');
        if (selectedMedia?.type === 'video' && videoRef.current) {
            videoRef.current.volume = parseFloat(savedVolume || "") || .7;
        }
    }, [selectedMedia]);

    useEffect(() => {
        const videoElement = videoRef.current;

        if (videoElement) {
            const handleVolumeChange = () => {
                localStorage.setItem('TF_mediaVolume', _.round(videoElement.volume, 2).toString());
            };

            videoElement.addEventListener('volumechange', handleVolumeChange);

            return () => {
                videoElement.removeEventListener('volumechange', handleVolumeChange);
            };
        }
    }, [selectedMedia]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeOverlay();
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOverlay]);

    useEffect(() => {
        if (!selectedMedia) return;

        const updateDimensions = () => {
            const tempImage = new window.Image();
            tempImage.src = selectedMedia.url;

            tempImage.onload = () => {
                const { naturalWidth, naturalHeight } = tempImage;
                const imageAspectRatio = naturalWidth / naturalHeight;

                const { endWidth, endHeight } = calculateEndDimensions(imageAspectRatio);

                const newTransitionStyle = {
                    ...transitionStyle,
                    '--end-width': `${endWidth}px`,
                    '--end-height': `${endHeight}px`,
                };

                dispatch(
                    updateViewer(newTransitionStyle)
                );
            };
        };

        const handleResize = _.debounce(updateDimensions, 100);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [selectedMedia, transitionStyle, dispatch]);

    if (!selectedMedia) return null;

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center MediaGrid__overlayContainer',
                isAnimating && !isClosing ? 'animating' : ''
            )}
            style={transitionStyle}
            onClick={closeOverlay}
        >
            <div
                className={cn(
                    'MediaGrid__backgroundBlur',
                    isOverlayVisible ? '_visible' : '_invisible'
                )}
            ></div>

            <Image
                src={selectedMedia.url}
                alt={selectedMedia.type || ''}
                className="absolute MediaGrid__imageTransition"
            />
            {selectedMedia.type === 'video' && (
                <video
                    ref={videoRef}
                    preload="auto"
                    controls
                    autoPlay
                    width="auto"
                    height="auto"
                    playsInline
                    crossOrigin="anonymous"
                    poster={selectedMedia.url}
                    className="absolute MediaGrid__imageTransition"
                >
                    <source src={selectedMedia.video_url} type="video/mp4" />
                </video>
            )}
        </div>
    );
};

export default MediaViewer;
