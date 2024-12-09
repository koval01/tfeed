import React, { useState, useRef, useEffect } from "react";

import { NextImage } from "@/components/media/NextImage";
import { cn } from "@/lib/utils";

const withLazyLoad = (ImageComponent: React.ComponentType<any>) => {
    // eslint-disable-next-line react/display-name  
    return (props: any) => {
        const { src, alt, className, disableLoader, ...rest } = props;
        const [isIntersecting, setIsIntersecting] = useState(false);
        const [isLoaded, setIsLoaded] = useState(false);
        const imgRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(() => {
                        setIsIntersecting(true);
                        observer.disconnect();
                    });
                },
                {
                    threshold: .1,
                    rootMargin: '50px'
                }
            );

            if (imgRef.current) {
                observer.observe(imgRef.current);
            }

            return () => observer.disconnect();
        }, []);

        const handleImageLoad = () => {
            setIsLoaded(true);
        };

        return (
            <div ref={imgRef}>
                {isIntersecting && !isLoaded && !disableLoader && (
                    <div className="absolute top-0 animate-pulse bg-neutral-300 dark:bg-neutral-800 w-full h-full" />
                )}
                <div className={cn(
                    "transition-opacity duration-700 ease-in-out",
                    isIntersecting && isLoaded ? "opacity-100" : "opacity-0"
                )}>
                    {isIntersecting && (
                        <ImageComponent
                            src={src}
                            alt={alt}
                            className={className}
                            onLoad={handleImageLoad}
                            {...rest}
                        />
                    )}
                </div>
            </div>
        );
    };
};

export const LazyImage = withLazyLoad(NextImage);
