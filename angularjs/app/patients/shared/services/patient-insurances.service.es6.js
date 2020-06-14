import { insuredSignatureOnFileConstants } from '../../../core/constants/billing.constants.es6';

export default class patientInsurancesService {
    constructor($http, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;

        this.model = {
            activeInsurances: [],
            historyInsurances: []
        };
    }

    clearModel() {
        this.model = {
            activeInsurances: [],
            historyInsurances: []
        };
    }

    getModel() {
        return this.model;
    }

    getInsurances(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/insurances`)
            .then((response) => {
                angular.forEach(response.data.Items, (item) => item.statusClass = getStatusClass(item.Status));
                this.model.activeInsurances = response.data.Items;
                return response;
            });

        function getStatusClass(status) {
            switch (Number(status.Id)) {
                case 1: // active
                    return 'green';
                case 2: // Inactive
                    return 'gray';
                case 3: // Review
                    return 'orange';
                default: // Failed
                    return 'red';
            }
        }
    }

    getInsurancesHistory(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/inactive-insurances`)
            .then((response) => {
                this.model.historyInsurances = response.data;
                return response;
            });
    }

    getInsurance(insuranceId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/insurances/${insuranceId}`)
            .then((response) => {
                if (response.data.SignatureOnFile) {
                    response.data.SignatureOnFile.IsSigned = response.data.SignatureOnFile.IsSigned
                        ? insuredSignatureOnFileConstants.YES_ID
                        : insuredSignatureOnFileConstants.NO_ID;
                    response.data.SignatureOnFile.SignedDate = response.data.SignatureOnFile.SignedDate
                        ? moment.utc(response.data.SignatureOnFile.SignedDate).format('MM/DD/YYYY')
                        : null;
                }
                return response;
            });
    }

    getPayers(name) {
        let params = { name };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers`, { params });
    }

    getPatientInfo(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/short-info`);
    }

    save(patientId, insurance) {
        if (insurance.Id) {
            return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/insurances/${insurance.Id}`, getEditModel(insurance));
        }
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/insurances`, getEditModel(insurance));


        function getEditModel(insurance) {
            return {
                PayerId: insurance.Payer ? insurance.Payer.Id : undefined,
                PayerName: insurance.Payer ? insurance.Payer.Name : insurance.searchPayer,
                PolicyNumber: insurance.PolicyNumber,
                Status: insurance.Status.Id,
                Holder: {
                    Ssn: insurance.Holder.Ssn,
                    Name: insurance.Holder.Name,
                    DateOfBirthday: insurance.Holder.DateOfBirthday,
                    Relationship: insurance.Holder.Relationship ? insurance.Holder.Relationship.Id : undefined,
                    Address: insurance.Holder.Address,
                    Gender: insurance.Holder.Gender,
                    GroupNumber: insurance.Holder.GroupNumber,
                    PayerPlanId: insurance.Holder.PayerPlan && insurance.Holder.PayerPlan.Id
                },
                SignatureOnFile: {
                    IsSigned: insurance.SignatureOnFile.IsSigned === insuredSignatureOnFileConstants.YES_ID,
                    SignedDate: insurance.SignatureOnFile.SignedDate
                        ? moment.utc(insurance.SignatureOnFile.SignedDate).format('MM/DD/YYYY')
                        : null
                },
                Deductible: insurance.Deductible,
                Coinsurance: insurance.Coinsurance,
                Copay: insurance.Copay,
                EffectiveDate: insurance.EffectiveDate,
                TerminationDate: insurance.TerminationDate,
                InsuranceTypeCode: insurance.InsuranceTypeCode
            };
        }

    }

    deleteInsurance(id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/patients/insurances/${id}`);
    }

    manuallyVerify(insuranceId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/insurances/${insuranceId}/manually/verify`);
    }

    autoVerify(insuranceId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/insurances/${insuranceId}/automatically/verify`);
    }

    getBenefits(transactionId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/transactions/eligibility/${transactionId}`);
    }

    getRelationships() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/family-relations/dictionary`, { cache: true });
    }

    getSignatureOnFile() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/patient-signature-on-file/dictionary`, { cache: true });
    }

    getGenders() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/genders/dictionary`, { cache: true })
            .then((response) => {
                _.remove(response.data, (item) => item.Text.toLowerCase() === 'unknown');
                return response;
            });
    }

    getStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/insurance-status/dictionary`, { cache: true });
    }

    reorderInsurances(insurances) {
        let model = { Items: [] };

        angular.forEach(insurances, (item, index) => {
            model.Items.push({
                InsuranceId: item.Id,
                PriorityOrder: index + 1
            });
        });

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/insurances/change-priority`, model);
    }
}
