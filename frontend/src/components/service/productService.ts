import axios from "axios";
import { ProductModel } from "../models/product-model";
import { appConfig } from "../utils/app-config";



class ProductService {
    //Get all products
    public async getAllProducts(): Promise<ProductModel[]> {
        const response = await axios.get<ProductModel[]>(appConfig.productUrl);

        return response.data;
    }


    //Get One product
    public async getOneProduct(id: number): Promise<ProductModel> {
        const response = await axios.get<ProductModel>(`${appConfig.productUrl}/${id}`);
        return response.data;
    }

    //update product
    public async updateProduct(product: ProductModel): Promise<ProductModel> {
        const formData = new FormData();

        formData.append("productName", product.productName);
        formData.append("catalogNumber", product.catalogNumber);
        formData.append("idCategory", String(product.idCategory));
        formData.append("productCost", product.productCost);
        formData.append("productPrice", product.productPrice);
        formData.append("productStock", product.productStock);
        formData.append("minimumStock", product.minimumStock);
        formData.append("unitType", product.unitType);

        formData.append("isFeatured", String(product.isFeatured ?? false));
        formData.append("displayOrder", String(product.displayOrder ?? 0));
        formData.append("isActive", String(product.isActive));

        if (product.image instanceof File) {
            formData.append("image", product.image);
        }

    


        const response = await axios.put<ProductModel>(`${appConfig.productUrl}/${product.idProduct}`, formData);
        return response.data;

    }

    //Add product
    public async addProduct(product: ProductModel): Promise<ProductModel> {
        const formData = new FormData();

        formData.append("productName", product.productName);
        formData.append("catalogNumber", product.catalogNumber);
        formData.append("idCategory", String(product.idCategory));
        formData.append("productCost", product.productCost);
        formData.append("productPrice", product.productPrice);
        formData.append("productStock", product.productStock);
        formData.append("minimumStock", product.minimumStock);
        formData.append("unitType", product.unitType);

        formData.append("isFeatured", String(product.isFeatured ?? false));
        formData.append("displayOrder", String(product.displayOrder ?? 0));
        formData.append("idSupplier", String(product.idSupplier));

        formData.append("supplierCost", String(product.supplierCost ?? product.productCost));
        formData.append("supplierCatalogNumber", product.catalogNumber ?? product.catalogNumber);

        if (product.image instanceof File) {
            formData.append("image", product.image);
        }

        const response = await axios.post<ProductModel>(
            appConfig.productUrl, formData);
        return response.data;
    }

    //delete product
    public async deleteProduct(id: number): Promise<void> {
        await axios.delete(`${appConfig.productUrl}/${id}`);
    }

    //Get products by Supplier
    public async getProductsBySupplier(supplierId: number): Promise<ProductModel[]> {
        const response = await axios.get<ProductModel[]>(`${appConfig.productSuppliersUrl}/supplier/${supplierId}`);
        return response.data;
    }

}

export const productService = new ProductService();