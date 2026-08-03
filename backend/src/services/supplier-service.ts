import { OkPacketParams, ResultSetHeader } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";

import { dal } from "../utils/dal";
import { SupplierModel } from "../models/supplier-model";
import { sanitizeText } from "../utils/sanitize";


class SupplierService {


    // Get all suppliers:
    public async getAllSuppliers(): Promise<SupplierModel[]> {

        const sql = `
            SELECT
                id_supplier AS idSupplier,
                supplier_name AS supplierName,
                supplier_email AS supplierEmail,
                supplier_mobile AS supplierMobile,
                supplier_address AS supplierAddress,
                is_active AS isActive,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM suppliers
            ORDER BY supplier_name
        `;

        const suppliers =
            await dal.execute(sql) as SupplierModel[];

        return suppliers;
    }


    // Get one supplier:
    public async getOneSupplier(
        id: number
    ): Promise<SupplierModel> {

        const sql = `
            SELECT
                id_supplier AS idSupplier,
                supplier_name AS supplierName,
                supplier_email AS supplierEmail,
                supplier_mobile AS supplierMobile,
                supplier_address AS supplierAddress,
                is_active AS isActive,
                created_at AS createdAt,
                updated_at AS updatedAt
            FROM suppliers
            WHERE id_supplier = ?
        `;

        const values = [id];

        const suppliers =
            await dal.execute(sql, values) as SupplierModel[];

        const supplier = suppliers[0];

        if (!supplier) {
            throw new ResourceNotFoundError(id);
        }

        return supplier;
    }


    // Add new supplier:
    public async addNewSupplier(supplier: SupplierModel): Promise<SupplierModel> {
        supplier.supplierName = sanitizeText(supplier.supplierName);
        supplier.supplierEmail = sanitizeText(supplier.supplierEmail);
        supplier.supplierMobile = sanitizeText(supplier.supplierMobile);
        supplier.supplierAddress = sanitizeText(supplier.supplierAddress);

        const sql = `
            INSERT INTO suppliers(
                supplier_name,
                supplier_email,
                supplier_mobile,
                supplier_address
            )
            VALUES (?, ?, ?, ?)
        `;

        const values = [
            supplier.supplierName,
            supplier.supplierEmail,
            supplier.supplierMobile,
            supplier.supplierAddress
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        supplier.idSupplier = info.insertId!;

        return supplier;
    }


    // Update supplier:
    public async updateSupplier(supplier: SupplierModel): Promise<SupplierModel> {
        supplier.supplierName = sanitizeText(supplier.supplierName);
        supplier.supplierEmail = sanitizeText(supplier.supplierEmail);
        supplier.supplierMobile = sanitizeText(supplier.supplierMobile);
        supplier.supplierAddress = sanitizeText(supplier.supplierAddress);

        const fields: string[] = [];

        const values:
            (string | number | boolean | Date | null)[] = [];

        if (supplier.supplierName !== undefined) {
            fields.push("supplier_name = ?");
            values.push(supplier.supplierName);
        }

        if (supplier.supplierEmail !== undefined) {
            fields.push("supplier_email = ?");
            values.push(supplier.supplierEmail);
        }

        if (supplier.supplierMobile !== undefined) {
            fields.push("supplier_mobile = ?");
            values.push(supplier.supplierMobile);
        }

        if (supplier.supplierAddress !== undefined) {
            fields.push("supplier_address = ?");
            values.push(supplier.supplierAddress);
        }

        if (supplier.isActive !== undefined) {
            fields.push("is_active = ?");
            values.push(supplier.isActive);
        }

        if (fields.length === 0) {
            return await this.getOneSupplier(
                supplier.idSupplier
            );
        }

        const sql = `
        UPDATE suppliers
        SET ${fields.join(", ")}
        WHERE id_supplier = ?
    `;

        values.push(supplier.idSupplier);

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(
                supplier.idSupplier
            );
        }

        return await this.getOneSupplier(
            supplier.idSupplier
        );
    }


    // Delete supplier:
    public async deleteSupplier(id: number): Promise<void> {

        const sql = `
            DELETE FROM suppliers
            WHERE id_supplier = ?
        `;

        const values = [id];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }

    //Get Supplier Count
    public async getSupplierCount(): Promise<number> {
        const sql = `
            SELECT COUNT(*) AS count
            FROM suppliers
            WHERE is_active =1
        `;
        const result = await dal.execute(sql) as any[];
        return result[0].count;

    }
}


export const supplierService = new SupplierService();