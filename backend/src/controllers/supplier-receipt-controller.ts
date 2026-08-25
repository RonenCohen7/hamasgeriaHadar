import express, { Request, Response, NextFunction } from "express"
import { supplierReceiptService } from "../services/supplier-receipt-service";


class SupplierReceiptController {

    public readonly router = express.Router();



    public constructor() {

        this.router.post("/api/supplier-receipts", this.createReceipt);
        this.router.patch("/api/supplier-receipts/:id/confirm", this.confirmReceipt);

    }


    // Create receipt draft
    private async createReceipt(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            console.log("BODY:", request.body);
            console.log("idOrder:", request.body.idOrder);
            console.log("type:", typeof request.body.idOrder);
            const dto = request.body;

            if (!Number.isInteger(dto.idOrder) || dto.idOrder <= 0) {
                response.status(400).json({
                    message: "supplier order id must be a positive number"
                });
                return;

            }
            if (!Array.isArray(dto.items) || dto.items.length == 0) {
                response.status(400).json({
                    message: "Receipt must contain at least one item"
                });
                return;
            }
            const receipt = await supplierReceiptService.createReceipt(dto);

            response.status(201).json(receipt);

        } catch (err: any) {
            next(err);
        }
    }



    // confirm receipt
    private async confirmReceipt(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

                const idReceipt =  Number(request.params.id);
                
                if(!Number.isInteger(idReceipt) || idReceipt <= 0){
                    response.status(400).json({
                        message: "Receipt id must a positive number"
                    });
                    return;
                }
                const receipt = await supplierReceiptService.confirmReceipt(idReceipt);

                response.json(receipt);
        }catch(err:any){
            next(err);
        }
    }

}


export const supplierReceiptController = new SupplierReceiptController();