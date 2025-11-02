import { configureStore } from '@reduxjs/toolkit';

import scrollReducer from '@/store/scrollSlice';
import viewerSlice from "@/store/viewerSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            scroll: scrollReducer,
            viewer: viewerSlice
        },
    });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
