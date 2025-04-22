import { Duration } from "@/types/body";

export type Media = {
    type: "image" | "video";
    url: string;
    video_url?: string;
    duration?: Duration;
};
