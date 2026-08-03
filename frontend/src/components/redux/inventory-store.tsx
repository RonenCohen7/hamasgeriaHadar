import { configureStore } from "@reduxjs/toolkit";
import { inventoryReducer } from "./inventory-slice";
import authReducer from "./auth-slice";

export const store = configureStore({
    reducer: {
        inventory: inventoryReducer,
        auth:authReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;