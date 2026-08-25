import axios from "axios";
import { appConfig } from "../utils/app-config";


export interface CreateSupplierReceiptItem {
    idOrderItem: number;
    idProduct: number;

    quantityReceived: number;
    quantityDamaged: number;

    notes: string | null;
}


export interface CreateSupplierReceipt {
    idOrder: number;
    notes: string | null;

    items: CreateSupplierReceiptItem[];
}


class SupplierReceiptService {
    /*
        * Create a new supplier receipt
        * The Receipt is created before it is confirmed
     */

    public async createReceipt(receipt: CreateSupplierReceipt): Promise<any>{

        const response = await axios.post(`${appConfig.baseUrl}supplier-receipts`, receipt, 
            {
                withCredentials : true
            }
        )

        return response.data;

    }



    //Confirm an existing supplier receipt - Backend update quantity 
    public async confirmReceipt(idReceipt: number):Promise<any>{

        const response = await axios.patch(`${appConfig.baseUrl}supplier-receipts/${idReceipt}/confirm`,{},
            {
                withCredentials: true
            }
            
        )
        return response.data;
    }
}

export const supplierReceiptService = new SupplierReceiptService();