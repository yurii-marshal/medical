import { normalizeDeliveryСompaniesData } from './delivery-companies-dictionary.normalization.es6';
import { mapPatientInfoData } from './patient-info-mapping.es6';

export default class CorePatientService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    // Dictionaries
    getPatientStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/patient-status/dictionary`)
            .then((response) => response);
    }

    getPatientInactiveStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/patient-inactive-status/dictionary`);
    }

    getDeliveryCompanies() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/orders/delivery-companies/dictionaries`).then((response) => normalizeDeliveryСompaniesData(response));
    }

    getPatientsTags(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/tags`, { params })
            .then((response) => response);
    }

    createPatientsTag(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/tag`, data);
    }

    getPatientTags(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/tags`)
            .then((response) => response);
    }

    // Get Patient
    getPatientInfoById(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}`, { cache: false }).then((response) => mapPatientInfoData(response));
    }

    // Patients Edit
    savePatientState(stateModel) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${stateModel.PatientId.Id}/state`, stateModel);
    }

    getPatientsDictionary(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/dictionary`, { params });
    }

    // Enroll to MedSage
    enrollToMedSage(data) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${data.PatientId.Id}/medsage`, data);
    }
}
