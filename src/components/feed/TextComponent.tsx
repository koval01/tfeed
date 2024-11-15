import { Footnote, Link } from '@vkontakte/vkui';
import parse from 'html-react-parser';
import type { DOMNode, Element, HTMLReactParserOptions, Text } from 'html-react-parser';

import styles from '@/styles/emoji.module.css';
import { nextImage } from '@/helpers/nextImage';

/**
 * Safely extracts text content from element and its children
 */
const extractTextContent = (element: Element): string => {
    try {
        const firstChild = element?.children?.[0];

        if (isTextNode(firstChild)) {
            return firstChild.data;
        }

        if (firstChild && 'children' in firstChild) {
            const nestedChild = firstChild.children?.[0];
            return isTextNode(nestedChild) ? nestedChild.data : '';
        }

        return '';
    } catch {
        return '';
    }
};

/**
 * Type guard to check if node is a text node
 */
const isTextNode = (node: any): node is Text => {
    return node && 'data' in node;
};

/**
 * Handles parsing and rendering of <a> elements.
 * @param element - The DOM element representing the <a> tag.
 * @returns JSX for rendering the <Link> component.
 */
const handleLinkElement = (element: Element): JSX.Element => {
    const text = element.children[0] && (element.children[0] as Text).data;

    return (
        <Link href={element.attribs.href} target={element.attribs.target || '_self'} rel={element.attribs.rel || 'noopener'}>
            {text}
        </Link>
    );
};

/**
 * Handles parsing and rendering of <i> elements with a class of 'emoji'.
 * @param element - The DOM element representing the <i> tag.
 * @returns JSX for rendering the emoji with a background image.
 */
const handleEmojiElement = (element: Element): JSX.Element | string => {
    try {
        // Early return if invalid element
        if (!element?.attribs?.style) {
            return extractTextContent(element);
        }

        const backgroundMatch = element.attribs.style.match(/url\(['"]?(.*?)['"]?\)/);
        const emojiBackground = backgroundMatch?.[1];

        if (!emojiBackground) {
            return extractTextContent(element);
        }

        const emojiUrl = nextImage(
            emojiBackground.startsWith('//') ? `https:${emojiBackground}` : emojiBackground,
            40
        );

        return (
            <span className={styles.emoji} style={{ backgroundImage: `url(${emojiUrl})` }}>
                <b>{extractTextContent(element)}</b>
            </span>
        );
    } catch (error) {
        console.warn('Error parsing emoji element:', error);
        return extractTextContent(element);
    }
};

/**
 * HTML parser options to handle specific HTML elements like <a> and <i>.
 * You can extend this by adding more element handlers as needed.
 */
const getParserOptions = (): HTMLReactParserOptions => ({
    replace: (domNode: DOMNode) => {
        const element = domNode as Element;

        if (element.name === 'a' && element.attribs?.href) {
            return handleLinkElement(element);
        }

        if (element.name === 'i' && element.attribs?.class === 'emoji') {
            return handleEmojiElement(element);
        }

        return null; // Return null if no custom handling is needed for the element
    },
});

/**
 * TextComponent is a reusable component that parses an HTML string
 * and renders it with custom handlers for <a> (links) and <i> (emoji) elements.
 * @param htmlString - The HTML string to be parsed and rendered.
 */
export const TextComponent = ({ htmlString }: { htmlString?: string }) => {
    if (!htmlString) return null; // Return nothing if no HTML string is provided

    const parserOptions = getParserOptions();

    return (
        <div>
            <Footnote weight="2" className="whitespace-pre-line">
                {parse(htmlString, parserOptions)}
            </Footnote>
        </div>
    );
};
