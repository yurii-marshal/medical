export default class orderWizardStep6Controller {
    constructor($scope, ngToast, orderWizardService, FileUploader) {
        'ngInject';

        this.$scope = $scope;
        this.ngToast = ngToast;
        this.orderWizardService = orderWizardService;
        this.FileUploader = new FileUploader();

        this.model = orderWizardService.getModel();
        this.selectedDocument = undefined;

        this.uploadOptions = {
            removeAfterUpload: true,
            queueLimit: 1,
            method: 'POST'
        };

        this._getUploader();
    }

    _getUploader() {
        this.FileUploader.filters.push({
            name: 'documentFilter',
            fn: (item) => {
                const validFilenameExtensions = ['jpg', 'png', 'jpeg', 'pdf'];
                const currentExtention = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();

                return validFilenameExtensions.indexOf(currentExtention) !== -1;
            }
        });
        this.FileUploader.options = this.uploadOptions;

        this.FileUploader.onAfterAddingAll = this.onAfterAddingAll.bind(this);
        this.FileUploader.onWhenAddingFileFailed = this.onWhenAddingFileFailed;
        this.FileUploader.onErrorItem = this.onErrorItem;

        this.uploader = this.FileUploader;
    }

    getPatientDocuments(name) {
        return this.orderWizardService.getPatientDocuments(this.model.patient.Id, name)
            .then((response) => response.data.Items);
    }

    getDocumentTypes(name) {
        return this.orderWizardService.getDocumentTypes(name)
            .then((response) => response.data.Items);
    }

    addPatientDocument() {

        if (this.selectedDocument) {
            const existingDocument = _.find(this.model.patientDocuments, (document) => {
                return document.DocumentId === this.selectedDocument.Id;
            });

            if (!existingDocument) {

                this.selectedDocument.DocumentId = this.selectedDocument.Id;
                delete this.selectedDocument.Id;

                this.model.patientDocuments.push(this.selectedDocument);
                this.searchDocument = '';
            }
        }
    }

    upload() {
        angular.element('#fileUploader').trigger('click');
    }

    deleteUploadedDocument(index) {
        this.model.uploadedDocuments.splice(index, 1);
    }

    deletePatientDocument(index) {

        if (this.model.patientDocuments[index].Id) {
            this.model.removeDocuments.push(this.model.patientDocuments[index].Id);
        }

        this.model.patientDocuments.splice(index, 1);
    }

    onAfterAddingAll(val) {
        let fileReader = new FileReader();
        let $this = this;

        fileReader.onloadend = function() {
            $this.model.uploadedDocuments.push({
                name: val[0]._file.name,
                bytes: this.result, // /how to handle this ??
                documentType: undefined
            });
            $this.$scope.$digest();
        };

        fileReader.readAsArrayBuffer(val[0]._file);
    }

    onWhenAddingFileFailed(item, filter, options) {
        this.ngToast.danger(`Invalid file type. 
                        Selected file ${item.name} has invalid type, must be: 
                        '.jpeg;.jpg;.png;.pdf'<br/>`);
    }

    onErrorItem(item, response, status, headers) {
        this.ngToast.danger('unexpected error happened while uploading files');
    }


}
