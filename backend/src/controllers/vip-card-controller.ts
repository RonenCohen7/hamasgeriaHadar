
import express, { Request, Response, NextFunction } from "express";
import { vipCardService } from "../services/vip-card-service";


class VipCardController {

    public readonly router = express.Router();

    public constructor() {

        this.router.get("/api/vip-cards", this.getAllVipCards);
        this.router.get("/api/vip-cards/:id", this.getVipCardByCustomer);
        this.router.post("/api/vip-cards", this.createVipCard);
        this.router.put("/api/vip-cards/:id", this.updateVipCard);
        this.router.delete("/api/vip-cards/:id", this.softDeleteVipCard);
        this.router.post("/api/vip-cards/:id/recharge", this.rechargeBalance);

    }



    //Create new Card
    private async createVipCard(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const dto = request.body;

            const vipCard = await vipCardService.createVipCard(dto);

            response.status(201).json(vipCard);

        } catch (err: any) {
            next(err);

        }
    }



    //Get All vip card
    private async getAllVipCards(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const cards = await vipCardService.getAllCards();

            response.json(cards);

        } catch (err: any) {
            next(err);
        }
    }

    //Get One Card
    private async getVipCardByCustomer(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const idCustomer = Number(request.params.id);
            if (!Number.isInteger(idCustomer) || idCustomer <= 0) {
                response.status(400).json({
                    message: "Customer id must be a positive number"
                })
                return;
            }
            const card = await vipCardService.getVipCardByCustomer(idCustomer);
            response.json(card);

        } catch (err: any) {
            next(err);
        }
    }


    //Update vip card
    private async updateVipCard(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idVipCard = Number(request.params.id)

            if (!Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "VIP card id must be a positive number"
                });
                return;
            }

            const dto = request.body;

            const updateCard = await vipCardService.updateVipCard(idVipCard, dto);

            response.json(updateCard);


        } catch (err: any) {
            next(err)
        }
    }


    //Soft Delete vip card
    private async softDeleteVipCard(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const idVipCard = Number(request.params.id);
            if (!Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "VIP card id must be a positive number"
                })
                return;
            }
            await vipCardService.softDeleteVipCard(idVipCard)
            response.sendStatus(204);
        } catch (err) {
            next(err)
        }
    }


    // Recharge Balance VIP Card
    private async rechargeBalance(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idVipCard = Number(request.params.id);
            const amount = Number(request.body.amount)

            if (!Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "VIP card id must be a positive number. "
                })
                return;
            }
            if (!Number.isFinite(amount) || amount <= 0) {
                response.status(400).json({
                    message: "Recharge amount must be greater then zero"
                })
                return;
            }



            const updateCard = await vipCardService.rechargeBalance(
                idVipCard,
                amount);
            response.status(200).json(updateCard);

        } catch (err: any) {
            next(err)
        }
    }
}

export const vipCardController = new VipCardController();