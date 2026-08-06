import { OkPacketParams } from "mysql2";
import { ConflictError, ResourceNotFoundError } from "../models/client-errors";
import { CreateVipCardDto, UpdateVipCardDto, VipCardModel } from "../models/vip-card-model";
import { dal } from "../utils/dal";
import { vipCardTransactionService } from "./vip-card-transaction-service";
import { AddVipCardTransactionDto, VipCardTransactionModel, VipCardTransactionType } from "../models/vip-card-transaction-model";



class VipCardService {


    //Get All Card
    public async getAllCards(): Promise<VipCardModel[]> {
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
                
                WHERE vc.card_status <> 'cancelled'
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
    public async getVipCardByCustomer(idCustomer: number): Promise<VipCardModel> {
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
        const cards = await dal.execute(sql, [idCustomer]) as VipCardModel[];

        const card = cards[0];

        if (!card) {
            throw new ResourceNotFoundError(idCustomer);
        }
        return card;
    }


    //Get card By IdCard;
    public async getCardById(idVipCard: number): Promise<VipCardModel> {
        const sql = `
            SELECT 
                vc.id_vip_card AS idVipCard,
                vc.card_number AS cardNumber,
                vc.id_customer As idCustomer,
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
            WHERE vc.id_vip_card = ?

            LIMIT 1
        `;
        const cards = await dal.execute(sql, [idVipCard]) as VipCardModel[];
        const card = cards[0];
        if (!card) {
            throw new ResourceNotFoundError(idVipCard);
        }
        return card;
    }

    //Update VIP card
    public async updateVipCard(idVipCard: number, dto: UpdateVipCardDto): Promise<VipCardModel> {
        await this.getCardById(idVipCard);

        const fields: string[] = [];
        const values: (string | number | boolean | Date | null)[] = [];

        if (dto.tier !== undefined) {
            fields.push("tier = ?")
            values.push(dto.tier);
        }

        if (dto.expiresAt !== undefined) {
            fields.push("expires_at = ?")
            values.push(dto.expiresAt)
        }

        if (dto.cardStatus !== undefined) {
            fields.push("card_status = ?")
            values.push(dto.cardStatus)
        }

        if (fields.length === 0) {
            return await this.getCardById(idVipCard);
        }

        fields.push("updated_at = CURRENT_TIMESTAMP");

        const sql = `
          UPDATE vip_cards
          SET ${fields.join(", ")}
          WHERE id_vip_card = ?
        `;
        values.push(idVipCard);

        await dal.execute(sql, values)

        return await this.getCardById(idVipCard);
    }

    //soft delete
    public async softDeleteVipCard(idVipCard: number): Promise<VipCardModel> {
        await this.getCardById(idVipCard);

        const sql = `
        UPDATE vip_cards
        SET
            card_status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
        WHERE id_vip_card = ?
    `;
        await dal.execute(sql, [idVipCard]);

        return await this.getCardById(idVipCard)
    }


    //Recharge VIP card
    public async rechargeBalance(idVipCard: number, amount: number): Promise<VipCardModel> {

        const createdBy = 1;

        if (amount <= 0) {
            throw new Error("Recharge amount must be greater then zero. ")
        }
        //card before update
        const cardBefore = await this.getCardById(idVipCard);

        const balanceBefore = cardBefore.balance

        const sql = `
            UPDATE vip_cards
            SET
                balance = balance + ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id_vip_card = ?
        `
        await dal.execute(sql, [amount, idVipCard]);

        //card after update
        const updatedCard = await this.getCardById(idVipCard);

        await vipCardTransactionService.addTransaction(
            {
                idVipCard,
                transactionType: VipCardTransactionType.Load,
                amount,
                balanceBefore,
                balanceAfter: updatedCard.balance,
                notes: "VIP card recharge"
            },
            createdBy
        )

        return updatedCard;
    }


    // Charge Balance
    public async chargeBalance(idVipCard: number, amount: number): Promise<VipCardModel> {
        const createdBy = 1;
        if (amount <= 0) {
            throw new Error("Charge amount must be greater then zero.")
        }
        //Card before update
        const cardBefore = await this.getCardById(idVipCard);
        if (cardBefore.balance < amount) {
            throw new Error("Insufficient balance");
        }
        const balanceBefore = cardBefore.balance

        const sql = `
            UPDATE vip_cards
            SET
                balance = balance - ?
            WHERE id_vip_card = ?
        `;

        await dal.execute(sql, [amount, idVipCard]);

        //Card After update
        const updatedCard = await this.getCardById(idVipCard);
        await vipCardTransactionService.addTransaction({
            idVipCard,
            transactionType: VipCardTransactionType.Payment,
            amount,
            balanceBefore,
            balanceAfter: updatedCard.balance,
            notes: "VIP card payment"
        },
            createdBy
        );
        return updatedCard;

    }


}

export const vipCardService = new VipCardService();