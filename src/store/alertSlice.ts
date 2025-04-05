import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
    newPostsCount: number;
}

const initialState: AlertState = {
    newPostsCount: 0,
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setNewPostsCount: (state, action: PayloadAction<number>) => {
            state.newPostsCount = action.payload;
        },
        addNewPostsCount: (state, action: PayloadAction<number>) => {
            state.newPostsCount += action.payload;
        },
        resetNewPostsCount: (state) => {
            state.newPostsCount = 0;
        },
    },
});

export const { setNewPostsCount, resetNewPostsCount, addNewPostsCount } = alertSlice.actions;
export default alertSlice.reducer;
