export default class CoreReferralCardsService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getLocations(cardId, params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/${cardId}/locations`, { params });
    }

}
