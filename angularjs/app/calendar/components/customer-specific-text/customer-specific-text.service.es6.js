export default class customerSpecificService {
    constructor($http, WEB_API_SERVICE_URI){
        'ngInject';

        //Init Services
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getSpecificList() {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/organization/agreements');
    }

}
