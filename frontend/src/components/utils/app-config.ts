class AppConfig {

    public baseUrl = import.meta.env.VITE_API_URL;
    public baseMediaUrl = import.meta.env.VITE_MEDIA_URL;

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

    public readonly vipCardsUrl = this.baseUrl + "vip-cards"

    public readonly customerRegisterUrl = this.customersUrl + "/register";

    public readonly customerLoginUrl = this.customersUrl + "/login";

    public readonly eventsUpcomingUrl = this.baseUrl + "events/upcoming"

    public readonly eventsUrl = this.baseUrl + "events"

    public readonly experiencesUrl = this.baseUrl + "experiences"


}

export const appConfig = new AppConfig();