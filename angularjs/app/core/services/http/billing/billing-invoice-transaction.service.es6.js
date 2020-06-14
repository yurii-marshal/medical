export default class BillingInvoiceTransactionService {
    constructor($http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    saveSLAdjustment(invoiceId, lineId, model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/service-lines/${lineId}/adjust`, model);
    }

    saveInvoiceAdjustment(invoiceId, model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/adjust`, model);
    }

    deleteSLTransaction(invoiceId, lineId, transactionId) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/service-lines/${lineId}/transactions/${transactionId}`);
    }

    deleteInvoiceTransaction(invoiceId, transactionId) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/transactions/${transactionId}`);
    }

    getSLTransactions(invoiceId, lineId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/service-lines/${lineId}/transactions`);
    }

    getInvoiceTransactions(invoiceId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/transactions`);
    }

}
