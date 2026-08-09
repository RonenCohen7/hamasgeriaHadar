import { configureStore } from "@reduxjs/toolkit";
import { inventoryReducer } from "./inventory-slice";
import authReducer from "./auth-slice";
import { customerReducer } from "./customer-slice";
import { customerAuthReducer } from "./customer-auth-slice";

export const store = configureStore({
    reducer: {
        inventory: inventoryReducer,
        auth:authReducer,
        customers: customerReducer,
        customerAuth: customerAuthReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;