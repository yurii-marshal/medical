export default class patientFillSignService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    unscramblePdf(patientId, templateId, model) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/forms/${templateId}/unscramble`, model);
    }

    signPdf(patientId, templateId, model) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/forms/${templateId}/put`, model);
    }
}
