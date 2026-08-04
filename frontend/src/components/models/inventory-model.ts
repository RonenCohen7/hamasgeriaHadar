export class InventoryModel {
    idProduct!: number;
    productName!: string;
    productStock!:number;
    minimumStock!:number;
    supplierName!:string | null;
    supplierId!:number | null;
    imageName?:string | null;
}