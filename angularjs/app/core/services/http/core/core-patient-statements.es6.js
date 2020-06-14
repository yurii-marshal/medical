export default class PatientStatementsService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    generateStatements(options) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/statements/generate`, options);
    }

    getStatementsStatus() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/statements/status`);
    }

    statementGenerationCancel() {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/statements/cancel`);
    }
}
