import express, { Request, Response, NextFunction } from "express";
import { productService } from "../services/products-service";
import { ProductModel } from "../models/product-model";

import { UploadedFile } from "express-fileupload";



class ProductController {

    public readonly router = express.Router();


    public constructor() {
        this.router.get("/api/products", this.getAllProducts);
        this.router.get("/api/products/low-stock", this.getLowStockProducts);
        this.router.get("/api/products/:id", this.getOneProduct);

        this.router.post("/api/products", this.addProduct);
        this.router.put("/api/products/:id", this.updateProduct);

        this.router.delete("/api/products/:id", this.deleteProduct);
    }



    //Get All Products
    public async getAllProducts(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const products = await productService.getAllProducts();
            response.json(products);

        } catch (err: any) {
            next(err)
        }
    }

    //Get One Product
    public async getOneProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.json({ message: "Id must be a positive category. " })
                return
            }
            const product = await productService.getOneProduct(id);
            response.json(product);

        } catch (err: any) {
            next(err)
        }
    }


    //Add new product
    public async addProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const product: ProductModel = request.body;

            product.image = request.files?.image as UploadedFile;

            const addProduct = await productService.addProduct(product);

            response.status(201).json(addProduct);


        } catch (err: any) {
            next(err);
        }
    }


    //Update products
    private async updateProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {

            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({ message: "Id must be a positive number" });
                return;
            }
            const product: ProductModel = request.body
            product.idProduct = id;
            product.idCategory = Number(request.body.idCategory);
            product.isActive = request.body.isActive;
            product.image = request.files?.image as UploadedFile;

            product.image = request.files?.image as UploadedFile;

            const updateProduct = await productService.updateProduct(product);
            response.json(updateProduct);

        } catch (err: any) {
            next(err);
        }
    }


    //Delete product
    private async deleteProduct(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = Number(request.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                response.json({ message: "Id must be a positive number" });
                return;
            }

            await productService.deleteProduct(id);
            response.sendStatus(204);

        } catch (err: any) {
            next(err)
        }
    }



    private async getLowStockProducts(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const products = await productService.getLowStockProducts();

            response.json(products);

        } catch (err: any) {
            next(err);
        }
    }
}

export const productController = new ProductController();