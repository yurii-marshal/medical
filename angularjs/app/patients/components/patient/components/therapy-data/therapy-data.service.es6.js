export default class TherapyDataService {
    constructor($http, fileService, WEB_API_SERVICE_URI, authService) {
        'ngInject';

        this.$http = $http;
        this.fileService = fileService;
        this.authService = authService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getDevices(patientId) {
        const params = {
            patientId,
            status: 1
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/sleep-therapies`, { params });
    }

    getTherapy(deviceId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/sleep-therapies/${deviceId}`);
    }

    updateTherapy(patientId, sleepTherapyId, date) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}/v1/patients/${patientId}/sleep-therapies/${sleepTherapyId}`, {
            Date: date
        });
    }

    getReport(patientId, sleepTherapyId, params) {
        this.fileService.openFileOnTab({
            url: `${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/sleep-therapies/${sleepTherapyId}/reports/detailed/view`,
            method: 'POST',
            requestData: params
        });
    }
}

