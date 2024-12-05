import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Media } from '@/types/media';

interface ViewerState {
    selectedMedia: Media | null;
    isAnimating: boolean;
    isClosing: boolean;
    isOverlayVisible: boolean;
    transitionStyle: Record<string, string>;
}

const initialState: ViewerState = {
    selectedMedia: null,
    isAnimating: false,
    isClosing: false,
    isOverlayVisible: false,
    transitionStyle: {},
};

const viewerSlice = createSlice({
    name: 'viewer',
    initialState,
    reducers: {
        openViewer(state, action: PayloadAction<{ media: Media; style: Record<string, string> }>) {
            state.selectedMedia = action.payload.media;
            state.transitionStyle = action.payload.style;
            state.isAnimating = true;
            state.isOverlayVisible = false;
            state.isClosing = false;
        },
        closeViewer(state) {
            state.isOverlayVisible = false;
            state.isClosing = true;
        },
        setVisible(state, action: PayloadAction<boolean>) {
            state.isOverlayVisible = action.payload;
        },
        resetViewer() {
            return initialState;
        },
        updateViewer(state, action: PayloadAction<Record<string, string>>) {
            state.transitionStyle = action.payload;
        },
    },
});

export const { openViewer, closeViewer, setVisible, resetViewer, updateViewer } = viewerSlice.actions;
export default viewerSlice.reducer;
