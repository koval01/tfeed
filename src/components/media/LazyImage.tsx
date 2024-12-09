import React, { useState, useRef, useEffect } from "react";

import { NextImage } from "@/components/media/NextImage";
import { cn } from "@/lib/utils";

const withLazyLoad = (ImageComponent: React.ComponentType<any>) => {
    return (props: any) => {
        const { src, alt, className, ...rest } = props;
        const [isVisible, setIsVisible] = useState(false);
        const imgRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        setIsVisible(true);
                        observer.disconnect();
                    });
                },
                { threshold: 0 }
            );

            if (imgRef.current) {
                observer.observe(imgRef.current);
            }

            return () => observer.disconnect();
        }, [imgRef]);

        return (
            <div ref={imgRef} className={cn("transition-opacity duration-700 ease-in-out", isVisible ? "opacity-100" : "opacity-0")}>
                {isVisible && <ImageComponent src={src} alt={alt} className={className} {...rest} />}
            </div>
        );
    };
};

export const LazyImage = withLazyLoad(NextImage);
