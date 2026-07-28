export interface ProductCategoryModel {
    idCategory:number;
    categoryName:string;
    description:string | null;
    createdAt: Date;
}



export interface AddProductCategoryDto {
    categoryName:string;
    description: string;
}

export interface UpdateProductCategoryDto {
    categoryName?: string;
    description?:string | null;
}