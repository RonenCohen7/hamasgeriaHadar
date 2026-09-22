import axios from "axios";

import { appConfig } from "../utils/app-config";
import type { PurchaseEventTicketsModel } from "../models/event-model";
import { SaleOrderModel, type AddSaleOrderModel } from "../models/sale-order-model";



class SaleOrderService {

    //Get all Sales
    public async getAllSales():Promise<SaleOrderModel[]>{
        const response = await axios.get<SaleOrderModel[]>(appConfig.salesUrl);
        return response.data;
    }

    //Get One sale
    public async getOneSale(id:number):Promise<SaleOrderModel>{
        const response = await axios.get<SaleOrderModel>(`${appConfig.salesUrl}/${id}`);
        return response.data;
    }

    //Add sale
    public async addSale(sale:AddSaleOrderModel):Promise<SaleOrderModel>{
        const response = await axios.post<SaleOrderModel>(appConfig.salesUrl, sale);
        return response.data;
    }

    

    //sale ticket
    public async purchaseEventTickets(order: PurchaseEventTicketsModel):Promise<SaleOrderModel>{

        const response = await axios.post<SaleOrderModel>(
            `${appConfig.salesUrl}/events-tickets`,order
        )
        return response.data;
    }

    public async completePayment(idSale:number, paymentMethod: string, idVipCard: number | null):Promise<SaleOrderModel>{

        const response = await axios.patch<SaleOrderModel>(
            `${appConfig.salesUrl}/${idSale}/payment`,{
                paymentMethod,
                idVipCard
            }
        );
        return response.data

    }


    //Customer report Bit Transfer 
    public async reportPayment(idSale:number):Promise<SaleOrderModel>{

        const response = await axios.patch<SaleOrderModel>(
            `${appConfig.salesUrl}/${idSale}/report-payment`
        );
        return response.data
    }

    //Admin/Manager confirm report Bit payment
    public async confirmBitPayment(idSale:number):Promise<SaleOrderModel>{

        const response = await axios.patch<SaleOrderModel>(
            `${appConfig.adminSalesUrl}/${idSale}/confirm-payment`
        )
        return response.data;
    }

    //Admin/Manager update sale status
    public async updateSaleStatus(idSale:number, status:string):Promise<SaleOrderModel>{
        const response = await axios.patch<SaleOrderModel>(
            `${appConfig.adminSalesUrl}/${idSale}/status`,
            { status }
        )
        return response.data;
    }
    
}

export const saleOrderService = new SaleOrderService();