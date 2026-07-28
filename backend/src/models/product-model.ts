import { UnitType } from "./enum";

export interface ProductModel {
    idProduct: number;
    productName: string;
    catalogNumber: string;
    idCategory: number | null;
    productCost: number;
    productPrice: number;
    productStock: number;
    minimumStock:number;
    unitType: UnitType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    categoryName?: string | null;
}

export interface AddProductDto {
    productName: string;
    catalogNumber:string;
    idCategory?:number | null;
    productCost: number;
    productPrice: number;
    productStock?: number;
    minimumStock?: number;
    unitType?: UnitType;
}



export interface UpdateProductDto {
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

export interface ProductWithCategoryModel extends ProductModel {
    categoryName: string | null
}

export interface LowStockProductModel {
    idProduct: number;
    productName: string;
    catalogNumber:string;
    productStock: number;
    minimumStock: number;
    unitType: UnitType;
    categoryName: string | null;
}