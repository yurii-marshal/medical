import { insurancePriorityConstants } from '../constants/billing.constants.es6';

export default class RentalOptionsService {
    constructor($http, WEB_API_BILLING_SERVICE_URI, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    startRent(rentId, model) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/rent/${rentId}/start`, model);
    }

    updateRent(rentId, model) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/rent/${rentId}`, model);
    }

    stopRent(rentId, model) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/rent/${rentId}/stop`, model);
    }

    getRentProgramById(programId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/rent/${programId}`)
            .then((response) => response.data);
    }

    getPatientRentalItems(patientId, filters, pageIndex, pageSize = 100) {
        let defaultParams = {
            pageIndex,
            pageSize,
            sortExpression: 'CreatedOn DESC'
        };
        const params = angular.merge({}, defaultParams, filters);

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/rent-programs`, { params })
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    item.statusClass = getItemStatusClass(item.IsActive);
                    return item;
                });

                return response;
            });

        function getItemStatusClass(isActive) {
            switch (isActive) {
                case true:
                    return 'green';
                case false:
                    return 'gray';
                default:
                    break;
            }
        }
    }

    getPatientRentalHistory(patientId, filters, pageIndex, pageSize = 100) {
        let defaultParams = {
            pageIndex,
            pageSize,
            sortExpression: 'CreatedOn DESC'
        };
        const params = angular.merge({}, defaultParams, filters);

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/rent-programs/history`, { params });
    }

    getBillToDictionary(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/rent-programs/payers/dictionary`);
    }

    getPriceOptions(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/satisfied`, { params });
    }

    generateDictionaryBillTo(arr) {
        let result = [{
            Id: '1',
            Type: 'Patient',
            Name: 'Patient',
            PatientInsuranceId: null
        }];

        angular.forEach(arr, (item) => {
            if (item.Type !== 'Patient') {
                result.push({
                    Id: item.PatientInsuranceId,
                    Type: 'Payer',
                    Name: item.Name,
                    PatientInsuranceId: item.PatientInsuranceId,
                    PayerId: item.PayerId,
                    PayerPlan: item.PayerPlan,
                    isPrimary: item.isPrimary || item.PriorityOrderName === insurancePriorityConstants.PRIMARY_ID
                });
            }
        });

        return result;
    }

    getAuditData(id, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/rent/${id}/audit`, { params })
            .then((result) => result.data.Items);
    }

}
