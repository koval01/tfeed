export interface Body {
    channel: Channel;
    content: Content;
    meta: Meta;
}

export interface Channel {
    username: string;
    title: string;
    description: string;
    avatar: string | undefined;
    counters: Counters;
    labels: string[];
}

interface Content {
    posts: Post[];
}

interface Meta {
    offset: Offset | null;
}

export interface Offset {
    before?: number;
    after?: number;
}

export interface Post {
    id: number;
    content: ContentPost;
    footer: Footer;
    forwarded: Forwarded;
}

export interface Forwarded {
    name: string;
    url: string;
}

export interface Footer {
    views?: string;
    author?: string;
    date: FooterDate;
}

interface FooterDate {
    string: string;
    unix: number;
}

interface ContentPost {
    text: Text;
    media: Media[];
    poll: Poll;
    inline: Inline;
}

interface Inline {
    title: string;
    url: string;
}

interface PollOptions {
    name: string;
    percent: number;
}

interface Poll {
    name: string;
    type: string;
    votes: string;
    options: PollOptions[];
}

export interface Media {
    url: string;
    thumb: string;
    waves: string;
    duration: Duration;
    type: string;
}

interface Duration {
    formatted: string;
    raw: number;
}

interface Entities {
    offset: number;
    length: number;
    type: string;
    language: string;
}

interface Text {
    string: string;
    html: string;
    entities: Entities[];
}

export interface Counters {
    subscribers: string;
    photos: string;
    videos: string;
    files: string;
    links: string;
}
