import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { supplierModel } from "../models/supplier-model";
import { dal } from "../utils/dal";


class SupplierService {


    // Get all suppliers:
    public async getAllSuppliers(): Promise<supplierModel[]> {

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
            await dal.execute(sql) as supplierModel[];

        return suppliers;
    }


    // Get one supplier:
    public async getOneSupplier(
        id: number
    ): Promise<supplierModel> {

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
            await dal.execute(sql, values) as supplierModel[];

        const supplier = suppliers[0];

        if (!supplier) {
            throw new ResourceNotFoundError(id);
        }

        return supplier;
    }


    // Add new supplier:
    public async addNewSupplier(
        supplier: supplierModel
    ): Promise<supplierModel> {

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
    public async updateSupplier(
        supplier: supplierModel
    ): Promise<supplierModel> {

        const sql = `
            UPDATE suppliers
            SET
                supplier_name = ?,
                supplier_email = ?,
                supplier_mobile = ?,
                supplier_address = ?,
                is_active = ?
            WHERE id_supplier = ?
        `;

        const values = [
            supplier.supplierName,
            supplier.supplierEmail,
            supplier.supplierMobile,
            supplier.supplierAddress,
            supplier.isActive,
            supplier.idSupplier
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(
                supplier.idSupplier
            );
        }

        return supplier;
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
}


export const supplierService = new SupplierService();