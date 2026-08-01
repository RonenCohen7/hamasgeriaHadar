import express, {Request, Response, NextFunction} from "express";
import { supplierService } from "../services/supplier-service";
import { SupplierModel } from "../models/supplier-model";
import { log } from "console";


class SuppliersController{

    public readonly router = express.Router();

    public constructor(){

        this.router.get("/api/suppliers", this.getAllSuppliers);
        this.router.get("/api/suppliers/:id", this.getOneSupplier);
       
        this.router.post("/api/suppliers", this.addNewSupplier);
        this.router.patch("/api/suppliers/:id", this.updateSupplier);

        this.router.delete("/api/suppliers/:id", this.deleteSupplier);




    }

    //Get All Suppliers
    private async getAllSuppliers(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const suppliers = await supplierService.getAllSuppliers();
            response.json(suppliers);

        }catch(err:any){
            next(err);
        }
    }

    //Get One Supplier
    private async getOneSupplier(request:Request, response:Response,next:NextFunction):Promise<void>{
        try{
            const id = Number(request.params.id);
            if(!Number.isInteger(id) || id <= 0){
                response.json({ message: "Id must be a positive number. "});
                return;
            }

            const supplier = await supplierService.getOneSupplier(id);
            response.json(supplier);

        }catch(err:any){
            next(err);
        } 
    }





    //Add new Supplier
    private async addNewSupplier(request:Request, response:Response,next:NextFunction):Promise<void>{
        try{
            const supplier:SupplierModel = request.body;

            const addSupplier = await supplierService.addNewSupplier(supplier);
            response.json(addSupplier);
        }catch(err:any){
            next(err);
        }
    }


    //Update Supplier
    private async updateSupplier(request:Request, response:Response,next:NextFunction):Promise<void>{
        try{

            const id = Number(request.params.id);
            if(!Number.isInteger(id) || id <= 0){
                response.json({ message: "Id Must be a positive number. "});
                return;
            }
            const supplier:SupplierModel = request.body;
            supplier.idSupplier = id;

            const supplierUpdate = await supplierService.updateSupplier(supplier)
            response.json(supplierUpdate);

        }catch(err:any){
            next(err);
        }
    }

    //Delete suppliers
    private async deleteSupplier(request:Request, response:Response, next:NextFunction):Promise<void>{
        try{

            const id =  Number(request.params.id);
            if(!Number.isInteger(id) || id <= 0){
                response.json({message: "Id Must be a positive number. "});
                return;
            }

            await supplierService.deleteSupplier(id);
            response.sendStatus(204)

        }catch(err:any){
            next(err);
        }
    }
}

export const supplierController = new SuppliersController();