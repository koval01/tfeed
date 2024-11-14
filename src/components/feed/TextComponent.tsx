import { Footnote, Link } from '@vkontakte/vkui';
import parse from 'html-react-parser';
import type { DOMNode, Element, HTMLReactParserOptions, Text } from 'html-react-parser';

import styles from '@/styles/emoji.module.css';
import { nextImage } from '@/helpers/nextImage';

/**
 * Handles parsing and rendering of <a> elements.
 * @param element - The DOM element representing the <a> tag.
 * @returns JSX for rendering the <Link> component.
 */
const handleLinkElement = (element: Element) => {
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
const handleEmojiElement = (element: Element) => {
    const emojiBackground = element.attribs.style?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];
    const text = element.children[0] && (element.children[0] as Text).data;

    if (!emojiBackground) return text; // Fallback to text if no background found

    const emojiUrl = nextImage(`https:${emojiBackground}`, 40);

    return (
        <span className={styles.emoji} style={{ backgroundImage: `url(${emojiUrl})` }}>
            {text}
        </span>
    );
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
