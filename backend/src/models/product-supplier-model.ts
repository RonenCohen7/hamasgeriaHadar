export class ProductSupplierModel {
    idProductSupplier!: number;
    idProduct!: number;
    idSupplier!: number;
    supplierCatalogNumber!: string | null;
    supplierCost!: number;
    isPreferredSupplier!: boolean;
    createdAt!: Date;
    updatedAt!: Date;
}

export class AddProductSupplierDto {
    idProduct!: number;
    idSupplier!: number;
    supplierCatalogNumber?: string
    supplierCost!: number;
    isPreferredSupplier?: boolean;
}


export class UpdateProductSupplierDto {
    supplierCatalogNumber?: string | null;
    supplierCost?: number;
    isPreferredSupplier?: boolean;
}

export class ProductSupplierDetailsModel {
    productName!: string;
    supplierName!: string;
}