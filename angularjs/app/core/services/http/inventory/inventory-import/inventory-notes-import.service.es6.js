export default class InventoryNotesImportHttpService {
    constructor($http, WEB_API_SERVICE_URI, authService, Upload) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.authService = authService;
        this.Upload = Upload;
    }

    getImportStatus() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}inventory/notes/import/status`);
    }

    getImportLog(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}inventory/notes/import/${id}/logs?content-disposition=2`);
    }

    importCancel(id) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}/inventory/notes/import/${id}/cancel`);
    }

    importNotes(file) {
        const token = this.authService.getAccessToken();

        if (!file || !token) {
            return;
        }

        return this.Upload.upload({
            url: `${this.WEB_API_SERVICE_URI}inventory/notes/import`,
            data: { File: file },
            method: 'POST',
            headers: { Authorization: `Bearer${token}` }
        });
    }
}
