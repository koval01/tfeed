import { configureStore } from '@reduxjs/toolkit';

import scrollReducer from '@/store/scrollSlice';
import postsReducer from '@/store/postsSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            scroll: scrollReducer,
            posts: postsReducer,
        },
    });
}

export const selectNoLoadMore = (state: RootState): boolean => state.posts.noLoadMore;

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
