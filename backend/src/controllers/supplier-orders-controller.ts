import express, { Request, Response, NextFunction } from "express";
import { supplierOrderService } from "../services/supplier-order-service";
import { AddSupplierOrderDto, SupplierOrderModel } from "../models/supplier-order-model";


class SupplierOrderController {


    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/supplier-orders", this.getAllSupplierOrders);
        this.router.get("/api/supplier-orders/:id", this.getOneOrder);

        this.router.post("/api/supplier-orders", this.addNewOrder);
        this.router.put("/api/supplier-orders/:id", this.updateSupplierOrder);

        this.router.delete("/api/supplier-orders/:id", this.deleteSupplierOrder);

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


}

export const supplierOrderController = new SupplierOrderController();