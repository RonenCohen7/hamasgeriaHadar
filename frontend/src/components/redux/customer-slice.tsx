
import { createSlice } from "@reduxjs/toolkit";
import type { CustomerModel } from "../models/customer-model"
import type { PayloadAction } from "@reduxjs/toolkit";

type CustomerStat = {
    items: CustomerModel[];
    isLoading: boolean;
}

const initialState: CustomerStat = {
    items: [],
    isLoading: false
};


const customerSlice = createSlice({
    name: "customers",

    initialState,

    reducers: {
        setCustomers(
            state,
            action: PayloadAction<CustomerModel[]>
        ) {
            state.items = action.payload;
        },

        setCustomersLoading(
            state,
            action: PayloadAction<boolean>
        ) {
            state.isLoading = action.payload
        },

        addCustomerToStore(
            state,
            action: PayloadAction<CustomerModel>
        ) {
            state.items.push(action.payload);
        },
        updateCustomersInStore(
            state,
            action: PayloadAction<CustomerModel>
        ) {
            const index = state.items.findIndex(
                customer =>
                    customer.idCustomer === action.payload.idCustomer
            );
            if (index !== 1) {
                state.items[index] = action.payload;
            }
        },
        removeCustomerFromStore(
            state,
            action: PayloadAction<number>
        ) {
            state.items = state.items.filter(
                customer =>
                    customer.idCustomer !== action.payload
            );
        }
    }
});
export const {
    setCustomers,
    setCustomersLoading,
    addCustomerToStore,
    updateCustomersInStore,
    removeCustomerFromStore

} = customerSlice.actions;

export const customerReducer = customerSlice.reducer;