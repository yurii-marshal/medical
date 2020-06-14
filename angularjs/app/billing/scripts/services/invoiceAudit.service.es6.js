export default class auditDetailsService {
    constructor($http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }


    getAuditList(invoiceId, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/audits`, { params });
    }

    getInvoiceAuditDetails(invoiceId, claimAuditId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/audits/${claimAuditId}/details`);
    }
}
