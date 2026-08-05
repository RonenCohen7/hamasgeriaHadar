
import express, { Request, Response, NextFunction } from "express";
import { vipCardService } from "../services/vip-card-service";


class VipCardController {

    public readonly router = express.Router();

    public constructor() {

        this.router.get("/api/vip-cards", this.getAllVipCards);
        this.router.get("/api/vip-cards/:id", this.getVipCardByCustomer);
        this.router.post("/api/vip-cards", this.createVipCard);

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
    private async getAllVipCards(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const cards = await vipCardService.getAllCards();

            response.json(cards);

        }catch(err:any){
            next(err);
        }
    }

    //Get One Card
    private async getVipCardByCustomer(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{
            const idCustomer = Number(request.params.id);
            if(!Number.isInteger(idCustomer) || idCustomer <= 0){
                response.status(400).json({
                    message: "Customer id must be a positive number"
                })
                return;
            }
            const card = await vipCardService.getVipCardByCustomer(idCustomer);
            response.json(card);

        }catch(err:any){
            next(err);
        }
    }
}

export const vipCardController = new VipCardController();