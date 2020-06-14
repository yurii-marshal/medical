export default class UserPermissions {

    constructor(
        $http,
        WEB_API_IDENTITY_URI
        ) {
        'ngInject';

        this.$http = $http;

        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
    }

    isAllow(page, action) {
        const permissions = this.getPermissions();

        return permissions ? permissions[page] && (permissions[page].Permissions.indexOf(action) > -1) : false;
    }

    getPermissions() {
        return JSON.parse(localStorage.getItem('Permissions'));
    }

    initPermissions() {
        this.clearPermissions();
        return this.getPermissionsFromServer()
            .then((response) => {

                localStorage.setItem('Permissions', JSON.stringify(response.data));

                return response;
            });
    }

    getPermissionsFromServer() {
        return this.$http.get(`${this.WEB_API_IDENTITY_URI}users/permissions`);
    }

    clearPermissions() {
        localStorage.removeItem('Permissions');
    }
}

