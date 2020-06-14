export default class BillingPriceOptionService {
    constructor( $http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    findPricings(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/find`, { params });
    }
}
