import { Footnote, Link } from '@vkontakte/vkui';
import parse from 'html-react-parser';
import type { DOMNode, Element, HTMLReactParserOptions, Text } from 'html-react-parser';

import styles from '@/styles/emoji.module.css';

export function TextComponent({ htmlString }: { htmlString: string }) {
    const options: HTMLReactParserOptions = {
        replace: (domNode: DOMNode) => {
            if ((domNode as Element).name === 'a' && (domNode as Element).attribs?.href) {
                const element = domNode as Element;
                const text = element.children[0] && (element.children[0] as Text).data;

                return (
                    <Link href={element.attribs.href} target={element.attribs.target || '_self'} rel={element.attribs.rel || 'noopener'}>
                        {text}
                    </Link>
                );
            }
            if ((domNode as Element).name === 'i' && (domNode as Element).attribs?.class === 'emoji') {
                const element = domNode as Element;
                const emojiBackground = element.attribs.style?.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1];

                const text = element.children[0] && (element.children[0] as Text).data;

                return (
                    <span
                        className={styles.emoji}
                        style={{ backgroundImage: `url(https:${emojiBackground})` }}
                    >
                        {text}
                    </span>
                );
            }
        },
    };

    return (
        <div>
            <Footnote weight="2" className="whitespace-pre-line">
                {parse(htmlString, options)}
            </Footnote>
        </div>
    );
}
