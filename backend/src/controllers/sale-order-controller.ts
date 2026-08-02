import express, { Request, Response, NextFunction } from "express"
import { saleOrderService } from "../services/sale-order-service";
import { AddSaleOrderDto } from "../models/sale-order-model";


class SaleOrderController {

    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/sales", this.getAllSales);
        this.router.get("/api/sales/:id", this.getOneSale);

        this.router.post("/api/sales", this.addSale);
    }


    //Get All sales
    private async getAllSales(request: Request, response: Response, next: NextFunction): Promise<void> {

        const sales = await saleOrderService.getAllSales()

        response.json(sales);
    }


    //Get One Sale
    private async getOneSale(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({
                    message: "Id must be a positive number"
                });
                return;
            }
            const sale = await saleOrderService.getOneSale(id);
            response.json(sale)
        }
        catch (err: any) {
            next(err)
        }
    }

    //Add Sale
    private async addSale(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const sale:AddSaleOrderDto = request.body;

            const addSale = await saleOrderService.addSale(sale);
            response.status(200).json(sale);

        }catch(err:any){
            next(err);
        }
    }

 }

 export const saleOrderController = new SaleOrderController();