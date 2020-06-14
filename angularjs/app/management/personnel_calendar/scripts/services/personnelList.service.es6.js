export default class personnelListService {
    constructor(
        $http,
        WEB_API_IDENTITY_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
    }

    getAllRoles() {
        return this.$http.get(`${this.WEB_API_IDENTITY_URI}roles/dictionary`);
    }

    getRolesByUserId(Id) {
        return this.$http.get(`${this.WEB_API_IDENTITY_URI}users/${Id}/roles`);
    }
}
