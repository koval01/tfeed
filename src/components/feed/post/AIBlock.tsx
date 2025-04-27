"use client";

import React, { memo, useContext, useEffect, useRef, useState } from "react";
import { Trans } from "react-i18next";
import { t } from "i18next";

import { Caption, Footnote, Paragraph, Skeleton } from "@vkontakte/vkui";
import Markdown from 'react-markdown';

import { DEFAULT_AI_STATE, PostAiContext } from "@/contexts/PostAiContext";
import { cn } from "@/lib/utils/clsx";

interface AIBlockProps {
    postId: number;
}

/**
 * AIBlock component displays AI-generated content for a post with loading and error states.
 */
export const AIBlock = memo(({ postId }: AIBlockProps) => {
    const { states, setAiState } = useContext(PostAiContext);
    const aiState = states[postId] || DEFAULT_AI_STATE;
    const contentRef = useRef<HTMLDivElement>(null);

    const [contentHeight, setContentHeight] = useState<string>('0');
    const [skipAnimation, setSkipAnimation] = useState(!!aiState.cachedHeight);

    useEffect(() => {
        if (!contentRef.current) return;

        if (aiState.cachedHeight) {
            setContentHeight(aiState.cachedHeight);
            setSkipAnimation(true);
            return;
        }

        const newHeight = aiState.triggered
            ? (aiState.result || aiState.error || aiState.loading
                ? `${contentRef.current.scrollHeight}px`
                : '150px')
            : '0';

        setContentHeight(newHeight);

        if (aiState.triggered && (aiState.result || aiState.error) && !aiState.cachedHeight) {
            const timer = setTimeout(() => {
                setAiState(postId, {
                    ...aiState,
                    cachedHeight: newHeight
                });
                setSkipAnimation(true);
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [aiState, postId, setAiState]);

    return (
        <AIContainer triggered={aiState.triggered}>
            <AIResultWrapper error={aiState.error}>
                <div
                    ref={contentRef}
                    className="overflow-hidden"
                    style={{
                        maxHeight: contentHeight,
                        transition: skipAnimation
                            ? 'none'
                            : 'max-height 500ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {aiState.loading ? (
                        <AILoadingContent />
                    ) : aiState.result ? (
                        <AISuccessContent result={aiState.result} />
                    ) : aiState.error ? (
                        <AIErrorContent />
                    ) : null}
                </div>
            </AIResultWrapper>
        </AIContainer>
    );
});
AIBlock.displayName = "AIBlock";

// Sub-components for better organization

interface AIContainerProps {
    triggered: boolean;
    children: React.ReactNode;
}

/**
 * Wrapper for AI block that handles visibility
 */
const AIContainer = ({ triggered, children }: AIContainerProps) => (
    <div className={cn(
        "relative p-1 md:p-2 mb-1 md:mb-2",
        { 'block': triggered, 'hidden': !triggered }
    )}>
        {children}
    </div>
);

interface AIResultWrapperProps {
    error: boolean;
    children: React.ReactNode;
}

/**
 * Styled wrapper for AI content with error state handling
 */
const AIResultWrapper = ({ error, children }: AIResultWrapperProps) => (
    <div className={cn(
        "ai__background_color w-full relative block",
        "px-1.5 sm:px-2 md:px-2.5 py-2 md:py-3",
        "rounded-md md:rounded-xl",
        "overflow-hidden",
        {
            'bg-red-50 border border-red-200': error,
            'bg-blue-50': !error
        }
    )}>
        {children}
    </div>
);

interface AISuccessContentProps {
    result: string;
}

/**
 * Displays the successful AI-generated content
 */
const AISuccessContent = ({ result }: AISuccessContentProps) => (
    <div className="space-y-2 md:space-y-3">
        <Paragraph>
            <Markdown>{result}</Markdown>
        </Paragraph>
        <Caption className="opacity-60 select-none" level="2">
            <Trans i18nKey="answerGeneratedBy" components={{
                highlight: <span className="ai__text_color" />
            }} />
        </Caption>
    </div>
);

/**
 * Displays loading skeleton while AI content is being generated
 */
const AILoadingContent = () => (
    <div className="space-y-2">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
    </div>
);

/**
 * Displays error message when AI generation fails
 */
const AIErrorContent = () => (
    <Footnote caps className="select-none">
        {t("errorRequestAi")}
    </Footnote>
);
