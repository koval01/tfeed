import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostsState {
    noLoadMore: boolean;
}

const initialState: PostsState = {
    noLoadMore: false,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setNoLoadMore: (state, action: PayloadAction<boolean>) => {
            state.noLoadMore = action.payload;
        },
    },
});

export const { setNoLoadMore } = postsSlice.actions;
export default postsSlice.reducer;
