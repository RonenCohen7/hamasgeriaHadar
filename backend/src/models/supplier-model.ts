export class supplierModel {
    idSupplier!: number;
    supplierName!: string;
    supplierEmail!:string;
    supplierMobile!:string;
    supplierAddress!:string;
    isActive!:boolean;
    createdAt!:Date;
    updatedAt!:Date;
}


export class AddSuppliersDto {
    supplierName!:string;
    supplierEmail!:string;
    supplierMobile!:string;
    supplierAddress!:string;
}


export class UpdateSupplierDto {
    supplierName?: string;
    supplierEmail?:string;
    supplierMobile?:string;
    supplierAddress?:string;
}