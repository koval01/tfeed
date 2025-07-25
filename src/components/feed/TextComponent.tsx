import React, { type JSX, NamedExoticComponent, memo } from "react";

import { EllipsisText, Link } from '@vkontakte/vkui';
import { Spoiler } from 'spoiled';

import parse, { 
    DOMNode, 
    HTMLReactParserOptions, 
    Element, 
    Text 
} from 'html-react-parser';

import '@/styles/components/emoji.css';

/**
 * Extracts the text content from an HTML element and its children.
 * @param element - The DOM element to extract text from.
 * @returns The extracted text as a string or an empty string if no text is found.
 */
const extractTextContent = (element: Element | undefined): string => {
    if (!element?.children?.length) return '';

    return Array.from(element.children).reduce<string>((text, child) => {
        if (isTextNode(child)) {
            return text + child.data.trim();
        }

        if ('name' in child && child.name === 'br') {
            return text + '\n';
        }

        if ('children' in child && child.children?.length) {
            return text + extractTextContent(child as Element);
        }

        return text;
    }, '');
};

/**
 * Type guard to check if a node is a text node.
 * @param node - The DOM node to check.
 * @returns True if the node is a text node; otherwise, false.
 */
const isTextNode = (node: unknown): node is Text => {
    return !!node && typeof node === 'object' && node !== null && 'data' in node;
};

/**
 * Renders a <Link> component for <a> elements.
 * @param element - The DOM element representing the <a> tag.
 * @returns JSX element for the <Link> component.
 */
const renderLink = (element: Element): JSX.Element => {
    const text = extractTextContent(element);
    const { href, target = '_self', rel = 'noopener' } = element.attribs;

    return (
        <Link href={href} target={target} rel={rel}>
            <EllipsisText>{text}</EllipsisText>
        </Link>
    );
};

/**
 * Renders a <Spoiler> component for custom spoiler tags.
 * @param element - The DOM element representing the spoiler tag.
 * @returns JSX element for the <Spoiler> component.
 */
const renderSpoiler = (element: Element): JSX.Element => {
    const text = extractTextContent(element);
    return <Spoiler>{text}</Spoiler>;
};

/**
 * Renders a styled emoji with a background image for <i> elements with the "emoji" class.
 * @param element - The DOM element representing the <i> tag with an "emoji" class.
 * @returns JSX element for the emoji or plain text if no background is found.
 */
const renderEmoji = (element: Element): JSX.Element | string => {
    try {
        const { style } = element.attribs;
        if (!style) return extractTextContent(element);

        const backgroundMatch = style.match(/url\(['"]?(.*?)['"]?\)/);
        const emojiUrl = backgroundMatch?.[1];

        if (!emojiUrl) return extractTextContent(element);

        const resolvedUrl = emojiUrl.startsWith('//') ? `https:${emojiUrl}` : emojiUrl;
        const defaultEmoji = "https://telegram.org/img/emoji/40/F09F9982.png";

        return (
            <span className="emoji" style={{ backgroundImage: `url(${resolvedUrl ? resolvedUrl : defaultEmoji})` }}>
                <b>{extractTextContent(element)}</b>
            </span>
        );
    } catch (error) {
        console.warn('Error rendering emoji:', error);
        return extractTextContent(element);
    }
};

/**
 * Renders a <pre> tag with whitespace style.
 * @param element - The DOM element representing the pre tag.
 * @returns JSX element for the <Spoiler> component.
 */
const renderPre = (element: Element): JSX.Element => {
    const text = extractTextContent(element);
    return <pre className="whitespace-pre-wrap">{text}</pre>;
};

/**
 * Creates parser options for handling specific HTML elements.
 * Custom handlers are provided for <a>, <i> (emoji), and custom spoiler tags.
 * @returns The HTMLReactParserOptions object with replacement logic.
 */
const getParserOptions = (): HTMLReactParserOptions => ({
    replace: (domNode: DOMNode) => {
        const element = domNode as Element;
        if (!element || !element.name) return null;

        switch (element.name) {
            case 'a':
                if (element.attribs?.href) return renderLink(element);
                break;
            case 'i':
                if (element.attribs?.class === 'emoji') return renderEmoji(element);
                break;
            case 'pre':
                return renderPre(element);
            case 'tg-spoiler':
                return renderSpoiler(element);
        }
        return null; // Default case: return null for elements without custom handling.
    },
});

/**
 * TextComponent renders parsed HTML with custom handlers for links, emojis, and spoilers.
 * @param props - Props containing the HTML string to be parsed.
 * @param props.htmlString - The HTML string to parse and render.
 * @returns Parsed JSX elements or null if no HTML string is provided.
 */
export const TextComponent: NamedExoticComponent<{ htmlString?: string }> = memo(({ htmlString }) => {
    if (!htmlString) return null; // No HTML string, return null.

    const parserOptions = getParserOptions();
    return parse(htmlString, parserOptions);
});

TextComponent.displayName = "TextComponent";
