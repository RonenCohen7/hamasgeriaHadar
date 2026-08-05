class AppConfig {

    public baseUrl = "http://localhost:4000/api/"

    public readonly productUrl = this.baseUrl + "products";
    
    public readonly productCategoriesUrl = this.baseUrl + "categories";
    
    public readonly supplierUrl = this.baseUrl + "suppliers";
    
    public readonly supplierOrderUrl = this.baseUrl + "supplier-orders";
    
    public readonly productSuppliersUrl = this.baseUrl + "product-suppliers";
    
    public readonly salesUrl = this.baseUrl + "sales";
    
    public readonly inventoryUrl = this.baseUrl + "inventory/live"

    public readonly usersUrl = this.baseUrl + "users/";
    
    public readonly loginUrl = this.baseUrl + "users/login";
    
    public readonly registerUrl = this.baseUrl + "users/register";

    public readonly customersUrl = this.baseUrl + "customers"
}

export const appConfig = new AppConfig();