
import express, { Request, Response, NextFunction } from "express";
import { vipCardService } from "../services/vip-card-service";
import { NOMEM } from "dns";
import { VipCardModel } from "../models/vip-card-model";


class VipCardController {

    public readonly router = express.Router();

    public constructor() {

        this.router.get("/api/vip-cards", this.getAllVipCards);

        this.router.get("/api/vip-cards/:id", this.getVipCardByCustomer); //edit customer

        this.router.get("/api/vip-cards/card/:id", this.getVipCardById); //edit card

        this.router.post("/api/vip-cards", this.createVipCard);

        this.router.put("/api/vip-cards/:id", this.updateVipCard);

        this.router.delete("/api/vip-cards/:id", this.softDeleteVipCard);

        this.router.post("/api/vip-cards/:id/recharge", this.rechargeBalance);

        this.router.post("/api/vip-cards/:id/charge", this.chargeBalance);

        this.router.get("/api/vip-cards/number/:cardNumber", this.getCardByCardNumber);

        this.router.post("/api/vip-cards/:id/verify-phone", this.verifyCardPhone);

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

    // Verify 4 digits phone number Customer
    private async verifyCardPhone(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            console.log("=== VERIFY CONTROLLER ===");
            const idVipCard = Number(request.params.id)
            const last4Digits = String(request.body.last4Digits ?? "").trim();


            console.log("verify phone params:", request.params);
            console.log("verify phone body:", request.body);

            if (!Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "VIP Card id must be a positive number"

                })
                return;
            }

            console.log("last4Digits =", last4Digits);
            console.log("typeof =", typeof last4Digits);
            console.log("length =", last4Digits.length);
            console.log("regex =", /^\d{4}$/.test(last4Digits));


            if (!/^\d{4}$/.test(last4Digits)) {
                response.status(400).json({
                    message: "Last 4 Phone digits must contain exactly 4 digits"
                });
                return;
            }

            console.log("Before service");

            const verified = await vipCardService.verifyCardPhone(
                idVipCard,
                last4Digits
            )

            console.log("=== AFTER REGEX ===");
            response.json({
                verified
            })

        } catch (err: any) {
            next(err)
        }
    }

    //Get card by card number
    private async getCardByCardNumber(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const cardNumber = String(request.params.cardNumber).trim();
            if (!cardNumber) {
                response.status(400).json({
                    message: "Card number is required"
                })
                return;
            }
            const card = await vipCardService.getCardByCardNumber(cardNumber);
            response.json(card)

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

    //ChargeBalance
    private async chargeBalance(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const idVipCard = Number(request.params.id);
            const amount = Number(request.body.amount);
            const notes = request.body.notes;


            if (!Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "VIP Card id must be a positive number"
                })
                return;
            }

            if (!Number.isFinite(amount) || amount <= 0) {
                response.status(400).json({
                    message: "Charge amount must be greater then zero"
                })
                return;
            }

            const card = await vipCardService.chargeBalance(
                idVipCard,
                amount,
                notes
            )
            response.status(200).json(card);

        } catch (err: any) {
            next(err)
        }
    }


    //edit card date
    private async getVipCardById(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const idVipCard = Number(request.params.id);

            if (Number.isInteger(idVipCard) || idVipCard <= 0) {
                response.status(400).json({
                    message: "VIP Card id must be a positive number"
                })
                return;
            }
            const card = await vipCardService.getCardById(idVipCard);
            response.json(card);

        } catch (err: any) {
            next(err)
        }
    }

}

export const vipCardController = new VipCardController();