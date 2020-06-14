export default class PatientPayerService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    deletePayerAuthorizations(ids) {
        const params = { Ids: ids };

        return this.$http.delete(
            `${this.WEB_API_SERVICE_URI}v1/patients/authorizations`,
            {
                data: params,
                headers: {
                    'Content-type': 'application/json;charset=utf-8'
                }
            });
    }
}
