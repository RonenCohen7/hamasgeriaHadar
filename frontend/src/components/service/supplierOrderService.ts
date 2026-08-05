import axios from "axios";


import { appConfig } from "../utils/app-config";
import type { AddSupplierOrderModel, SupplierOrderModel } from "../models/supplierOrderModel";
import type { SupplierOrderItemModel } from "../models/supplierOrderItemModel";



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

    //Get Order Items
    public async getOrderItems(id:number):Promise<SupplierOrderItemModel[]>{
        const response = await axios.get<SupplierOrderItemModel[]>(`${appConfig.supplierOrderUrl}/${id}/items`);
        return response.data;
    }


    //Add supplier order
    public async addSupplierOrder(order:AddSupplierOrderModel): Promise<SupplierOrderModel>{
     
        const response = await axios.post<SupplierOrderModel>(appConfig.supplierOrderUrl, order);

        return response.data;
    }

    //Update order
    public async updateSupplierOrder(order:SupplierOrderModel):Promise<SupplierOrderModel>{
        const response = await axios.put<SupplierOrderModel>(`${appConfig.supplierOrderUrl}/${order.idOrder}`,order);
        return response.data;
    }


    //update order item
    public async updateOrderItem(item:SupplierOrderItemModel):Promise<SupplierOrderItemModel>{
        const response = await axios.put<SupplierOrderItemModel>(`${appConfig.supplierOrderUrl}/items/${item.idOrderItem}`,item);
        return response.data;
    }


    //delete order
    public async deleteOrder(id:number):Promise<void>{
        await axios.delete(`${appConfig.supplierOrderUrl}/${id}`)
    }


    //Delete item from order
    public async deleteItemFromOrder(id:number):Promise<void>{
        await axios.delete(`${appConfig.supplierOrderUrl}/items/${id}`);
    }
    

}

export const supplierOrderService = new SupplierOrderService();