import express, { Request, Response, NextFunction } from "express";
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

            const from = request.query.from?.toString();
            const to = request.query.to?.toString();
            const type = request.query?.type?.toString();
            const page = request.query.page ? Number(request.query.page) : undefined;
            const pageSize = request.query.pageSize ? Number(request.query.pageSize): undefined;
            const sortBy = request.query.sortBy as string | undefined;
            const sortOrder = request.query.sortOrder as string | undefined;

            const transactions = await vipCardTransactionService.getTransactionsByCard(
                idVipCard,
                from,
                to,
                type,
                page,
                pageSize,
                sortBy,
                sortOrder
            );
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