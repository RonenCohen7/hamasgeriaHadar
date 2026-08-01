import express, { Request, Response, NextFunction } from "express";
import { supplierOrderService } from "../services/supplier-order-service";
import { AddSupplierOrderDto, SupplierOrderModel } from "../models/supplier-order-model";
import { supplierOrderItemService } from "../services/supplier-order-item-service";
import { log } from "console";


class SupplierOrderController {


    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/supplier-orders", this.getAllSupplierOrders);
        this.router.get("/api/supplier-orders/:id", this.getOneOrder);
        this.router.get("/api/supplier-orders/:id/items", this.getOneOrderItems);

        this.router.post("/api/supplier-orders", this.addNewOrder);
        
        this.router.put("/api/supplier-orders/:id", this.updateSupplierOrder);
        this.router.put("/api/supplier-orders/items/:id",this.updateOrderItem)

        this.router.delete("/api/supplier-orders/:id", this.deleteSupplierOrder);
        this.router.delete("/api/supplier-orders/items/:id", this.deleteOrderItem);

    }


    //Get All SupplierOrder
    private async getAllSupplierOrders(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const orders = await supplierOrderService.getAllSupplierOrders();
            response.json(orders);

        } catch (err: any) {
            next(err);
        }
    }

    //Get One order
    private async getOneOrder(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "Id must be a positive number. " });
                return;
            }

            const order = await supplierOrderService.getOneSupplierOrder(id);
            response.json(order);


        } catch (err: any) {
            next(err);
        }
    }


        //Get Order item
        private async getOneOrderItems(request:Request, response:Response, next:NextFunction):Promise<void>{
            try{
    
                const id = Number(request.params.id);
                const items = await supplierOrderItemService.getItemsByOrder(id);
                response.json(items);
    
            }catch(err:any){
                next(err);
                
            }
        }


    // Add new Order
    private async addNewOrder(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const order: AddSupplierOrderDto = request.body;

            const addOrder = await supplierOrderService.addSupplierOrder(order);
            response.status(201).json(addOrder);

        } catch (err: any) {
            next(err);
        }
    }


    //update order
    private async updateSupplierOrder(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "Id must be a positive number. " });
                return;
            }

            const order: SupplierOrderModel = request.body;
            order.idOrder = id;

            const updateOrder = await supplierOrderService.updateSupplierOrder(order);
            response.json(updateOrder);


        } catch (err: any) {
            next(err);
        }
    }

    //update Order item
    private async updateOrderItem(request:Request, response:Response,next:NextFunction):Promise<void>{
        try{

            const id = Number(request.params.id);
            if(!Number.isInteger(id) || id <=0){
                response.status(400).json({message: "Id must be a positive number. "});
                return;
            }
            const item = request.body;
            item.idOrder = id;

            const updateItem = await supplierOrderItemService.updateSupplierOrderItem(item);
            response.json(updateItem);

        }catch(err:any){
            next(err)
            
        }
    }



    //delete order 
    private async deleteSupplierOrder(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "Id must be a positive number. " });
                return
            }
            await supplierOrderService.deleteSupplierOrder(id);
            response.sendStatus(204);

        } catch (err: any) {
            next(err);
        }
    }

    //delete item from order
    private async deleteOrderItem(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const id = Number(request.params.id);
            if(!Number.isInteger(id) || id <= 0){
                response.status(400).json({message: "Id must Be a positive number"});
            }
            await supplierOrderItemService.deleteSupplierOrderItem(id);
            response.sendStatus(204);

        }catch(err:any){
            next(err);
        }
    }


}

export const supplierOrderController = new SupplierOrderController();