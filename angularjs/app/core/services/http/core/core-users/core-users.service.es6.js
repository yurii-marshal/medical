export default class CoreUsersService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        WEB_API_IDENTITY_URI,
        Upload,
        authService
    ) {
        'ngInject';

        this.authService = authService;
        this.Upload = Upload;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
    }

    sendToHelpdesc(data) {

        const token = this.authService.getAccessToken();

        if (!token) {
            return;
        }

        return this.Upload.upload({
            url: `${this.WEB_API_SERVICE_URI}v1/users/helpdesk`,
            data: data,
            method: 'POST',
            headers: { 'Authorization': `Bearer${token}` }
        });
    }

    getUsersDictionary(params) {
        return this.$http.get(`${this.WEB_API_IDENTITY_URI}users/dictionary`, { params });
    }
}
