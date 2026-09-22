import express, { Request, Response, NextFunction } from "express"
import { saleOrderService } from "../services/sale-order-service";
import { AddSaleOrderDto } from "../models/sale-order-model";
import { verifyToken } from "../middleware/verify-token";
import { allowRoles } from "../middleware/role-middleware";
import { PaymentMethod, SaleStatus } from "../models/enum";



class SaleOrderController {

    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/sales", this.getAllSales);
        this.router.get("/api/sales/:id", this.getOneSale);

        this.router.post("/api/sales", this.addSale);

        this.router.post("/api/sales/events-tickets", this.purchaseEventTickets);

        this.router.patch("/api/sales/:id/report-payment", this.reportPayment);

        this.router.patch("/api/sales/:id/payment", this.completePayment);

        this.router.patch("/api/admin/sales/:id/confirm-payment", verifyToken, allowRoles("admin", 'manager'), this.confirmBitPayment);

        this.router.patch("/api/admin/sales/:id/status", verifyToken, allowRoles("admin", "manager"), this.updateSaleStatus);
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
    private async addSale(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {


            const sale: AddSaleOrderDto = request.body;
            console.log("SALE:");
            console.log(sale);
            console.log("paymentMethod =", sale.paymentMethod);
            console.log("sale =", sale);
            const addSale = await saleOrderService.addSale(sale);
            response.status(201).json(addSale);

        } catch (err: any) {
            console.error(err);
            next(err);
        }
    }

    // purchaseEventTickets
    private async purchaseEventTickets(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const order = request.body;

            const sale = await saleOrderService.PurchaseEventTickets(order);

            response.status(201).json(sale)
        }
        catch (err) {
            next(err)
        }
    }


    // Report Bit payment
    private async reportPayment(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const idSale = Number(request.params.id);

            const sale = await saleOrderService.reportPayment(idSale);

            response.json(sale);
        }
        catch (err: any) {
            next(err);
        }
    }

    //Complete Payment Sal
    private async completePayment(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const idSale = Number(request.params.id);

            const { paymentMethod, idVipCard } = request.body;

            if (paymentMethod === PaymentMethod.Bit) {
                response.status(403).json({
                    message: "Bit payment requires manager confirmation"
                });
                return;
            }

            const sale = await saleOrderService.completePayment(idSale, paymentMethod, idVipCard);

            response.json(sale);


        } catch (err: any) {
            next(err)
        }
    }


    // Admin/Manager confirms reported Bit payment
    private async confirmBitPayment(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const idSale = Number(request.params.id);

            const sale = await saleOrderService.completePayment(
                idSale,
                PaymentMethod.Bit,
                null
            );

            response.json(sale);
        }
        catch (err: any) {
            next(err);
        }
    }

    //Admin update Status Payment
    private async updateSaleStatus(request:Request, response:Response, next:NextFunction):Promise<void>{
        try {

            const idSale = Number(request.params.id);

            const {status} = request.body;

            if(!Number.isInteger(idSale) || idSale <= 0){
                response.status(400).json({
                    message:"Invalid sale ID"
                })
                return;
            }

            if(!Object.values(SaleStatus).includes(status as SaleStatus)){
                response.status(400).json({
                    message:"Invalid sale status"
                })
                return;
            }

            const sale = await saleOrderService.updateSaleStatus(
                idSale,
                status as SaleStatus
            )
            response.json(sale)

        }catch(err: any){
            next(err)
        }
    }


}

export const saleOrderController = new SaleOrderController();