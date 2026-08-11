import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomerAuthResponseModel } from "../models/customer-model";


interface CustomerAuthState {
    token: string | null;
    customer: CustomerAuthResponseModel["customer"] | null;
}


const storedCustomer =
    localStorage.getItem("customer");


const initialState: CustomerAuthState = {

    token:
        localStorage.getItem("customerToken"),

    customer:
        storedCustomer &&
        storedCustomer !== "undefined"
            ? JSON.parse(storedCustomer)
            : null
};


const customerAuthSlice = createSlice({

    name: "customerAuth",

    initialState,

    reducers: {

        customerLogin(
            state,
            action: PayloadAction<CustomerAuthResponseModel>
        ) {

            state.token =
                action.payload.token;

            state.customer =
                action.payload.customer;


            localStorage.setItem(
                "customerToken",
                action.payload.token
            );

            localStorage.setItem(
                "customer",
                JSON.stringify(
                    action.payload.customer
                )
            );
        },


        customerLogout(state) {

            state.token = null;
            state.customer = null;


            localStorage.removeItem(
                "customerToken"
            );

            localStorage.removeItem(
                "customer"
            );
        }
    }
});


export const {
    customerLogin,
    customerLogout
} = customerAuthSlice.actions;


export const customerAuthReducer =
    customerAuthSlice.reducer;