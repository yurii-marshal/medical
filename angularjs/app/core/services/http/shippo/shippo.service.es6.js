export default class ShippoService {
    constructor(
        $http,
        WEB_API_SHIPPO_URI,
        authService
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SHIPPO_URI = WEB_API_SHIPPO_URI;
        this.authService = authService;
    }

    getTrackingDetails(trackingNumber, carrier) {
        const token = this.authService.getAccessToken();

        return this.$http({
            method: 'GET',
            url: `${this.WEB_API_SHIPPO_URI}v1/tracks/${ carrier }/${ trackingNumber }`,
            // url: `${this.WEB_API_SHIPPO_URI}v1/tracks/shippo/SHIPPO_DELIVERED`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
}
