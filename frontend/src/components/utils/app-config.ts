class AppConfig {

    public baseUrl = "http://localhost:4000/api/"

    public readonly productUrl = this.baseUrl + "products";
    public readonly productCategoriesUrl = this.baseUrl + "categories";
    public readonly supplierUrl = this.baseUrl + "suppliers";
    public readonly supplierOrderUrl = this.baseUrl + "supplier-orders"
    public readonly productSuppliersUrl = this.baseUrl + "product-suppliers"
}

export const appConfig = new AppConfig();