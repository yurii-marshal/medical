export default class medicalRecordsService {
    constructor($http, $q, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;

        this.model = {
            diagnoses: [],
            medications: [],
            hospitals: []
        };
    }

    getModel() {
        return this.model;
    }

    getAllMedications(description, PageSize = 100) {
        let params = { description, PageSize };
        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/medications/dictionary`, { params });
    }

    getAllDiagnoses(codeWithDescription, pageSize = 100, pageIndex = 0, filters) {
        let params = { codeWithDescription, pageSize, pageIndex};
        if (filters) {
            params = angular.merge({}, params, filters);
        }
        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/diagnosis-codes/dictionary`,
            { cache: true, params });
    }

    getAllHospitals(name) {
        let params = { name };
        return this.$http.get(`${this.WEB_API_SERVICE_URI}hospitals`, { params });
    }

    getPatientMedicarRecords(patientId) {
        let diagnosesPromise = this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/diagnoses`)
            .then((response) => this.model.diagnoses = response.data.Items);

        let medicationsPromise = this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/medications`)
            .then((response) => this.model.medications = response.data.Items);

        let hospitalsPromise = this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/hospital-admissions`)
            .then((response) => {
                this.model.hospitals = response.data.Items.map((item) => {
                    item.AdmissionDate = moment.utc(item.AdmissionDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    item.DischargeDate = moment.utc(item.DischargeDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    return item;
                });
            });

        return this.$q.all([diagnosesPromise, medicationsPromise, hospitalsPromise]);
    }

    getDiagnosesHistory(patientId) {
        let params = { sortExpression: 'To DESC' };
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/diagnoses/history`, { params });
    }

    getMedicationsHistory(patientId) {
        let params = { sortExpression: 'To DESC' };
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/medications/history`);
    }

    save(model, patientId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/medical-records`, this._getPostModel(model));
    }

    _getPostModel(model) {
        return {
            Diagnoses: model.diagnoses.map((o) => o.Id),
            Medications: model.medications.map((o) => o.MedicationId),
            HospitalAdmissions: model.hospitals.map((hospital) => {
                return {
                    HospitalId: hospital.HospitalId,
                    AdmissionDate: hospital.AdmissionDate,
                    DischargeDate: hospital.DischargeDate,
                    Diagnoses: hospital.Diagnoses.map((diagnosis) => {
                        return {
                            DiagnosisCodeId: diagnosis.DiagnosisCodeId,
                            Description: diagnosis.CodeWithDescription
                        };
                    })
                };
            })
        };
    }
}
