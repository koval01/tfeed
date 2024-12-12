export interface Body {
    channel: Channel;
    content: Content;
    meta: Meta;
}

interface ParsedAndRaw {
    string: string;
    html: string;
}

export interface Channel {
    username: string;
    title: ParsedAndRaw;
    description: ParsedAndRaw;
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
    view: string;
}

export interface Forwarded {
    name: ParsedAndRaw;
    url: string;
}

export interface Footer {
    views?: string;
    author?: ParsedAndRaw;
    date: FooterDate;
}

interface FooterDate {
    string: string;
    unix: number;
}

interface Reply {
    cover?: string;
    name: ParsedAndRaw;
    text?: ParsedAndRaw;
    to_message: number;
}

export interface PreviewLink {
    description?: ParsedAndRaw;
    site_name: string;
    thumb?: string;
    title?: string;
    url: string;
}

interface ContentPost {
    text: Text;
    media: Media[];
    poll: Poll;
    inline: Inline;
    reply: Reply;
    preview_link: PreviewLink;
}

interface Inline {
    title: string;
    url: string;
}

export interface PollOptions {
    name: string;
    percent: number;
}

export interface Poll {
    question: string;
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
