export default class autocompleteMultiselectFilterService {
    constructor(
        $http,
        WEB_API_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_URI = WEB_API_URI;
    }

    getData(url, params) {
        const requestUrl = this.WEB_API_URI + url.replace(/^\/api\//, '');

        return this.$http.get(`${requestUrl}`, { params });
    }
}
