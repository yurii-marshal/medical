export default class OrderDetailsService {
    constructor(
        $http,
        $q,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
    }

    getOrderedItems(orderId, params = {}) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/ordered/items`, { params })
            .then((response) => response.data.Items);
    }

    getProductBundles(productId) {
        const params = { Ids: [productId] };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/search`, { params })
            .then((response) => response.data);
    }
}
