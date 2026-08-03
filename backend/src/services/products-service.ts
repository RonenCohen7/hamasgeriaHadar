import { OkPacketParams } from "mysql2";
import { AddProductModel, ProductModel } from "../models/product-model"
import { dal } from "../utils/dal"
import { ResourceNotFoundError, ResourceAlreadyExistsError } from "../models/client-errors";
import { fileSaver } from "uploaded-file-saver";
import { appConfig } from "../utils/app-config";
import { sanitizeText } from "../utils/sanitize";



class ProductService {

    //Get All Products
    public async getAllProducts(): Promise<ProductModel[]> {
        const sql = `
        SELECT 
            p.id_product AS idProduct,
            p.product_name AS productName,
            p.image_name AS imageName,
            p.catalog_number AS catalogNumber,
            p.product_cost AS productCost,
            p.product_price AS productPrice,
            p.product_stock AS productStock,
            p.minimum_stock AS minimumStock,
            p.unit_type AS unitType,
            p.is_active AS isActive,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,
            c.category_name AS categoryName,

            CASE
                WHEN p.image_name IS NOT NULL
                THEN CONCAT(?, p.image_name)
                ELSE NULL
            END AS imageUrl

        FROM products AS p

        LEFT JOIN product_categories AS c
            ON p.id_category = c.id_category

        WHERE p.is_active = 1

        ORDER BY p.product_name
        `;

        const values = [appConfig.baseImageUrl];

        const products = await dal.execute(sql, values) as ProductModel[];

        return products;
    }


    //Get One product
    public async getOneProduct(id: number): Promise<ProductModel> {

        const sql = `
        SELECT 
            p.id_product AS idProduct,
            p.product_name AS productName,
            p.image_name AS imageName,
            p.catalog_number AS catalogNumber,
            p.id_category AS idCategory,
            p.product_cost AS productCost,
            p.product_price AS productPrice,
            p.product_stock AS productStock,
            p.minimum_stock AS minimumStock,
            p.unit_type AS unitType,
            p.is_active AS isActive,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,

            c.category_name AS categoryName,

            ps.id_supplier AS idSupplier,
            ps.supplier_catalog_number AS supplierCatalogNumber,
            ps.supplier_cost AS supplierCost,
            ps.is_preferred_supplier AS isPreferredSupplier,

            s.supplier_name AS supplierName,

            CASE
                WHEN p.image_name IS NOT NULL
                THEN CONCAT(?, p.image_name)
                ELSE NULL
            END AS imageUrl

        FROM products AS p

        LEFT JOIN product_categories AS c
            ON p.id_category = c.id_category

        LEFT JOIN product_suppliers AS ps
            ON ps.id_product = p.id_product
            AND ps.is_preferred_supplier = 1

        LEFT JOIN suppliers AS s
            ON s.id_supplier = ps.id_supplier

        WHERE p.id_product = ?

        LIMIT 1
    `;

        const values = [appConfig.baseImageUrl, id];
        const products = await dal.execute(sql, values) as ProductModel[];

        const product = products[0];
        if (!product) {
            throw new ResourceNotFoundError(id);
        }

        return product;

    }



    //Add new Product
    public async addProduct(product: AddProductModel): Promise<ProductModel> {

        product.productName = sanitizeText(product.productName);
        product.catalogNumber = sanitizeText(product.catalogNumber);

        if (product.supplierCatalogNumber) {
            product.supplierCatalogNumber = sanitizeText(product.supplierCatalogNumber)
        }

        const checkIfBarcodeExists = `
            SELECT id_product As idProduct
            FROM products
            WHERE catalog_number = ?
        `;
        const existingProduct = await dal.execute(checkIfBarcodeExists, [product.catalogNumber]) as ProductModel[];
        if (existingProduct.length > 0) {
            throw new ResourceAlreadyExistsError("Catalog Number already exists");
        }

        if (product.image) {
            product.imageName = product.image ? await fileSaver.add(product.image, appConfig.productImages) : null!;
        }

        const sql = `
            INSERT INTO products (
            product_Name,
            catalog_number,
            id_category,
            product_cost,
            product_price,
            product_stock,
            minimum_stock,
            unit_type,
            image_name
            )
            VALUES (?,?,?,?,?,?,?,?,?);
        `

        const values = [
            product.productName,
            product.catalogNumber,
            product.idCategory ?? null,
            product.productCost,
            product.productPrice,
            product.productStock ?? 0,
            product.minimumStock ?? 0,
            product.unitType ?? null,
            product.imageName ?? null
        ]

        const info = await dal.execute(sql, values) as OkPacketParams;
        const idProduct = info.insertId!;




        const supplierSql = `
            INSERT INTO product_suppliers (
                id_product,
                id_supplier,
                supplier_catalog_number,
                supplier_cost,
                is_preferred_supplier
            )
            VALUES (?,?,?,?,?)
        `;
        const supplierValues = [
            idProduct,
            product.idSupplier,
            product.supplierCatalogNumber ?? product.catalogNumber,
            product.supplierCost ?? product.productCost, 1
        ]

        await dal.execute(supplierSql, supplierValues);

        return await this.getOneProduct(idProduct);

    }



