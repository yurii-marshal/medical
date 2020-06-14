export default class orderDocumentsService {
    constructor(ngToast, $http, $q, WEB_API_SERVICE_URI, fileService, authService) {
        'ngInject';

        this.ngToast = ngToast;
        this.$http = $http;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.fileService = fileService;
        this.authService = authService;
    }

    openOrderDocument(documentId, pagetitle) {
        const defer = this.$q.defer();

        // TODO test if AdBlock really detected by this function
        if (isAdBlockOn()) {
            this.ngToast.danger('The pop-up windows are blocked by one of your browser extensions.<br> Please disable it and reload page for further proceeding');
            defer.reject();
            return defer.promise;
        }

        const token = this.authService.getAccessToken();
        const xhr = new XMLHttpRequest();

        xhr.open('GET', `${this.WEB_API_SERVICE_URI}v1/documents/${ documentId }`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.responseType = 'blob';

        xhr.onload = () => {
            let type = xhr.response.type || 'application/pdf';
            let file = new Blob([xhr.response], { type });
            let fileURL = URL.createObjectURL(file);

            this.fileService.open(fileURL, pagetitle);
            defer.resolve();
        };
        xhr.onerror = () => defer.reject();

        xhr.send();
        return defer.promise;
    }

    getDocuments(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/documents`);
    }

    getPatientDocuments(patientId, filter, pageIndex = 0, pageSize = 100) {
        let params = { filter, pageIndex, pageSize };
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/documents/dictionary`, { params });
    }

    add(orderId, document) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/documents/upload`, {
            DocumentTypeId: document.documentType.Id,
            Description: document.notes,
            FileName: document.name,
            Bytes: this._getByteArray(document.bytes)
        });
    }

    assignDocuments(orderId, patientId, patientDocuments) {
        let PatientDocuments = _.map(patientDocuments, (doc) => doc.Id);

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${ patientId }/orders/${ orderId }/assign-documents`, { PatientDocuments });
    }

    _getByteArray(bytes) {
        let byteArray = [];
        let uint8Array = new Uint8Array(bytes);
        angular.forEach(uint8Array, (value) => {
            byteArray.push(value);
        });
        return byteArray;
    }
}
