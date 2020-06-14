import { insuredSignatureOnFileConstants } from '../../../../core/constants/billing.constants.es6.js';

export default class InvoiceInsuranceService {
    constructor($http, WEB_API_BILLING_SERVICE_URI, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getInsurance(claimId, claimInsuranceId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${claimId}/insurances/${claimInsuranceId}`)
            .then((response) => {
                response.data.Person.DateOfBirth = response.data.Person.DateOfBirth
                       ? moment.utc(response.data.Person.DateOfBirth).format('MM/DD/YYYY') : '';
                response.data.SignatureOnFile.SignedDate = response.data.SignatureOnFile.SignedDate
                       ? moment.utc(response.data.SignatureOnFile.SignedDate).format('MM/DD/YYYY') : '';
                return response;
            });
    }

    editInvoiceInsurance(claimId, insurance) {
        let model = this._getPutModel(insurance);
        let claimInsuranceId = insurance.Id;

        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${claimId}/insurances/${claimInsuranceId}`, model);
    }

    getPayerPlans(payerId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payers/${payerId}/plans`);
    }

    _getPutModel(data) {
        return {
            PayerId: data.Payer.Id,
            Subscriber: {
                Name: {
                    FirstName: data.Person.Name.FirstName,
                    LastName: data.Person.Name.LastName,
                    MiddleName: data.Person.Name.MiddleName
                },
                DateOfBirth: moment.utc(data.Person.DateOfBirth).format('MM/DD/YYYY'),
                Gender: data.Person.Gender,
                Address: {
                    AddressLine: data.Person.Address.AddressLine,
                    AddressLine2: data.Person.Address.AddressLine2,
                    City: data.Person.Address.City,
                    State: data.Person.Address.State,
                    Zip: data.Person.Address.Zip
                },
                Ssn: data.Person.Ssn
            },
            Relationship: data.Relationship.Id,
            PolicyNumber: data.PolicyNumber,
            GroupNumber: data.GroupNumber,
            PayerPlanId: data.PayerPlan && data.PayerPlan.Id,
            InsuranceTypeCode: data.InsuranceTypeCode,
            SyncHash: guid(true),
            SignatureOnFile: {
                IsSigned: data.SignatureOnFile.IsSigned,
                SignedDate: data.SignatureOnFile.IsSigned === insuredSignatureOnFileConstants.YES_ID
                    ? moment.utc(data.SignatureOnFile.SignedDate).format('MM/DD/YYYY')
                    : ''
            }
        };
    }

    getRelationships() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/relationship/types/dictionary`, { cache: true });
    }

    getGenders() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/genders/dictionary`, { cache: true })
            .then((response) => {
                _.remove(response.data, (item) => item.Text.toLowerCase() === 'unknown');
                return response;
            });
    }

    getSignatureOnFile() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/patient-signature-on-file/dictionary`, { cache: true });
    }

}
