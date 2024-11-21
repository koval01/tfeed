type MediaInput = {
    url: string;
    thumb?: string;
    type: string;
};

type MediaOutput = {
    url: string;
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
export const convertMediaArray = (mediaArray: MediaInput[]): MediaOutput[] => {
    return mediaArray
        .filter(media => media.type === 'photo' || media.type === 'video')
        .map(media => ({
            url: media.type === 'photo' ? media.url : media.thumb || '',
        }))
        .filter(media => media.url);
};
