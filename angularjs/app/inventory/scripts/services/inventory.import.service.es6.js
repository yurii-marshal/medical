export  default class inventoryImportService {
    constructor(WEB_API_SERVICE_URI, $http, authService, Upload) {
        'ngInject';
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.$http = $http;
        this.authService = authService;
        this.Upload = Upload;
    }

    getImportStatus() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}inventory/import/status`);
    }

    getImportLog(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}inventory/import/${id}/logs?content-disposition=2`);
    }

    importCancel(id) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}/inventory/import/${id}/cancel`);
    }

    importProducts(file) {
        const token = this.authService.getAccessToken();
        if(!file) { return; }
        if(!token){ return; }
        return this.Upload.upload({
            url: `${this.WEB_API_SERVICE_URI}inventory/import`,
            data: { File: file },
            method: 'POST',
            headers: {'Authorization': `Bearer${token}`}
        });
    }
}

