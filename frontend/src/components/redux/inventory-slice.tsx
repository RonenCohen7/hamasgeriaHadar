import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { InventoryModel } from "../models/inventory-model";

type InventoryState = {
    items: InventoryModel[];
    updatedProductIds: number[];
    lastUpdate: string | null;
    isLoading: boolean;
};

const initialState: InventoryState = {
    items: [],
    updatedProductIds: [],
    lastUpdate: null,
    isLoading: false
};

type InventoryUpdatedPayload = {
    idProduct: number;
    stockAfter: number;
};

const inventorySlice = createSlice({
    name: "inventory",

    initialState,

    reducers: {
        setInventory(
            state,
            action: PayloadAction<InventoryModel[]>
        ) {
            state.items = action.payload;
            state.lastUpdate = new Date().toISOString();
        },

        setInventoryLoading(
            state,
            action: PayloadAction<boolean>
        ) {
            state.isLoading = action.payload;
        },

        updateInventoryProduct(
            state,
            action: PayloadAction<InventoryUpdatedPayload>
        ) {
            const product = state.items.find(
                item =>
                    item.idProduct === action.payload.idProduct
            );

            if (!product) return;

            product.productStock = action.payload.stockAfter;

            const alreadyExists =
                state.updatedProductIds.includes(
                    action.payload.idProduct
                );

            if (!alreadyExists) {
                state.updatedProductIds.push(
                    action.payload.idProduct
                );
            }

            state.lastUpdate = new Date().toISOString();
        },

        clearUpdatedProduct(
            state,
            action: PayloadAction<number>
        ) {
            state.updatedProductIds =
                state.updatedProductIds.filter(
                    id => id !== action.payload
                );
        },

        clearAllUpdatedProducts(state) {
            state.updatedProductIds = [];
        }
    }
});

export const {
    setInventory,
    setInventoryLoading,
    updateInventoryProduct,
    clearUpdatedProduct,
    clearAllUpdatedProducts
} = inventorySlice.actions;

export const inventoryReducer = inventorySlice.reducer;