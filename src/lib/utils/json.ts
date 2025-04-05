type InputJson = Record<string, any>;

/**
 * Safely cleans JSON data by removing unnecessary fields and simplifying the structure
 * @param json The input JSON data
 * @param media_meta Whether to return media URLs
 * @returns Cleaned JSON data
 */
export const cleanJsonOfPost = (json: InputJson, media_meta = false): Record<string, any> => {
    if (!json || typeof json !== 'object') {
        return {};
    }

    const keysToRemove = new Set(['meta', 'url', 'thumb', 'unix', 'cover', 'to_message', 'raw', 'waves', 'entities', 'avatar', 'view']);
    const validMediaTypes = new Set(['image', 'video', 'roundvideo', 'gif', 'sticker']);

    const processNode = (node: unknown): unknown => {
        if (node === null || typeof node !== 'object') {
            return node;
        }
        if (Array.isArray(node)) {
            return node.map(item => processNode(item));
        }

        const result: Record<string, any> = {};

        try {
            for (const [key, value] of Object.entries(node)) {

                if (keysToRemove.has(key)) {
                    continue;
                }

                if (
                    value &&
                    typeof value === 'object' &&
                    !Array.isArray(value) &&
                    'string' in value &&
                    typeof value.string !== 'undefined'
                ) {
                    if ('html' in value && Object.keys(value).length === 2) {
                        result[key] = value.string;
                    } else {
                        const cleanedValue = { ...value };
                        if ('html' in cleanedValue) {
                            delete cleanedValue.html;
                        }
                        result[key] = processNode(cleanedValue);
                    }
                    continue;
                }

                if (media_meta && key === 'media' && Array.isArray(value)) {
                    result[key] = value.map(mediaItem => {

                        if (!mediaItem || typeof mediaItem !== 'object' || !('type' in mediaItem)) {
                            return null;
                        }

                        const mediaType = mediaItem.type;

                        if (typeof mediaType !== 'string' || !validMediaTypes.has(mediaType)) {
                            return null;
                        }

                        if (mediaType === 'image' && 'url' in mediaItem && typeof mediaItem.url === 'string') {
                            return { url: mediaItem.url, type: mediaType };
                        }

                        if (['video', 'roundvideo', 'gif', 'sticker'].includes(mediaType) &&
                            'thumb' in mediaItem && typeof mediaItem.thumb === 'string') {
                            return { url: mediaItem.thumb, type: mediaType };
                        }

                        return null;
                    }).filter(Boolean);

                    continue;
                }

                if (value && typeof value === 'object') {
                    result[key] = processNode(value);
                } else {
                    result[key] = value;
                }
            }
        } catch (error) {
            console.error('Error processing JSON node:', error);
            return {};
        }

        return result;
    };

    try {
        return processNode(json) as Record<string, any>;
    } catch (error) {
        console.error('Error cleaning JSON:', error);
        return {};
    }
}
