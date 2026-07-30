import axios from "axios";
import { appConfig } from "../utils/app-config";
import type { ProductCategoryModel } from "../models/category-model";

class ProductCategoryService {
    
    
    //Get all Categories
    public async getAllCategories():Promise<ProductCategoryModel[]>{
        const response = await axios.get<ProductCategoryModel[]>(appConfig.productCategoriesUrl);

        return response.data;
    }
}

export const productCategoryService = new ProductCategoryService();