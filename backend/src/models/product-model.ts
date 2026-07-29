import { UploadedFile } from "express-fileupload";
import { UnitType } from "./enum";

export class ProductModel {
    idProduct!: number;
    productName!: string;
    catalogNumber!: string;
    idCategory!: number | null;
    productCost!: number;
    productPrice!: number;
    productStock!: number;
    minimumStock!:number;
    unitType!: UnitType;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    categoryName?: string | null;
    
    
    image?: UploadedFile;
    imageName?: string;
    imageUrl?: string | null;
}

export class AddProductDto {
    productName!: string;
    catalogNumber!:string;
    idCategory?:number | null;
    productCost!: number;
    productPrice!: number;
    productStock?: number;
    minimumStock?: number;
    unitType?: UnitType;
}



export class UpdateProductDto {
    productName?:string;
    catalogNumber?:string;
    idCategory?:number;
    productCost?:number;
    productPrice?:number;
    productStock?:number;
    minimumStock?:number;
    unitType?:UnitType;
    isActive?: boolean;
}



export class LowStockProductModel {
    idProduct!: number;
    productName!: string;
    catalogNumber!:string;
    productStock!: number;
    minimumStock!: number;
    unitType!: UnitType;
    categoryName!: string | null;
}