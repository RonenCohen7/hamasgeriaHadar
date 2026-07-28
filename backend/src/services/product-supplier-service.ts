import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { ProductSupplierModel } from "../models/product-supplier-model";
import { dal } from "../utils/dal";


class ProductSupplierService {


    // Get all product suppliers:
    public async getAllProductSuppliers(): Promise<ProductSupplierModel[]> {

        const sql = `
            SELECT
                ps.id_product_supplier AS idProductSupplier,
                ps.id_product AS idProduct,
                ps.id_supplier AS idSupplier,
                ps.supplier_catalog_number AS supplierCatalogNumber,
                ps.supplier_cost AS supplierCost,
                ps.is_preferred_supplier AS isPreferredSupplier,
                ps.created_at AS createdAt,
                ps.updated_at AS updatedAt,
                p.product_name AS productName,
                s.supplier_name AS supplierName
            FROM product_suppliers AS ps
            JOIN products AS p
                ON ps.id_product = p.id_product
            JOIN suppliers AS s
                ON ps.id_supplier = s.id_supplier
            ORDER BY p.product_name
        `;

        const productSuppliers =
            await dal.execute(sql) as ProductSupplierModel[];

        return productSuppliers;
    }


    // Get one product supplier:
    public async getOneProductSupplier(
        id: number
    ): Promise<ProductSupplierModel> {

        const sql = `
            SELECT
                ps.id_product_supplier AS idProductSupplier,
                ps.id_product AS idProduct,
                ps.id_supplier AS idSupplier,
                ps.supplier_catalog_number AS supplierCatalogNumber,
                ps.supplier_cost AS supplierCost,
                ps.is_preferred_supplier AS isPreferredSupplier,
                ps.created_at AS createdAt,
                ps.updated_at AS updatedAt,
                p.product_name AS productName,
                s.supplier_name AS supplierName
            FROM product_suppliers AS ps
            JOIN products AS p
                ON ps.id_product = p.id_product
            JOIN suppliers AS s
                ON ps.id_supplier = s.id_supplier
            WHERE ps.id_product_supplier = ?
        `;

        const values = [id];

        const productSuppliers =
            await dal.execute(sql, values) as ProductSupplierModel[];

        const productSupplier = productSuppliers[0];

        if (!productSupplier) {
            throw new ResourceNotFoundError(id);
        }

        return productSupplier;
    }


    // Get suppliers by product:
    public async getSuppliersByProduct(
        productId: number
    ): Promise<ProductSupplierModel[]> {

        const sql = `
            SELECT
                ps.id_product_supplier AS idProductSupplier,
                ps.id_product AS idProduct,
                ps.id_supplier AS idSupplier,
                ps.supplier_catalog_number AS supplierCatalogNumber,
                ps.supplier_cost AS supplierCost,
                ps.is_preferred_supplier AS isPreferredSupplier,
                ps.created_at AS createdAt,
                ps.updated_at AS updatedAt,
                p.product_name AS productName,
                s.supplier_name AS supplierName
            FROM product_suppliers AS ps
            JOIN products AS p
                ON ps.id_product = p.id_product
            JOIN suppliers AS s
                ON ps.id_supplier = s.id_supplier
            WHERE ps.id_product = ?
            ORDER BY ps.is_preferred_supplier DESC,
                     ps.supplier_cost ASC
        `;

        const values = [productId];

        const productSuppliers =
            await dal.execute(sql, values) as ProductSupplierModel[];

        return productSuppliers;
    }


    // Get products by supplier:
    public async getProductsBySupplier(
        supplierId: number
    ): Promise<ProductSupplierModel[]> {

        const sql = `
            SELECT
                ps.id_product_supplier AS idProductSupplier,
                ps.id_product AS idProduct,
                ps.id_supplier AS idSupplier,
                ps.supplier_catalog_number AS supplierCatalogNumber,
                ps.supplier_cost AS supplierCost,
                ps.is_preferred_supplier AS isPreferredSupplier,
                ps.created_at AS createdAt,
                ps.updated_at AS updatedAt,
                p.product_name AS productName,
                s.supplier_name AS supplierName
            FROM product_suppliers AS ps
            JOIN products AS p
                ON ps.id_product = p.id_product
            JOIN suppliers AS s
                ON ps.id_supplier = s.id_supplier
            WHERE ps.id_supplier = ?
            ORDER BY p.product_name
        `;

        const values = [supplierId];

        const productSuppliers =
            await dal.execute(sql, values) as ProductSupplierModel[];

        return productSuppliers;
    }


    // Add new product supplier:
    public async addProductSupplier(
        productSupplier: ProductSupplierModel
    ): Promise<ProductSupplierModel> {

        const sql = `
            INSERT INTO product_suppliers(
                id_product,
                id_supplier,
                supplier_catalog_number,
                supplier_cost,
                is_preferred_supplier
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
            productSupplier.idProduct,
            productSupplier.idSupplier,
            productSupplier.supplierCatalogNumber,
            productSupplier.supplierCost,
            productSupplier.isPreferredSupplier
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        productSupplier.idProductSupplier = info.insertId!;

        return productSupplier;
    }


    // Update product supplier:
    public async updateProductSupplier(
        productSupplier: ProductSupplierModel
    ): Promise<ProductSupplierModel> {

        const sql = `
            UPDATE product_suppliers
            SET
                id_product = ?,
                id_supplier = ?,
                supplier_catalog_number = ?,
                supplier_cost = ?,
                is_preferred_supplier = ?
            WHERE id_product_supplier = ?
        `;

        const values = [
            productSupplier.idProduct,
            productSupplier.idSupplier,
            productSupplier.supplierCatalogNumber,
            productSupplier.supplierCost,
            productSupplier.isPreferredSupplier,
            productSupplier.idProductSupplier
        ];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(
                productSupplier.idProductSupplier
            );
        }

        return productSupplier;
    }


    // Delete product supplier:
    public async deleteProductSupplier(id: number): Promise<void> {

        const sql = `
            DELETE FROM product_suppliers
            WHERE id_product_supplier = ?
        `;

        const values = [id];

        const info =
            await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }
}


export const productSupplierService =
    new ProductSupplierService();