export const TELEGRAM_CONSTANTS = {
    BASE_URL: 'https://t.me',
    CHANNEL_NAME_REGEX: /^[a-zA-Z0-9_-]{3,32}$/,
    DEFAULT_TIMEOUT: 5000,
    MAX_RETRIES: 3,
} as const;

export const PREVIEW_SELECTORS = {
    TITLE: 'div.tgme_page_title>span',
    SUBSCRIBERS: 'div.tgme_page_extra',
    DESCRIPTION: 'div.tgme_page_description',
    AVATAR: 'a>img.tgme_page_photo_image',
    VERIFIED_BADGE: 'div.tgme_page_verified_badge',
} as const;
