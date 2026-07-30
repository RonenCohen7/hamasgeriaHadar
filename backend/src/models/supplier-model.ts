export class SupplierModel {
    idSupplier!: number;
    supplierName!: string;
    supplierEmail!:string;
    supplierMobile!:string;
    supplierAddress!:string;
    isActive!:boolean;
    createdAt!:Date;
    updatedAt!:Date;
    
}


export class AddSupplierDto {
    supplierName!:string;
    supplierEmail!:string;
    supplierMobile!:string;
    supplierAddress!:string;
}


export class UpdateSupplierDto {
    idSupplier!: number;
    supplierName?: string;
    supplierEmail?:string;
    supplierMobile?:string;
    supplierAddress?:string;
    isActive?: boolean;
}