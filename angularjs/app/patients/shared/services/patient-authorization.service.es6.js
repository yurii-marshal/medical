export default class patientAuthorizationService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getHcpcsCodes(code) {
        let params = { code };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }

    getHistoryList(patientId, statusId) {
        let params = {
            sortExpression: 'CreatedDate DESC',
            status: statusId
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/authorizations/history`, { params })
            .then((response) => {
                response.data.Items.map((item) => item.StatusClass = this._getStatusClass(item.Status.Id));
                return response;
            });
    }

    getList(patientId, statusId) {
        let params = {
            sortExpression: 'CreatedDate DESC',
            status: statusId
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/authorizations`, { params })
            .then((response) => {
                response.data.Items.map((item) => item.StatusClass = this._getStatusClass(item.Status.Id));
                return response;
            });
    }

    getById(patientId, Id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/authorizations/${Id}`);
    }

    deleteById(patientId, Id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/authorizations/${Id}`);
    }

    save(patientId, model) {
        if (model.Id) {
            return this.$http.put(`${this.WEB_API_SERVICE_URI }v1/patients/${patientId}/authorizations/${model.Id}`, getEditModel(model));
        }
        return this.$http.post(`${this.WEB_API_SERVICE_URI }v1/patients/${patientId}/authorizations`, getEditModel(model));


        function getEditModel(model) {
            let newModel = {
                AuthNumber: model.AuthNumber,
                PriceOption: model.PriceOption && model.PriceOption.Id,
                PayerId: model.Payer.Id,
                Hcpcs: model.Hcpcs,
                Units: model.Units || '',
                Amount: model.Amount || '',
                FromDate: model.From ? moment.utc(model.From, 'MM/DD/YYYY').format('YYYY-MM-DD') : '',
                ToDate: model.To ? moment.utc(model.To, 'MM/DD/YYYY').format('YYYY-MM-DD') : '',
                Modifiers: {},
                Notes: model.Notes
            };

            angular.forEach(model.Modifiers, (value, key) => {
                if (value) {
                    newModel.Modifiers[key] = value.Id;
                }
            });

            if (_.isEmpty(newModel.Modifiers)) {
                delete newModel.Modifiers;
            }

            return newModel;
        }
    }

    getDictionary(patientId, searchStr, payerId) {
        let params = { authNumber: searchStr };

        if (payerId) {
            params.payerId = payerId;
        }
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/authorizations/dictionary`, { params });
    }

    getPriceOptionsDictionary() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/authorizations/priceoptions/dictionary`);
    }

    _getStatusClass(authorizationStatusId) {
        switch (authorizationStatusId.toString()) {
            case '0': // new
            case '1': // active
                return 'green';
            case '2': // expired
                return 'orange';
            case '3': // renew
                return 'blue';
            default:
                break;
        }
    }
}
