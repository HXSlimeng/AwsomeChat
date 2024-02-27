import { configureStore } from "@reduxjs/toolkit";
import llmSlice from "./features/llmSlice";

const store = configureStore({
    reducer: {
        llmSlice
    }
})

export default store

export type RootType = ReturnType<typeof store.getState>