import { ConflictError, ResourceNotFoundError } from "../models/client-errors";
import { CreateVipCardDto, VipCardModel } from "../models/vip-card-model";
import { dal } from "../utils/dal";



class VipCardService {


    //Get All Card
    public async getAllCards():Promise<VipCardModel[]>{
            const sql = `
                SELECT
                    vc.id_vip_card AS idVipCard,
                    vc.card_number AS cardNumber,
                    vc.id_customer AS idCustomer,
                    vc.tier,
                    vc.external_card AS externalCard,
                    vc.balance,
                    vc.issued_at AS issuedAt,
                    vc.expires_at AS expiresAt,
                    vc.card_status AS cardStatus,
                    vc.created_at AS createdAt,
                    vc.updated_at AS updatedAt,

                    c.first_name AS firstName,
                    c.last_name AS lastName,
                    c.phone,
                    c.email,
                    c.date_of_birth AS dateOfBirth,
                    c.is_active AS isActive

                FROM vip_cards vc

                INNER JOIN customers c
                    ON c.id_customer = vc.id_customer

                ORDER BY
                    vc.tier,
                    c.first_name,
                    c.last_name
    `;

    return await dal.execute(sql) as VipCardModel[];
    }







    //Create New Card Vip;
    public async createVipCard(dto: CreateVipCardDto): Promise<VipCardModel> {
        const customerSql = `
            SELECT id_customer
            FROM customers
            WHERE id_customer = ?
                AND is_active = TRUE
            LIMIT 1

        `;
        const customers = await dal.execute(customerSql, [dto.idCustomer]) as { id_customer: number }[];
        if (customers.length === 0) {
            throw new ResourceNotFoundError(dto.idCustomer);
        }


        const existsSql = `
            SELECT id_vip_card
            FROM vip_cards
            WHERE id_customer = ?
            LIMIT 1
        `;
        const exists = await dal.execute(existsSql, [dto.idCustomer]) as VipCardModel[];
        if (exists.length > 0) {
            throw new ConflictError("Customer already has a VIP card")
        }

        const cardNumber = dto.cardNumber?.trim() || this.generateCardNumber();

        const sql = `
        INSERT INTO vip_cards (
            card_number,
            id_customer,
            tier,
            external_card,
            balance,
            card_status
                )
        VALUES (?, ?, 'bronze', ?, 0.00, 'active')
        `;

        await dal.execute(sql, [
            cardNumber,
            dto.idCustomer,
            dto.cardNumber ? 1 : 0
        ]);

        const created = await dal.execute(
            `
                SELECT
                    id_vip_card   AS idVipCard,
                    card_number   AS cardNumber,
                    id_customer   AS idCustomer,
                    tier,
                    external_card AS externalCard,
                    balance,
                    issued_at     AS issuedAt,
                    expires_at    AS expiresAt,
                    card_status   AS cardStatus,
                    created_at    AS createdAt,
                    updated_at    AS updatedAt
                FROM vip_cards
                WHERE id_customer = ?
                LIMIT 1;
            `, [dto.idCustomer]) as VipCardModel[];

        return created[0]
    }


    //Generate  random card number
    private generateCardNumber(): string {
        const now = Date.now().toString().slice(-8);
        const random = Math.floor(1000 + Math.random() * 9000);
        return `VIP-${now.slice(-8)}-${random}`
    }


    //Get card details by id customer
    public async getVipCardByCustomer(idCustomer:number):Promise<VipCardModel>{
        const sql = `
            SELECT
                vc.id_vip_card AS idVipCard,
                vc.card_number AS cardNumber,
                vc.id_customer AS idCustomer,
                vc.tier,
                vc.external_card AS externalCard,
                vc.balance,
                vc.issued_at AS issuedAt,
                vc.expires_at AS expiresAt,
                vc.card_status AS cardStatus,
                vc.created_at AS createdAt,
                vc.updated_at AS updatedAt,

                c.first_name AS firstName,
                c.last_name AS lastName,
                c.phone,
                c.email,
                c.date_of_birth AS dateOfBirth

            FROM vip_cards vc

            INNER JOIN customers c
                ON c.id_customer = vc.id_customer

            WHERE vc.id_customer = ?

            LIMIT 1
        `;
        const cards = await dal.execute(sql,[idCustomer]) as VipCardModel[];

        const card = cards[0];

        if(!card){
            throw new ResourceNotFoundError(idCustomer);
        }
        return card;
    }

}

export const vipCardService = new VipCardService();