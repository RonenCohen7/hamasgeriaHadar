import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { AddCustomerDto, CustomerModel, UpdateCustomerDto } from "../models/customer-model";
import { dal } from "../utils/dal";
import { sanitizeText } from "../utils/sanitize";

class CustomerService {

    //Get All customers
    public async getAllCustomers(): Promise<CustomerModel[]> {
        const sql = `
            SELECT 
                c.id_customer AS idCustomer,
                c.first_name AS firstName,
                c.last_name AS lastName,
                c.phone,
                c.email,
                c.date_of_birth AS dateOfBirth,
                c.is_active AS isActive,
                c.created_at AS createdAt,
                c.updated_at AS updatedAt,
            CASE
                WHEN vc.id_vip_card IS NULL THEN FALSE
                ELSE TRUE
            END AS hasVipCard

            FROM customers c
            LEFT JOIN vip_cards vc
                ON vc.id_customer = c.id_customer
            WHERE c.is_active = TRUE
            ORDER BY first_name, last_name
        `;
        return await dal.execute(sql) as CustomerModel[];

    }




    //Get One customer
    public async getOneCustomer(id: number): Promise<CustomerModel> {
        const sql = `
            SELECT 
                c.id_customer As idCustomer,
                c.first_name As firstName,
                c.last_name As lastName,
                c.phone,
                c.email,
                c.date_of_birth As dateOfBirth,
                c.is_active AS isActive,
                c.created_at As createdAt,
                c.updated_at As updatedAt,
                CASE
                    WHEN vc.id_vip_card IS NULL THEN FALSE
                    ELSE TRUE
                END AS hasVipCard
           FROM customers c
           LEFT JOIN vip_cards vc
                ON vc.id_customer = c.id_customer

            WHERE c.id_customer = ?
        `;
        const customers = await dal.execute(sql, [id]) as CustomerModel[];

        const customer = customers[0];
        if (!customer) {
            throw new ResourceNotFoundError(id);
        }
        return customer;
    }



    //Search customer
    public async searchCustomers(text: string): Promise<CustomerModel[]> {
        const cleanText = sanitizeText(text.trim());
        const searchText = `%${cleanText}%`

        const sql = `
        SELECT
            c.id_customer AS idCustomer,
            c.first_name AS firstName,
            c.last_name AS lastName,
            c.phone,
            c.email,
            c.date_of_birth AS dateOfBirth,
            c.is_active AS isActive,
            c.created_at AS createdAt,
            c.updated_at AS updatedAt,
            CASE
                WHEN vc.id_vip_card IS NULL THEN FALSE
                ELSE TRUE
            END AS hasVipCard
        FROM customers c
        LEFT JOIN vip_cards vc
            ON vc.id_customer = c.id_customer
        WHERE c.is_active = TRUE
          AND (
                LOWER(c.first_name) LIKE ?
                OR LOWER(c.last_name) LIKE ?
                OR c.phone LIKE ?
                OR LOWER(c.email) LIKE ?
          )
        ORDER BY c.first_name, c.last_name
        `;
        return await dal.execute(sql, [
            searchText,
            searchText,
            searchText,
            searchText
        ]) as CustomerModel[];
    }



    //Add customer
    public async addCustomer(customer: AddCustomerDto): Promise<CustomerModel> {
        customer.firstName = sanitizeText(customer.firstName);
        customer.lastName = sanitizeText(customer.lastName)
        if (customer.phone) { customer.phone = sanitizeText(customer.phone) }
        if (customer.email) { customer.email = sanitizeText(customer.email) }

        const dateOfBirth = customer.dateOfBirth ? String(customer.dateOfBirth).slice(0, 10) : null;

        const sql = `
            INSERT INTO customers (
                first_name,
                last_name,
                phone,
                email,
                date_of_birth
            )
            VALUES (?,?,?,?,?)            
        `;
        const values = [
            customer.firstName,
            customer.lastName,
            customer.phone ?? null,
            customer.email ?? null,
            dateOfBirth
        ]
        const info = await dal.execute(sql, values) as OkPacketParams;
        return await this.getOneCustomer(Number(info.insertId))
    }



    //Update customer
    public async updateCustomer(id: number, customer: UpdateCustomerDto): Promise<CustomerModel> {

        const existing = await this.getOneCustomer(id);

        const firstName = customer.firstName !== undefined ? sanitizeText(customer.firstName) : existing.firstName;
        const lastName = customer.lastName !== undefined ? sanitizeText(customer.lastName) : existing.lastName;
        const phone = customer.phone !== undefined ? sanitizeText(customer.phone) : existing.phone;
        const email = customer.email !== undefined ? sanitizeText(customer.email) : existing.email;
        const dateOfBirth = customer !== undefined ? customer.dateOfBirth ? String(customer.dateOfBirth).slice(0, 10) : null : existing.dateOfBirth;
        const isActive = customer.isActive !== undefined ? customer.isActive : existing.isActive;

        const sql = `
            UPDATE customers
            SET
                first_name = ?,
                last_name = ?,
                phone = ?,
                email = ?,
                date_of_birth = ?,
                is_active =?
            WHERE id_customer = ?
        `;
        const values = [
            firstName,
            lastName,
            phone,
            email,
            dateOfBirth,
            isActive,
            id
        ];
        await dal.execute(sql, values)
        return this.getOneCustomer(id);
    }


    //Soft Delete
    public async deleteCustomer(id: number): Promise<void> {
        await this.getOneCustomer(id)

        const sql = `
            UPDATE customers
            SET is_active = FALSE
            WHERE id_customer = ?
        `;
        await dal.execute(sql, [id])
    }

}

export const customerService = new CustomerService();