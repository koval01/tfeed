import type { Media } from "@/types/media";
import type { Duration } from "@/types/body";

type MediaInput = {
    url: string;
    thumb?: string;
    type: "image" | "video";
    duration?: Duration;
};

/**
 * Converts an array of media objects into an array of URLs:
 * - If type is "photo", use the `url`.
 * - If type is "video", use the `thumb`.
 * - Skip other media types.
 *
 * @param mediaArray - The input array of media objects.
 * @returns An array of objects with a single `url` property.
 */
export const convertMediaArray = (mediaArray: MediaInput[]): Media[] => {
    return mediaArray
        .filter(media => media.type === 'image' || media.type === 'video')
        .map(media => ({
            type: media.type as "image" | "video",
            url: media.type === 'image' ? media.url : media.thumb || '',
            video_url: media.type === 'video' ? media.url : void 0,
            duration: media.type === 'video' ? media.duration : void 0,
        }))
        .filter(media => media.url);
};
