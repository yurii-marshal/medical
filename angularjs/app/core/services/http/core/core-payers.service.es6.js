export default class CorePayersService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getPayersPlans(payerId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/${ payerId }/plans`);
    }
}
