import { mapPatientInfoData } from '../../../core/services/http/core/core-patient/patient-info-mapping.es6';

export default class demographicsService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getMedicalInfoReleaseRelation() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/medical-info-release-relation/dictionary`, { cache: true });
    }

    getPatientInfoById(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}`, { cache: false }).then((response) => mapPatientInfoData(response));
    }

}

