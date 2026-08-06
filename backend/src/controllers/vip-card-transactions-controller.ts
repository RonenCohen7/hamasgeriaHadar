import express, { Request, Response, NextFunction, json } from "express";
import { vipCardTransactionService } from "../services/vip-card-transaction-service";


class VipCardTransactionsController {

    public readonly router = express.Router();

    public constructor() {

        this.router.get("/api/vip-cards/:id/transactions", this.getAllTransactions);
        this.router.get("/api/vip-cards/transactions/:id", this.getTransactionById);

    }


    // Get All Transactions By VIP card
    private async getAllTransactions(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idVipCard = Number(request.params.id);
            if (!Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "Id must be a positive number"
                })
                return;
            }
            const transactions = await vipCardTransactionService.getTransactionsByCard(idVipCard);
            response.status(200).json(transactions);

        } catch (err: any) {
            next(err);
        }
    }

    //Get One Transaction
    private async getTransactionById(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const idVipTransaction = Number(request.params.id)

            if (!Number.isInteger(idVipTransaction) || idVipTransaction <= 0) {
                response.status(400).json({
                    message: "Transaction id must be a positive number."
                });
                return;
            }
            const transaction = await vipCardTransactionService.getTransactionById(idVipTransaction);
            response.status(200).json(transaction);
        } catch (err: any) {
            next(err);
        }
    }



}

export const vipCardTransactionsController = new VipCardTransactionsController();