    //update product;
    public async updateProduct(product: ProductModel): Promise<ProductModel> {

        product.productName = sanitizeText(product.productName);
        product.catalogNumber = sanitizeText(product.catalogNumber);

        if (product.supplierCatalogNumber) {
            product.supplierCatalogNumber = sanitizeText(product.supplierCatalogNumber)
        }
        const existingProduct = await this.getOneProduct(product.idProduct);
        if (product.image) {
            if (existingProduct.imageName) {
                await fileSaver.delete(existingProduct.imageName, appConfig.productImages);
            }


            product.imageName = await fileSaver.add(product.image, appConfig.productImages);

        }
        else {
            product.imageName = existingProduct.imageName;
        }


        const sql = `
            UPDATE products
            SET
                product_name = ?,
                catalog_number = ?,
                id_category = ?,
                product_cost = ?,
                product_price =?,
                product_stock = ?,
                minimum_stock = ?,
                unit_type = ?,
                is_active = ?,
                image_name = ?
            WHERE id_product = ?
        `

        const values = [
            product.productName,
            product.catalogNumber,
            product.idCategory,
            product.productCost,
            product.productPrice,
            product.productStock,
            product.minimumStock,
            product.unitType,
            product.isActive,
            product.imageName ?? null,
            product.idProduct
        ]

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(product.idProduct)
        }
        return product;
    }


    //delete Products
    public async deleteProduct(id: number): Promise<void> {

        const product = await this.getOneProduct(id);
        if (product.imageName) {
            await fileSaver.delete(product.imageName, appConfig.productImages);
        }

        const sql = `
            UPDATE products
            SET is_active = 0
            WHERE id_product = ?
        `
        const values = [id];

        const info = await dal.execute(sql, values) as OkPacketParams;

        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id)
        }
    }



    //Get low Stock product
    public async getLowStockProducts(): Promise<ProductModel[]> {
        const sql = `
            SELECT
                p.id_product AS idProduct,
                p.product_name AS productName,
                p.catalog_number As catalogNumber,
                p.id_category As idCategory,
                p.product_cost AS productCost,
                p.product_price AS productPrice,
                p.product_stock AS productStock,
                p.minimum_stock AS minimumStock,
                p.unit_type AS unitType,
                p.is_active AS isActive,
                p.created_at AS createdAt,
                p.updated_at AS updatedAt,
                c.category_name AS categoryName
            FROM products AS p
            LEFT JOIN product_categories AS c
                ON p.id_category = c.id_category
            WHERE p.product_stock <= p.minimum_stock
              AND p.is_active = true
            ORDER BY p.product_stock
        `
        const products = await dal.execute(sql) as ProductModel[];
        return products;
    }


    //Get Live Inventory
    public async getLiveInventory(): Promise<any[]> {
        const sql = `
        SELECT
            p.id_product AS idProduct,
            p.product_name AS productName,
            p.product_stock AS productStock,
            p.minimum_stock AS minimumStock,
            p.image_name AS imageName,

            s.id_supplier AS supplierId,
            s.supplier_name AS supplierName

        FROM products p

        LEFT JOIN product_suppliers ps
            ON ps.id_product = p.id_product
            AND ps.is_preferred_supplier = 1

        LEFT JOIN suppliers s
            ON s.id_supplier = ps.id_supplier

        ORDER BY p.product_name

        `;

        return await dal.execute(sql) as OkPacketParams[];
    }


}

export const productService = new ProductService();