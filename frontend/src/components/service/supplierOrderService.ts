import axios from "axios";


import { appConfig } from "../utils/app-config";
import type { AddSupplierOrderModel, SupplierOrderModel } from "../models/supplierOrderModel";

class SupplierOrderService {


    //Get All Supplier Orders
    public async getAllSupplierOrders(): Promise<SupplierOrderModel[]>{

        const response = await axios.get<SupplierOrderModel[]>(appConfig.supplierOrderUrl)

        return response.data;

    }

    //Get One Supplier order
    public async getOneSupplierOrder(id: number): Promise<SupplierOrderModel>{
        const response = await axios.get<SupplierOrderModel>(`${appConfig.supplierOrderUrl}/${id}`);

        return response.data;
    }


    //Add supplier order
    public async addSupplierOrder(order:AddSupplierOrderModel): Promise<SupplierOrderModel>{
        const response = await axios.post<SupplierOrderModel>(appConfig.supplierOrderUrl, order);

        return response.data;
    }

    //Update order
    public async updateSupplierOrder(order:SupplierOrderModel):Promise<SupplierOrderModel>{
        const response = await axios.patch<SupplierOrderModel>(`${appConfig.supplierOrderUrl}/${order.idOrder}`,order);
        return response.data;
    }


    //delete order
    public async deleteOrder(id:number):Promise<void>{
        await axios.delete(`${appConfig.supplierOrderUrl}/${id}`)
    }

}

export const supplierOrderService = new SupplierOrderService();