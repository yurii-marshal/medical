export default class UpsService {
    constructor(
        $http,
        WEB_API_UPS_URI,
        authService
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_UPS_URI = WEB_API_UPS_URI;
        this.authService = authService;
    }

    getTrackingDetails(trackingNumber) {
        const token = this.authService.getAccessToken();

        return this.$http({
            method: 'GET',
            url: `${this.WEB_API_UPS_URI}v1/tracking/${trackingNumber}/track`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
}
