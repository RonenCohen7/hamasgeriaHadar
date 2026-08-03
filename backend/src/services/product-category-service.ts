import { OkPacketParams } from "mysql2";
import { ResourceNotFoundError } from "../models/client-errors";
import { ProductCategoryModel } from "../models/product-category-model";
import { dal } from "../utils/dal";
import { sanitizeText } from "../utils/sanitize";

class ProductCategoryService {
    //get all product category 
    public async getAllCategory(): Promise<ProductCategoryModel[]> {
        const sql = `
            SELECT
                id_category AS idCategory,
                category_name As categoryName,
                description,
                created_at As createdAt
            FROM product_categories
            ORDER BY category_name
        `;
        const categories = await dal.execute(sql) as ProductCategoryModel[];
        return categories;
    }

    //get one product category
    public async getOneCategory(id: number): Promise<ProductCategoryModel> {
        const sql = `
            SELECT
            id_category AS idCategory,
            category_name AS categoryName,
            description,
            created_at AS createdAt
        FROM product_categories
        WHERE id_category = ?
    `;
        const values = [id];

        const categories = await dal.execute(sql, values) as ProductCategoryModel[];

        const category = categories[0];
        if (!category) {
            throw new ResourceNotFoundError(id);
        }
        return category;
    }


    //Add new Category
    public async addCategory(category: ProductCategoryModel): Promise<ProductCategoryModel> {
        category.categoryName = sanitizeText(category.categoryName);
        category.description = sanitizeText(category.description) ? sanitizeText(category.description) : "";


        const sql = `
            INSERT INTO product_categories(
            category_name,
            description)
            VALUES(?,?);
        `
        const values = [
            category.categoryName, category.description
        ];

        const info = await dal.execute(sql, values) as OkPacketParams;
        category.idCategory = info.insertId!;


        return category;
    }



    //Update  Category
    public async updateProductCategory(category: ProductCategoryModel): Promise<ProductCategoryModel> {
        category.categoryName = sanitizeText(category.categoryName);
        category.description = sanitizeText(category.description) ? sanitizeText(category.description) : "";

        const sql = `
            UPDATE product_categories
            SET
                category_name=?,
                description =?
            WHERE id_category = ?
        `;

        const values = [
            category.categoryName,
            category.description,
            category.idCategory
        ]
        const info = await dal.execute(sql, values) as OkPacketParams;
        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(category.idCategory);
        }

        return category;
    }


    //DELETE Category
    public async deleteCategory(id: number): Promise<void> {
        const sql = `
            DELETE FROM product_categories
            WHERE id_category = ?
        `
        const values = [id];

        const info = await dal.execute(sql, values) as OkPacketParams;
        if (info.affectedRows === 0) {
            throw new ResourceNotFoundError(id);
        }
    }

}

export const productCategoryService = new ProductCategoryService();
