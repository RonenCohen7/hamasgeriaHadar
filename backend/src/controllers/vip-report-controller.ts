import express, {Request, Response, NextFunction} from "express";
import { vipReportService } from "../services/vip-report-service";



class VipReportController {

    public readonly router = express.Router();

    public constructor() {


        this.router.get("/api/reports/vip-purchases", this.getVipPurchases);

    }


    //Get report vip purchases
    private async getVipPurchases(request:Request, response: Response, next:NextFunction):Promise<void>{
        try{


            const purchases = await vipReportService.getVipPurchases();

            response.json(purchases);

        }catch(err:any){
            next(err)
        }
    }
}


export const vipReportController =  new VipReportController();