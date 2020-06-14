export default class BillingProviderService {
    constructor( $http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    getBillingProviderTaxTypes(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/tax-types/dictionary`, { cache: true, params });
    }

    getContactTypes() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/contact-types/dictionary`, { cache: true });
    }
}
