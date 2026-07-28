import { OkPacketParams } from "mysql2";
import { ProductModel } from "../models/product-model"
import { dal } from "../utils/dal"
import { ResourceNotFoundError } from "../models/client-errors";

class ProductService {

    //Get All Products
    public async getAllProducts(): Promise<ProductModel[]> {
        const sql = `
            SELECT 
                p.id_product As idProduct,
                p.product_name As productName,
                p.catalog_number As catalogNumber,
                p.product_cost As productCost,
                p.product_price As productPrice,
                p.product_stock As productStock,
                p.minimum_stock As minimumStock,
                p.unit_type As unitType,
                p.is_active As isActive,
                p.created_at As createdAt,
                p.update_at As updateAt,
                c.category_name As categoryName
            FROM product As p
            LEFT JOIN product_categories AS c
            ON p.id_category = c.id_category
            ORDER BY p.product_name
        `

        const products = await dal.execute(sql) as ProductModel[];

        return products;
    }


    //Get One product
    public async getOneProduct(id: number): Promise<ProductModel> {
        const sql = `
            SELECT 
                p.id_product AS idProduct,
                p.product_name AS productName,
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
                c.category_name AS categoryName
            FROM products AS p
            LEFT JOIN product_categories AS c
                ON p.id_category = c.id_category
            WHERE p.id_product = ?
        `

        const values = [id];
        const products = await dal.execute(sql,values) as ProductModel[];
        
        const product = products[0];
        if(!product){
            throw new ResourceNotFoundError(id);
        }

        return product;

    }




    //Add new Product
    public async addProduct(product:ProductModel):Promise<ProductModel>{
        const sql = `
            INSERT INTO products (
            product_Name,
            catalog_number,
            id_category,
            product_cost,
            product_price,
            product_stock,
            minimum_stock,
            unit_type
            )
            VALUES (?,?,?,?,?,?,?,?);
        `

        const values = [
            product.productName,
            product.catalogNumber,
            product.idCategory,
            product.productCost,
            product.productPrice,
            product.productStock,
            product.minimumStock,
            product.unitType
        ]

        const info = await dal.execute(sql,values) as OkPacketParams;
        product.idProduct = info.insertId!;
        return product;

    }



    //update product;
    public async updateProduct(product:ProductModel): Promise<ProductModel>{
        const sql = `
            UPDATE products
            SET
                product_name = ?,
                catalog_number = ?,
                id_category = ?,
                product_cost = ?,
                product_stock = ?,
                minimum_stock = ?,
                unit_type = ?,
                is_active = ?,
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
            product.idProduct
        ]

        const info = await dal.execute(sql,values) as OkPacketParams;

        if (info.affectedRows === 0){
            throw new ResourceNotFoundError(product.idProduct)
        }
        return product;
    }


    //delete Products
    public async deleteProduct(id:number):Promise<void>{
        const sql = `
            DELETE FROM products
            WHERE id_product = ?
        `
        const values = [id];

        const info = await dal.execute(sql,values) as OkPacketParams;

        if(info.affectedRows === 0){
            throw new ResourceNotFoundError(id)
        }
    }



    //Get low Stock product
    public async getLowStockProducts(): Promise<ProductModel[]>{
        const sql = `
            SELECT
                p.id_product AS idProduct,
                p.product_name AS productName,
                p.catalog_number As catalogNumber,
                p.id_category Ad idCategory,
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
}

export const productService = new ProductService();