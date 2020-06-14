export default class PayerPlansService {
    constructor( $http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    getPayerPlans(payerId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payers/${payerId}/plans`);
    }
}
