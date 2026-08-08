import axios from "axios";
import { VipCardModel } from "../models/vip-card-model";
import { appConfig } from "../utils/app-config";
import { VipCardTransactionModel } from "../models/vip-card-transactions";

class VipCardService {


    //Get all VIP card
    public async getAllCards(): Promise<VipCardModel[]> {

        const response = await axios.get<VipCardModel[]>(appConfig.vipCardsUrl);

        return response.data;
    }

    //Get Vip Card By Customer id;
    public async getCardByCustomerId(idCustomer: number): Promise<VipCardModel> {

        const response = await axios.get<VipCardModel>(`${appConfig.vipCardsUrl}/${idCustomer}`);

        return response.data;
    }


    // get verify 4 digits card Customer
    public async verifyCardPhone(idVipCard: number,last4Digits:string):Promise<boolean>{
        const response = await axios.post<{verified: boolean}>(`${appConfig.vipCardsUrl}/${idVipCard}/verify-phone`,{
            last4Digits
        })
        return response.data.verified;
    }

    //Get card by card number
    public async getCardByCardNumber(cardNumber:string):Promise<VipCardModel>{
        const response = await axios.get<VipCardModel>(`${appConfig.vipCardsUrl}/number/${cardNumber}`);
        return response.data;
    }

    //Create Vip Card
    public async createCard(idCustomer: number, cardNumber?: string | null): Promise<VipCardModel> {

        const response = await axios.post<VipCardModel>(

            appConfig.vipCardsUrl,
            {
                idCustomer,
                cardNumber
            }
        );
        return response.data;
    }


    //Recharge Vip Card
    public async rechargeCard(idVipCard: number, amount: number, notes?: string): Promise<VipCardModel> {

        const response = await axios.post<VipCardModel>(`${appConfig.vipCardsUrl}/${idVipCard}/recharge`,
            {
                amount,
                notes
            });
        return response.data
    }


    //Charge Vip Card
    public async chargeCard(idVipCard: number, amount: number, notes?: string): Promise<VipCardModel> {

        const response = await axios.post<VipCardModel>(`${appConfig.vipCardsUrl}/${idVipCard}/charge`,
            {
                amount,
                notes
            }
        )
        return response.data;
    }



    //Get VIP card By Card ID
    public async getCardById(id:number):Promise<VipCardModel>{
        const response = await axios.get<VipCardModel>(`${appConfig.vipCardsUrl}/${id}`)
        return response.data;
    }



    //Update VIP Card
    public async updateVipCard(idVipCard:number,card:Partial<VipCardModel>):Promise<VipCardModel> {
        const response = await axios.put<VipCardModel>(`${appConfig.vipCardsUrl}/${idVipCard}`, card);
        return response.data;
        
    }


    //Get All Transactions By Vip Card
    public async getAllTransactionByCard(
        idVipCard: number,
        from?: string,
        to?: string,
        type?: string,
        page: number = 1,
        limit: number = 20,
        sortBy: string = "createdAt",
        sortOrder: string = "desc"
    ): Promise<VipCardTransactionModel[]> {

        const response = await axios.get<VipCardTransactionModel[]>(

            `${appConfig.vipCardsUrl}/${idVipCard}/transactions`,
            {
                params: {
                    from,
                    to,
                    type,
                    page,
                    limit,
                    sortBy,
                    sortOrder

                }
            }
        )
        return response.data;

    }


    //Get Transaction By Id 
    public async getTransactionById(idVipCard: number): Promise<VipCardTransactionModel> {

        const response = await axios.get<VipCardTransactionModel>(`${appConfig.vipCardsUrl}/transactions/${idVipCard}`);

        return response.data;
    }


}

export const vipCardService = new VipCardService();