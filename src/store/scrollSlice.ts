import { createSlice } from '@reduxjs/toolkit';

interface ScrollState {
    isBlocked: boolean;
}

const initialState: ScrollState = {
    isBlocked: false,
};

const scrollSlice = createSlice({
    name: 'scroll',
    initialState,
    reducers: {
        blockScroll: (state) => {
            state.isBlocked = true;
        },
        unblockScroll: (state) => {
            state.isBlocked = false;
        },
    },
});

export const { blockScroll, unblockScroll } = scrollSlice.actions;

export default scrollSlice.reducer;
