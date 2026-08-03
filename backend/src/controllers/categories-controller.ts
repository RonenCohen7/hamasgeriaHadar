import express, { Request, Response, NextFunction } from "express"
import { productCategoryService } from "../services/product-category-service";
import { ProductCategoryModel } from "../models/product-category-model";
import { verifyToken } from "../middleware/verify-token";
import { allowRoles } from "../middleware/role-middleware";

class CategoriesController {

    public readonly router = express.Router();


    public constructor() {

        this.router.get("/api/categories", this.getAllCategory);
        this.router.get("/api/categories/:id", this.getOneCategory);

        this.router.post("/api/categories",verifyToken, allowRoles("admin"), this.addCategory);
        this.router.put("/api/categories/:id",verifyToken, allowRoles("admin"),this.updateCategory);

        this.router.delete("/api/categories/:id",verifyToken, allowRoles("admin"), this.deleteCategory);

    }


    //Get All Category
    private async getAllCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const categories = await productCategoryService.getAllCategory();
            response.json(categories);


        } catch (err: any) {
            next(err)
        }
    }


    //Get One Category
    private async getOneCategory(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const id = Number(request.params.id)
            if (!Number.isInteger(id) || id <= 0) {
                response.json({ message: "Category Id Must Be A positive Number" });
                return
            }
            const category = await productCategoryService.getOneCategory(id);
            response.json(category);

        } catch (err: any) {
            next(err)
        }
    }


    //Add new Category
    private async addCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const category: ProductCategoryModel = request.body;

            const addCategory = await productCategoryService.addCategory(category);

            response.status(200).json(addCategory);

        } catch (err: any) {
            next(err)
        }
    }


    //Update Category
    private async updateCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "Category id must be a positive number" });
                return;
            }
            const category: ProductCategoryModel = request.body;
            category.idCategory = id;

            const updateCategory = await productCategoryService.updateProductCategory(category);
            response.json(updateCategory);

        } catch (err: any) {
            next(err);
        }
    }

    //Delete Category
    private async deleteCategory(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{
            const id  = Number(request.params.id);
            if(!Number.isInteger(id)|| id <= 0){
                response.json({message: "Id must be a positive number"})
                return;
            }

            await productCategoryService.deleteCategory(id);
            response.status(204);
        }catch(err:any){
            next(err)
        }
    }

}

export const categoriesController = new CategoriesController();