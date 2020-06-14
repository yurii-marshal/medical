export default class BillingDictionariesService {
    constructor($http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    getPOSDictionary(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/place-of-service/dictionary`, {
            cache: true,
            params
        });
    }

    getPayerAdjustmentReasons(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payer-adjustment-reason`, { params });
    }

    getPayerAdjustmentGroups() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payer-adjustment-group`);
    }

    getProviderAdjustmentReasons(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-adjustment-reason`, { params });
    }

    getProviderLevelAdjustments(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-level-adjustment`, { params });
    }

    getPaymentsStatuses() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/statuses/dictionary`, { cache: true });
    }

    getMethodsDictionary() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/methods/dictionary`, { cache: true });
    }

    getCoveragesDictionary() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/coverages/dictionary`);
    }

    getRemarksCodes(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payer-remark-code`, { params });
    }

    getModifiers(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/modifiers`, { params, cache: true });
    }

    getRenderingProviders(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering/dictionary`, { params });
    }

    getTaxonomyCodes(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/taxonomy-codes`, { params });
    }
}
