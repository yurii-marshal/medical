export default class patientShortInfoService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;

        this.patientShortInfo = {};
    }

    getShortInfo(patientId) {
        return this.$http.get(this.WEB_API_SERVICE_URI + `v1/patients/${patientId}/short-info`, { cache: false })
            .then((response) => {
                if (response.data) {
                    this.patientShortInfo = response.data;
                }
                return response;
            });
    }

    getPatientShortInfo() {
        return this.patientShortInfo;
    }

    clearPatientShortInfo() {
        this.patientShortInfo = {};
    }

    getPatientActiveOrders(patientId) {
        return this.$http.get(this.WEB_API_SERVICE_URI + `v1/patients/${patientId}/active-orders`);
    }
}
