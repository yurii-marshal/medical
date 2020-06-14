export default class ClaimsStatementsService {
    constructor(
        $http,
        WEB_API_BILLING_SERVICE_URI,
        WEB_API_SERVICE_URI
        ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getStatements(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI }v1/claims/statements`, { params });
    }

    getStatementsAges() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI }v1/claims/statements/ages/dictionary`);
    }

    hideProgressBar() {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/statements/clear`);
    }
}
