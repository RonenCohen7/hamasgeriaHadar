export interface ProductSupplierModel {
    idProductSupplier: number;
    idProduct: number;
    idSupplier: number;
    supplierCatalogNumber: string | null;
    supplierCost: number;
    isPreferredSupplier: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddProductSupplierDto {
    idProduct: number;
    idSupplier: number;
    supplierCatalogNumber?: string
    supplierCost: number;
    isPreferredSupplier?: boolean;
}


export interface UPdateProductSupplierDto {
    supplierCatalogNumber?: string | null;
    supplierCost?: number;
    isPreferredSupplier?: boolean;
}

export interface ProductSupplierDetailsModel {
    productName: string;
    supplierName: string;
}