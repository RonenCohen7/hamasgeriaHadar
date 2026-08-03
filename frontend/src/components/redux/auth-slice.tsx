import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseModel, SafeUserModel } from "../models/user-model";


export interface AuthState {
    token: string | null;
    user: SafeUserModel | null;
}


const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    user: 
        storedUser && storedUser !== "undefined" 
        ? JSON.parse(storedUser) : null
}

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        login(state, action: PayloadAction<AuthResponseModel>) {
            state.token = action.payload.token;
            state.user = action.payload.user;

            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));

        },
        logout(state) {
            state.token = null;
            state.user = null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
    }

})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;