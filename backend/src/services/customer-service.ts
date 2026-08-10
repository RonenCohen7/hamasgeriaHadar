import { OkPacketParams, RowDataPacket } from "mysql2";

import { ConflictError, ResourceNotFoundError } from "../models/client-errors";

import { AddCustomerDto, CustomerAuthResponseModel, CustomerLoginDto, CustomerModel, CustomerRegisterDto, UpdateCustomerDto } from "../models/customer-model";

import { dal } from "../utils/dal";
import { sanitizeText } from "../utils/sanitize";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


class CustomerService {


    // ============================================================
    // REGISTER CUSTOMER
    // ============================================================

    public async registerCustomer(customer: CustomerRegisterDto): Promise<CustomerAuthResponseModel> {

        customer.firstName = sanitizeText(customer.firstName);
        customer.lastName = sanitizeText(customer.lastName);
        customer.email = sanitizeText(customer.email).toLowerCase();
        customer.phone = sanitizeText(customer.phone);


        // --------------------------------------------------------
        // Check duplicate email
        // --------------------------------------------------------

        const emailSql = `
            SELECT id_account
            FROM accounts
            WHERE email = ?
        `;

        const emailRows = await dal.execute(emailSql, [customer.email]) as RowDataPacket[];

        if (emailRows[0]) {
            throw new ConflictError("Email already exists");
        }


        // --------------------------------------------------------
        // Check duplicate phone
        // --------------------------------------------------------

        const phoneSql = `
            SELECT id_customer
            FROM customers
            WHERE phone = ?
        `;

        const phoneRows = await dal.execute(phoneSql, [customer.phone]) as RowDataPacket[];

        if (phoneRows[0]) {
            throw new ConflictError("Phone already exists");
        }


        // --------------------------------------------------------
        // Password
        // --------------------------------------------------------

        const hashedPassword = await bcrypt.hash(customer.password, 12);


        // --------------------------------------------------------
        // Create Account
        // --------------------------------------------------------

        const accountSql = `
            INSERT INTO accounts (
                email,
                password,
                account_type,
                is_active
            )
            VALUES (?, ?, ?, ?)
        `;

        const accountInfo = await dal.execute(
            accountSql,
            [
                customer.email,
                hashedPassword,
                "customer",
                true
            ]
        ) as OkPacketParams;


        const idAccount = Number(accountInfo.insertId);


        // --------------------------------------------------------
        // Create Customer
        // --------------------------------------------------------

        const customerSql = `
            INSERT INTO customers (
                id_account,
                first_name,
                last_name,
                phone,
                email
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const customerInfo = await dal.execute(
            customerSql,
            [
                idAccount,
                customer.firstName,
                customer.lastName,
                customer.phone,
                customer.email
            ]
        ) as OkPacketParams;


        const idCustomer = Number(customerInfo.insertId);


        // --------------------------------------------------------
        // JWT
        // --------------------------------------------------------

        const token = jwt.sign(
            {
                idAccount,
                idCustomer,
                accountType: "customer"
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "8h"
            }
        );


        return {

            token,

            customer: {

                idAccount,
                idCustomer,

                firstName: customer.firstName,
                lastName: customer.lastName,

                email: customer.email,
                phone: customer.phone,

                hasVipCard: false,
                tier: null,

                isActive: true,

                createdAt: new Date()
            }
        };
    }




    // ============================================================
    // CUSTOMER LOGIN
    // ============================================================

    public async loginCustomer(credentials: CustomerLoginDto): Promise<CustomerAuthResponseModel> {

        credentials.email = sanitizeText(credentials.email).toLowerCase();


        const sql = `
            SELECT

                c.id_customer AS idCustomer,
                c.id_account AS idAccount,

                c.first_name AS firstName,
                c.last_name AS lastName,

                c.phone,
                c.email,

                c.is_active AS isActive,

                c.created_at AS createdAt,

                a.password,

                CASE
                    WHEN vc.id_vip_card IS NULL
                    THEN FALSE
                    ELSE TRUE
                END AS hasVipCard,

                vc.tier AS tier

            FROM customers AS c

            INNER JOIN accounts AS a
                ON c.id_account = a.id_account

            LEFT JOIN vip_cards AS vc
                ON vc.id_customer = c.id_customer
                AND vc.card_status = 'active'

            WHERE a.email = ?
              AND a.account_type = 'customer'
              AND a.is_active = TRUE
              AND c.is_active = TRUE
        `;


        const customers = await dal.execute(
            sql,
            [credentials.email]
        ) as any[];


        const customer = customers[0];


        if (!customer) {
            throw new Error("Invalid email or password");
        }


        // --------------------------------------------------------
        // Password verification
        // --------------------------------------------------------

        const isMatch = await bcrypt.compare(
            credentials.password,
            customer.password
        );


        if (!isMatch) {
            throw new Error("Invalid email or password");
        }


        // --------------------------------------------------------
        // JWT
        // --------------------------------------------------------

        const token = jwt.sign(
            {
                idAccount: customer.idAccount,
                idCustomer: customer.idCustomer,
                accountType: "customer"
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "8h"
            }
        );


        return {

            token,

            customer: {

                idCustomer: customer.idCustomer,
                idAccount: customer.idAccount,

                firstName: customer.firstName,
                lastName: customer.lastName,

                email: customer.email,
                phone: customer.phone,

                isActive: Boolean(customer.isActive),

                hasVipCard:
                    Boolean(customer.hasVipCard),

                tier:
                    customer.tier ?? null,

                createdAt:
                    customer.createdAt
            }
        };
    }




    // ============================================================
    // GET ALL CUSTOMERS
    // ============================================================

    public async getAllCustomers(): Promise<CustomerModel[]> {

        const sql = `
            SELECT

                c.id_customer AS idCustomer,
                c.id_account AS idAccount,

                c.first_name AS firstName,
                c.last_name AS lastName,

                c.phone,
                c.email,

                c.date_of_birth AS dateOfBirth,

                c.is_active AS isActive,

                c.created_at AS createdAt,
                c.updated_at AS updatedAt,

                CASE
                    WHEN vc.id_vip_card IS NULL
                    THEN FALSE
                    ELSE TRUE
                END AS hasVipCard,

                vc.tier AS tier

            FROM customers AS c

            LEFT JOIN vip_cards AS vc
                ON vc.id_customer = c.id_customer
                AND vc.card_status = 'active'

            WHERE c.is_active = TRUE

            ORDER BY
                c.first_name,
                c.last_name
        `;


        return await dal.execute(sql) as CustomerModel[];
    }




    // ============================================================
    // GET ONE CUSTOMER
    // ============================================================

    public async getOneCustomer(id: number): Promise<CustomerModel> {

        const sql = `
            SELECT

                c.id_customer AS idCustomer,
                c.id_account AS idAccount,

                c.first_name AS firstName,
                c.last_name AS lastName,

                c.phone,
                c.email,

                c.date_of_birth AS dateOfBirth,

                c.is_active AS isActive,

                c.created_at AS createdAt,
                c.updated_at AS updatedAt,

                CASE
                    WHEN vc.id_vip_card IS NULL
                    THEN FALSE
                    ELSE TRUE
                END AS hasVipCard,

                vc.tier AS tier

            FROM customers AS c

            LEFT JOIN vip_cards AS vc
                ON vc.id_customer = c.id_customer
                AND vc.card_status = 'active'

            WHERE c.id_customer = ?
        `;


        const customers = await dal.execute(
            sql,
            [id]
        ) as CustomerModel[];


        const customer = customers[0];


        if (!customer) {
            throw new ResourceNotFoundError(id);
        }


        return customer;
    }




    // ============================================================
    // SEARCH CUSTOMERS
    // ============================================================

    public async searchCustomers(text: string): Promise<CustomerModel[]> {

        const cleanText =
            sanitizeText(text.trim()).toLowerCase();

        const searchText =
            `%${cleanText}%`;


        const sql = `
            SELECT

                c.id_customer AS idCustomer,
                c.id_account AS idAccount,

                c.first_name AS firstName,
                c.last_name AS lastName,

                c.phone,
                c.email,

                c.date_of_birth AS dateOfBirth,

                c.is_active AS isActive,

                c.created_at AS createdAt,
                c.updated_at AS updatedAt,

                CASE
                    WHEN vc.id_vip_card IS NULL
                    THEN FALSE
                    ELSE TRUE
                END AS hasVipCard,

                vc.tier AS tier

            FROM customers AS c

            LEFT JOIN vip_cards AS vc
                ON vc.id_customer = c.id_customer
                AND vc.card_status = 'active'

            WHERE c.is_active = TRUE

            AND (
                LOWER(c.first_name) LIKE ?
                OR LOWER(c.last_name) LIKE ?
                OR c.phone LIKE ?
                OR LOWER(c.email) LIKE ?
            )

            ORDER BY
                c.first_name,
                c.last_name
        `;


        return await dal.execute(
            sql,
            [
                searchText,
                searchText,
                searchText,
                searchText
            ]
        ) as CustomerModel[];
    }




    // ============================================================
    // ADD CUSTOMER BY ADMIN
    // Creates both ACCOUNT + CUSTOMER
    // ============================================================

    public async addCustomer(customer: AddCustomerDto): Promise<CustomerModel> {

        customer.firstName = sanitizeText(customer.firstName);

        customer.lastName = sanitizeText(customer.lastName);


        if (customer.phone) {
            customer.phone = sanitizeText(customer.phone);
        }


        if (customer.email) {
            customer.email = sanitizeText(customer.email).toLowerCase();
        }


        // --------------------------------------------------------
        // Email required for account
        // --------------------------------------------------------

        if (!customer.email) {
            throw new ConflictError("Customer email is required");
        }


        // --------------------------------------------------------
        // Password required for account
        // Add password!: string to AddCustomerDto
        // --------------------------------------------------------

        if (!customer.password) {
            throw new ConflictError("Customer password is required");
        }


        // --------------------------------------------------------
        // Duplicate Email
        // --------------------------------------------------------

        const existingAccountSql = `
            SELECT id_account
            FROM accounts
            WHERE email = ?
        `;

        const accounts = await dal.execute(
            existingAccountSql,
            [customer.email]
        ) as RowDataPacket[];


        if (accounts[0]) {
            throw new ConflictError(
                "Email already exists"
            );
        }


        // --------------------------------------------------------
        // Duplicate Phone
        // --------------------------------------------------------

        if (customer.phone) {

            const phoneSql = `
                SELECT id_customer
                FROM customers
                WHERE phone = ?
            `;

            const customers = await dal.execute(
                phoneSql,
                [customer.phone]
            ) as RowDataPacket[];


            if (customers[0]) {
                throw new ConflictError(
                    "Phone already exists"
                );
            }
        }


        // --------------------------------------------------------
        // Password
        // --------------------------------------------------------

        const hashedPassword = await bcrypt.hash(customer.password, 12);


        // --------------------------------------------------------
        // Create Account
        // --------------------------------------------------------

        const accountSql = `
            INSERT INTO accounts (
                email,
                password,
                account_type,
                is_active
            )
            VALUES (?, ?, ?, ?)
        `;


        const accountInfo = await dal.execute(
            accountSql,
            [
                customer.email,
                hashedPassword,
                "customer",
                true
            ]
        ) as OkPacketParams;


        const idAccount =
            Number(accountInfo.insertId);


        // --------------------------------------------------------
        // Date
        // --------------------------------------------------------

        const dateOfBirth =
            customer.dateOfBirth
                ? String(customer.dateOfBirth)
                    .slice(0, 10)
                : null;


        // --------------------------------------------------------
        // Create Customer
        // --------------------------------------------------------

        const customerSql = `
            INSERT INTO customers (
                id_account,
                first_name,
                last_name,
                phone,
                email,
                date_of_birth
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;


        const customerInfo = await dal.execute(
            customerSql,
            [
                idAccount,
                customer.firstName,
                customer.lastName,
                customer.phone ?? null,
                customer.email,
                dateOfBirth
            ]
        ) as OkPacketParams;


        return await this.getOneCustomer(
            Number(customerInfo.insertId)
        );
    }




    // ============================================================
    // UPDATE CUSTOMER
    // Updates customer + linked account
    // ============================================================

    public async updateCustomer(id: number, customer: UpdateCustomerDto): Promise<CustomerModel> {

        const existing = await this.getOneCustomer(id);


        const firstName =
            customer.firstName !== undefined
                ? sanitizeText(customer.firstName)
                : existing.firstName;


        const lastName =
            customer.lastName !== undefined
                ? sanitizeText(customer.lastName)
                : existing.lastName;


        const phone =
            customer.phone !== undefined
                ? sanitizeText(customer.phone)
                : existing.phone;


        const email =
            customer.email !== undefined
                ? sanitizeText(customer.email)
                    .toLowerCase()
                : existing.email;


        const dateOfBirth =
            customer.dateOfBirth !== undefined
                ? customer.dateOfBirth
                    ? String(customer.dateOfBirth)
                        .slice(0, 10)
                    : null
                : existing.dateOfBirth;


        const isActive =
            customer.isActive !== undefined
                ? customer.isActive
                : existing.isActive;


        // --------------------------------------------------------
        // Prevent duplicate email
        // --------------------------------------------------------

        if (email !== existing.email) {

            const emailSql = `
                SELECT id_account
                FROM accounts
                WHERE email = ?
                  AND id_account <> ?
            `;


            const rows = await dal.execute(
                emailSql,
                [
                    email,
                    existing.idAccount
                ]
            ) as RowDataPacket[];


            if (rows[0]) {
                throw new ConflictError(
                    "Email already exists"
                );
            }
        }


        // --------------------------------------------------------
        // Update customer
        // --------------------------------------------------------

        const customerSql = `
            UPDATE customers
            SET
                first_name = ?,
                last_name = ?,
                phone = ?,
                email = ?,
                date_of_birth = ?,
                is_active = ?
            WHERE id_customer = ?
        `;


        await dal.execute(
            customerSql,
            [
                firstName,
                lastName,
                phone,
                email,
                dateOfBirth,
                isActive,
                id
            ]
        );


        // --------------------------------------------------------
        // Update account
        // --------------------------------------------------------

        const accountSql = `
            UPDATE accounts
            SET
                email = ?,
                is_active = ?
            WHERE id_account = ?
        `;


        await dal.execute(
            accountSql,
            [
                email,
                isActive,
                existing.idAccount
            ]
        );


        return await this.getOneCustomer(id);
    }




    // ============================================================
    // SOFT DELETE CUSTOMER
    // Disables customer + account
    // ============================================================

    public async deleteCustomer(
        id: number
    ): Promise<void> {

        const customer =
            await this.getOneCustomer(id);


        // Customer
        const customerSql = `
            UPDATE customers
            SET is_active = FALSE
            WHERE id_customer = ?
        `;


        await dal.execute(
            customerSql,
            [id]
        );


        // Account
        const accountSql = `
            UPDATE accounts
            SET is_active = FALSE
            WHERE id_account = ?
        `;


        await dal.execute(
            accountSql,
            [customer.idAccount]
        );
    }

}


export const customerService =
    new CustomerService();