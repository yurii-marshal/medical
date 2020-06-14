export default class profileService {
    constructor($rootScope, ngToast, $q, $http, WEB_API_IDENTITY_URI, WEB_API_SERVICE_URI) {
        'ngInject';

        this.ngToast = ngToast;
        this.$q = $q;
        this.$http = $http;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;

        this.profile = {};
    }

    clearProfile() {
        this.profile = {};
    }

    getProfile() {
        return this.profile;
    }

    getPersonnelDictionaryPromise(fullName) {
        let params = {
            sortExpression: 'Name.FullName ASC',
            fullName
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel`, { params });
    }

    getPersonnelByIdPromise(id, isChachable) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnels/${id}`, { cache: isChachable });
    }

    getProfilePromise() {
        return this.$http.get(`${this.WEB_API_IDENTITY_URI}users/profile`)
            .then((response) => {
                this.profile = response.data;
                return response;
            });
    }

    putProfilePromise(profileModel) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/users/profile`, profileModel);
    }

    getBase64FromBuffer(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
}
