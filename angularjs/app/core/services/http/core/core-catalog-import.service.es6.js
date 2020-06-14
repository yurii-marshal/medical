export default class CoreCatalogImportService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    checkIfProductsExist(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}catalog/import/exists`, data);
    }

    addProductsFromManufactures(Ids) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}catalog/import`, { Ids });
    }
}
