import axios, { AxiosInstance } from 'axios';
import { parse, HTMLElement } from 'node-html-parser';
import { TELEGRAM_CONSTANTS, PREVIEW_SELECTORS } from './constants';
import type { Preview, ParserOptions, ParserResponse } from './types';

export class TelegramChannelParser {
    private readonly channelName: string;
    private readonly client: AxiosInstance;
    private readonly options: Required<ParserOptions>;

    constructor(channelName: string, options: ParserOptions = {}) {
        if (!this.isValidChannel(channelName)) {
            throw new Error('Invalid channel name');
        }

        this.channelName = channelName;
        this.options = {
            timeout: options.timeout || TELEGRAM_CONSTANTS.DEFAULT_TIMEOUT,
            retries: options.retries || TELEGRAM_CONSTANTS.MAX_RETRIES,
        };

        this.client = axios.create({
            baseURL: TELEGRAM_CONSTANTS.BASE_URL,
            timeout: this.options.timeout,
        });
    }

    public async getPreview(): Promise<ParserResponse<Preview>> {
        try {
            const response = await this.makeRequest();
            const preview = this.parsePreview(response.data);

            return {
                success: true,
                data: preview,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new Error('Unknown error occurred'),
            };
        }
    }

    private async makeRequest(retryCount = 0): Promise<any> {
        try {
            return await this.client.get(`/${this.channelName}`);
        } catch (error) {
            if (retryCount < this.options.retries) {
                return this.makeRequest(retryCount + 1);
            }
            throw error;
        }
    }

    private parsePreview(html: string): Preview {
        const root = parse(html);
        if (!root) {
            throw new Error('Failed to parse HTML');
        }

        return {
            channel: {
                title: this.extractText(root, PREVIEW_SELECTORS.TITLE),
                subscribers: this.extractText(root, PREVIEW_SELECTORS.SUBSCRIBERS),
                is_verified: this.checkVerified(root),
                description: this.extractText(root, PREVIEW_SELECTORS.DESCRIPTION),
                avatar: this.extractAttribute(root, PREVIEW_SELECTORS.AVATAR, 'src'),
            },
        };
    }

    private extractText(root: HTMLElement, selector: string): string {
        return root.querySelector(selector)?.text?.trim() || '';
    }

    private extractAttribute(root: HTMLElement, selector: string, attr: string): string | undefined {
        return root.querySelector(selector)?.getAttribute(attr);
    }

    private checkVerified(root: HTMLElement): boolean {
        return !!root.querySelector(PREVIEW_SELECTORS.VERIFIED_BADGE);
    }

    private isValidChannel(channel: string): boolean {
        return TELEGRAM_CONSTANTS.CHANNEL_NAME_REGEX.test(channel);
    }
}
