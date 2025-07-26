import type { Post } from "@/types";

import { useState, useEffect, useCallback, memo } from 'react';
import { LazyImage as Image } from "@/components/media/LazyImage";
import { cn } from "@/lib/utils/clsx";

interface EmojiData {
    type: string;
    emoji: string;
    thumb: string;
    path?: string;
    size?: number;
}

interface ReactItem {
    type: string;
    count: string;
    emoji_id?: string;
    emoji_image?: string;
}

class EmojiCache {
    private static instance: EmojiCache;
    private cache = new Map<string, EmojiData>();
    private pendingRequests = new Map<string, Promise<EmojiData>>();

    private constructor() { }

    public static getInstance(): EmojiCache {
        if (!EmojiCache.instance) {
            EmojiCache.instance = new EmojiCache();
        }
        return EmojiCache.instance;
    }

    async getEmoji(id: string): Promise<EmojiData | null> {
        // Return cached result immediately
        if (this.cache.has(id)) {
            return this.cache.get(id)!;
        }

        // If already pending, wait for the existing request
        if (this.pendingRequests.has(id)) {
            try {
                // Await the pending promise and return its result
                return await this.pendingRequests.get(id)!;
            } catch (error) {
                // If the pending request fails, we'll try again below
                this.pendingRequests.delete(id);
            }
        }

        const requestPromise = fetch(`/api/emoji/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then((data: EmojiData) => {
                // Cache the actual data, not the promise
                this.cache.set(id, data);
                return data;
            })
            .catch(error => {
                console.error(`Failed to fetch emoji ${id}:`, error);
                throw error;
            })
            .finally(() => {
                // Always clean up pending request
                this.pendingRequests.delete(id);
            });

        // Store the promise while it's pending
        this.pendingRequests.set(id, requestPromise);

        try {
            return await requestPromise;
        } catch (error) {
            return null;
        }
    }

    preloadEmoji(ids: string[]) {
        ids.forEach(id => {
            if (!this.cache.has(id) && !this.pendingRequests.has(id)) {
                this.getEmoji(id).catch(() => { });
            }
        });
    }
}

const emojiCache = EmojiCache.getInstance();

const imageExtensions = ['png', 'jpeg', 'jpg'];
const videoExtensions = ['webm', 'gif'];

const useCachedEmoji = (emojiId?: string) => {
    const [emojiData, setEmojiData] = useState<EmojiData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!emojiId) {
            setEmojiData(null);
            setLoading(false);
            return;
        }

        // Check cache synchronously first
        const cached = emojiCache['cache'].get(emojiId);
        if (cached) {
            setEmojiData(cached);
            setLoading(false);
            return;
        }

        setLoading(true);
        emojiCache.getEmoji(emojiId)
            .then(data => {
                setEmojiData(data);
            })
            .catch(error => {
                console.error(`Failed to load emoji ${emojiId}:`, error);
                setEmojiData(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [emojiId]);

    return { emojiData, loading };
};

const ReactItem = memo(({ item }: { item: ReactItem }) => {
    const { emojiData, loading } = useCachedEmoji(item.emoji_id);

    const renderMedia = useCallback((url: string) => {
        const extension = url.split('.').pop()?.toLowerCase();

        if (extension && videoExtensions.includes(extension)) {
            return (
                <div className="relative block size-4">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="size-4 object-contain"
                        aria-label="emoji"
                    >
                        <source src={url} type={`video/${extension}`} />
                        {emojiData?.thumb && (
                            <Image
                                src={emojiData.thumb}
                                alt="Emoji fallback"
                                widthSize={"16px"}
                                heightSize={"16px"}
                                noBorder
                                keepAspectRatio
                                disableLoader
                                className="relative object-cover aspect-square rounded-none"
                            />
                        )}
                    </video>
                </div>
            );
        }

        return (
            <div className="relative block size-4">
                <Image
                    src={url}
                    alt="Emoji"
                    widthSize={"16px"}
                    heightSize={"16px"}
                    noBorder
                    keepAspectRatio
                    disableLoader
                    className="relative object-cover aspect-square rounded-none"
                />
            </div>
        );
    }, [emojiData?.thumb]);

    const renderLoadingSkeleton = useCallback(() => {
        if (emojiData?.path) {
            return (
                <svg
                    viewBox={`0 0 ${emojiData.size || 100} ${emojiData.size || 100}`}
                    className="size-4 text-gray-200 animate-pulse"
                >
                    <path d={emojiData.path} fill="currentColor" />
                </svg>
            );
        }
        return <div className="size-4 bg-gray-200 rounded animate-pulse" />;
    }, [emojiData?.path, emojiData?.size]);

    const renderEmoji = useCallback(() => {
        if (item.type === "telegram_stars") {
            return <i className="icon icon-telegram-stars" />;
        }

        if (item.emoji_image) {
            return renderMedia(item.emoji_image);
        }

        if (loading) {
            return renderLoadingSkeleton();
        }

        if (emojiData) {
            const extension = emojiData.emoji.split('.').pop()?.toLowerCase();

            if (extension && (imageExtensions.includes(extension) || videoExtensions.includes(extension))) {
                return renderMedia(emojiData.emoji);
            } else if (emojiData.thumb) {
                return (
                    <div className="relative block size-4">
                        <Image
                            src={emojiData.thumb}
                            alt="Emoji thumbnail"
                            widthSize={"16px"}
                            heightSize={"16px"}
                            noBorder
                            keepAspectRatio
                            disableLoader
                            className="relative object-cover aspect-square rounded-none"
                        />
                    </div>
                );
            }
        }

        return <i className="size-4" />;
    }, [item, loading, emojiData, renderMedia, renderLoadingSkeleton]);

    return (
        <div className={cn(
            "items-center text-sm h-[26px] py-[3px] pl-[5px] pr-2 gap-0.5 md:gap-[3px]",
            "leading-normal m-px rounded-full font-medium inline-flex box-border",
            item.type === "telegram_stars" ?
                "bg-color-premium/20 text-[#e98111]" :
                "bg-color-accent/10 dark:bg-color-accent/25 text-[--vkui--color_icon_accent]"
        )}>
            {renderEmoji()}
            {item.count}
        </div>
    );
});
ReactItem.displayName = 'ReactItem';

export const PostReacts = memo(({ post }: { post: Post }) => {
    useEffect(() => {
        const emojiIds = post.content.reacts
            ?.map(react => react.emoji_id)
            .filter((id): id is string => !!id) || [];

        if (emojiIds.length > 0) {
            emojiCache.preloadEmoji(emojiIds);
        }
    }, [post.content.reacts]);

    return (
        <div className="flex flex-wrap gap-[3px] mt-2 -mx-1 select-none">
            {post.content.reacts?.map((item, index) => (
                <ReactItem key={`${item.type}-${index}-${item.count}`} item={item} />
            ))}
        </div>
    );
});
PostReacts.displayName = 'PostReacts';
