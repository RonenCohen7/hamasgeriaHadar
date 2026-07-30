export class ProductModel {
    idProduct!: number;
    productName!: string;

    imageName!: string | null;
    imageUrl!: string | null;
    image?: File;

    catalogNumber!: string;

    idCategory!: number;
    categoryName!: string | null;

    productCost!: string;
    productPrice!: string;
    productStock!: string;
    minimumStock!: string;

    unitType!: string;
    isActive!: number;

    createdAt!: string;
    updatedAt!: string;
}