import type { CustomerAuthResponseModel } from "../models/customer-model";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



interface CustomerAuthState {
    token:string | null;
    customer: CustomerAuthResponseModel["customer"] | null;
}

const initialState: CustomerAuthState = {
    token: null,
    customer: null
}

const customerAuthSlice = createSlice({
    name: "customerAuth",
    initialState,
    reducers: {
        customerLogin(
            state,
            action: PayloadAction<CustomerAuthResponseModel>
        ){
                state.token = action.payload.token;
                state.customer = action.payload.customer;
            },
        
            customerLogout(state){
                state.token = null;
                state.customer = null;
            }
        }
    });

export const {
    customerLogin,
    customerLogout,
} = customerAuthSlice.actions;
          
export const customerAuthReducer = customerAuthSlice.reducer;