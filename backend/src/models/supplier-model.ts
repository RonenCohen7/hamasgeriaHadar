export interface supplierModel {
    idSupplier: number;
    supplierName: string;
    supplierEmail:string;
    supplierMobile:string;
    supplierAddress:string;
    isActive:boolean;
    createdAt:Date;
    updatedAt:Date;
}


export interface AddSuppliersDto {
    supplierName:string;
    supplierEmail:string;
    supplierMobile:string;
    supplierAddress:string;
}


export interface UpdateSupplierDto {
    supplierName?: string;
    supplierEmail?:string;
    supplierMobile?:string;
    supplierAddress?:string;
}