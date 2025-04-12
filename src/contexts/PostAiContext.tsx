import { createContext, useState } from "react";

type AiState = {
    triggered: boolean;
    error: boolean;
    result: string | null;
    cachedHeight?: string;
};

type PostAiContextType = {
    states: Record<string, AiState>;
    setAiState: (postId: number, state: Partial<AiState>) => void;
    resetAiState: (postId: number) => void;
};

export const DEFAULT_AI_STATE: AiState = {
    triggered: false,
    error: false,
    result: null,
    cachedHeight: void 0,
};

export const PostAiContext = createContext<PostAiContextType>({
    states: {},
    setAiState: () => { },
    resetAiState: () => { }
});

export const PostAiProvider = ({ children }: { children: React.ReactNode }) => {
    const [states, setStates] = useState<Record<string, AiState>>({});

    const setAiState = (postId: number | string, state: Partial<AiState>) => {
        setStates(prev => ({
            ...prev,
            [postId.toString()]: {
                ...DEFAULT_AI_STATE,
                ...(prev[postId.toString()] || {}),
                ...state
            }
        }));
    };

    const resetAiState = (postId: number) => {
        setStates(prev => ({
            ...prev,
            [postId]: DEFAULT_AI_STATE
        }));
    };

    return (
        <PostAiContext.Provider value={{ states, setAiState, resetAiState }}>
            {children}
        </PostAiContext.Provider>
    );
};
