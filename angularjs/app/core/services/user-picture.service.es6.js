export default class UserPicture {

    constructor(
        $http,
        WEB_API_IDENTITY_URI,
        authService
    ) {
        'ngInject';

        this.$http = $http;

        this.authService = authService;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
    }

    getUserAvatarImgUrl(userId) {
        return `${ this.WEB_API_IDENTITY_URI }users/${ userId }/picture?access_token=${ this.authService.getAccessToken() }&tmp=${ +new Date() }`;
    }
}

