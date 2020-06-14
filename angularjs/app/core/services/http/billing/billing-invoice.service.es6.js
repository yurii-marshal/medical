export default class BillingInvoiceService {
    constructor($http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    searchInvoices(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/search`, { params });
    }

    getServiceLinesByInvoiceId(invoiceId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${ invoiceId }/service-lines`);
    }

    getInvoiceById(invoiceId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${ invoiceId }`);
    }

}
