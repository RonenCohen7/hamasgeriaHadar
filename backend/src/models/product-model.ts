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
    minimumStock!: number;
    unitType!: UnitType;
    isActive!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
    categoryName?: string | null;
    idSupplier?: number;
    supplierName?: string;
    supplierCatalogNumber?: string;
    supplierCost?: number;
    isPreferredSupplier?: boolean;


    image?: UploadedFile;
    imageName?: string;
    imageUrl?: string | null;
}

export class AddProductModel {
    image?: UploadedFile;
    imageName?: string | null;

    idProduct!: number;
    productName!: string;

    idSupplier!: number;
    supplierCatalogNumber?: string;
    supplierCost!: number;

    catalogNumber!: string;
    idCategory?: number | null;

    productCost!: number;
    productPrice!: number;
    productStock?: number;
    minimumStock?: number;
    unitType?: UnitType;
}



export class UpdateProductDto {
    productName?: string;
    catalogNumber?: string;
    idCategory?: number;
    productCost?: number;
    productPrice?: number;
    productStock?: number;
    minimumStock?: number;
    unitType?: UnitType;
    isActive?: boolean;
}



export class LowStockProductModel {
    idProduct!: number;
    productName!: string;
    catalogNumber!: string;
    productStock!: number;
    minimumStock!: number;
    unitType!: UnitType;
    categoryName!: string | null;
}