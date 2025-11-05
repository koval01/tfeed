import { useCallback } from 'react';

export function useClipboard() {
    const fallbackCopyTextToClipboard = useCallback((text: string) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;

        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }, []);

    const copyToClipboard = useCallback((text: string) => {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }

        navigator.clipboard.writeText(text)
            .then(() => {
                console.log('Async: Copying to clipboard was successful!');
            })
            .catch(err => {
                console.error('Async: Could not copy text: ', err);
                fallbackCopyTextToClipboard(text);
            });
    }, [fallbackCopyTextToClipboard]);

    return { copyToClipboard };
}
