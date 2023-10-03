import { configureStore } from "@reduxjs/toolkit";
import documentReducer from "./documentReducer";

export const store = configureStore({
  reducer: {
    document: documentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
