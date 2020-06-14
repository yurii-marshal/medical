export default class CoreDictionariesService {
    constructor( $http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getZipCodes(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}dictionaries/zip-codes`, { cache: true, params });
    }

    getContactTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/contact-types/dictionary`, { cache: true });
    }

    getReferralCards(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/dictionary`, { params });
    }

    getModifiers(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/modifiers/dictionary`, { params });
    }
}
