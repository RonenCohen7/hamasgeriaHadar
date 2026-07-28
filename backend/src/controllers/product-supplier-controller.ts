import express, {
    Request,
    Response,
    NextFunction
} from "express";

import { productSupplierService }
    from "../services/product-supplier-service";

import { ProductSupplierModel }
    from "../models/product-supplier-model";


class ProductSupplierController {

    public readonly router = express.Router();


    public constructor() {

        this.router.get(
            "/api/product-suppliers", this.getAllProductsSuppliers);

        this.router.get("/api/product-suppliers/product/:productId", this.getSupplierByProduct);

        this.router.get("/api/product-suppliers/supplier/:supplierId", this.getProductBySupplier);

        this.router.get("/api/product-suppliers/:id", this.getOneProductSupplier);

        this.router.post("/api/product-suppliers", this.addProductSupplier);

        this.router.put("/api/product-suppliers/:id", this.updateProductSupplier);

        this.router.delete("/api/product-suppliers/:id", this.deleteProductSupplier);
    }


    // Get all product suppliers:
    private async getAllProductsSuppliers(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const productSuppliers =
                await productSupplierService.getAllProductSuppliers();

            response.json(productSuppliers);

        } catch (err: any) {
            next(err);
        }
    }


    // Get one product supplier:
    private async getOneProductSupplier(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({
                    message: "Id must be a positive number."
                });
                return;
            }

            const productSupplier =
                await productSupplierService.getOneProductSupplier(id);

            response.json(productSupplier);

        } catch (err: any) {
            next(err);
        }
    }


    // Get suppliers by product:
    private async getSupplierByProduct(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const productId = Number(request.params.productId);

            if (!Number.isInteger(productId) || productId <= 0) {
                response.status(400).json({
                    message: "Product id must be a positive number."
                });
                return;
            }

            const productSuppliers =
                await productSupplierService.getSuppliersByProduct(
                    productId
                );

            response.json(productSuppliers);

        } catch (err: any) {
            next(err);
        }
    }


    // Get products by supplier:
    private async getProductBySupplier(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const supplierId = Number(request.params.supplierId);

            if (!Number.isInteger(supplierId) || supplierId <= 0) {
                response.status(400).json({
                    message: "Supplier id must be a positive number."
                });
                return;
            }

            const productSuppliers =
                await productSupplierService.getProductsBySupplier(
                    supplierId
                );

            response.json(productSuppliers);

        } catch (err: any) {
            next(err);
        }
    }


    // Add product supplier:
    private async addProductSupplier(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const productSupplier: ProductSupplierModel = request.body;

            const addedProductSupplier = await productSupplierService.addProductSupplier(productSupplier);

            response.status(201).json(addedProductSupplier);

        } catch (err: any) {
            next(err);
        }
    }


    // Update product supplier:
    private async updateProductSupplier(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({
                    message: "Id must be a positive number."
                });
                return;
            }

            const productSupplier: ProductSupplierModel =
                request.body;

            productSupplier.idProductSupplier = id;

            const updatedProductSupplier =
                await productSupplierService.updateProductSupplier(
                    productSupplier
                );

            response.json(updatedProductSupplier);

        } catch (err: any) {
            next(err);
        }
    }


    // Delete product supplier:
    private async deleteProductSupplier(request: Request, response: Response, next: NextFunction): Promise<void> {

        try {
            const id = Number(request.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                response.status(400).json({
                    message: "Id must be a positive number."
                });
                return;
            }

            await productSupplierService.deleteProductSupplier(id);

            response.sendStatus(204);

        } catch (err: any) {
            next(err);
        }
    }
}


export const productSupplierController = new ProductSupplierController();