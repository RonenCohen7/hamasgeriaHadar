import axios from "axios";
import { SupplierModel } from "../models/supplier-model";
import { appConfig } from "../utils/app-config";

class SupplierService {

    //Get All Suppliers
    public async getAllSuppliers():Promise<SupplierModel[]>{
        const response = await axios.get<SupplierModel[]>(appConfig.supplierUrl)
        return response.data;
    }


    //GetOneSupplier
    public async getOneSupplier(idSupplier:number):Promise<SupplierModel>{
        const response = await axios.get<SupplierModel>(appConfig.supplierUrl + "/" +idSupplier);
        return response.data;
    }


    //Add new Supplier
    public async addSupplier(supplier:SupplierModel):Promise<SupplierModel>{
        const response = await axios.post<SupplierModel>(appConfig.supplierUrl, supplier);
        return response.data;
    }


    //Update Supplier
    public async updateSupplier(supplier:SupplierModel):Promise<SupplierModel>{
        const response = await axios.patch<SupplierModel>(appConfig.supplierUrl + supplier.idSupplier, supplier);
        return response.data;

    }

    //Delete Supplier
    public async deleteSupplier(idSupplier: number):Promise<void>{
        await axios.delete(appConfig.supplierUrl + idSupplier);
        
    }
}

export const supplierService = new SupplierService();