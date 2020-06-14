export default class InventoryProductService {
    constructor(
        $http,
        WEB_API_INVENTORY_SERVICE_URI,
        WEB_API_SERVICE_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getProductById(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${id}`);
    }

    getBundleComponents(productId) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${productId}/components`);
    }

    isUseProduct(productId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/products/${productId}/in-use`);
    }
}
