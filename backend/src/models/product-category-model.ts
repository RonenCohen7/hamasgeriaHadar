export class ProductCategoryModel {
    idCategory!:number;
    categoryName!:string;
    description!:string | null;
    createdAt!: Date;
}



export class AddProductCategoryDto {
    categoryName!:string;
    description!: string;
}

export class UpdateProductCategoryDto {
    categoryName?: string;
    description?:string | null;
}