export default class BillingPaymentService {
    constructor($http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    createPayment(model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments`, model);
    }

    updatePayment(model, paymentId) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}`, model);
    }

    getPayment(paymentId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}`);
    }

    getPayments(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments`, { params });
    }

    deletePayment(paymentId) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/${paymentId}`);
    }

}
