export default class AddDocumentModalCtrl {
    constructor($scope,
                $rootScope,
                $mdDialog,
                $state,
                ngToast,
                FileUploader,
                bsLoadingOverlayService,
                documentsService) {
        'ngInject';

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.FileUploader = FileUploader;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.documentsService = documentsService;

        this.uploader = undefined;
        this.patientId = $state.params.patientId;

        this.document = {
            documentType: undefined,
            notes: '',
            name: '',
            bytes: [],
            orders: []
        };

        this.uploadOptions = {
            removeAfterUpload: true,
            queueLimit: 1,
            method: 'POST'
        };

        this._getUploader();
    }

    getDocumentTypesDictionary(name) {
        return this.documentsService.getDocumentTypesDictionary(name)
            .then((response) =>  _.filter(response.data.Items, (item) => !item.IsCmn));
    }

    close() {
        this.$mdDialog.cancel();
    }

    upload() {
        if (this.addDocumentForm.$invalid) {
            touchedErrorFields(this.addDocumentForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.documentsService.addDocument(this.patientId, this.document)
            .then(() => {
                this.$rootScope.$broadcast('documentAdded');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    browseFiles() {
        angular.element('#fileUploader').trigger('click');
    }

    _onAfterAddingAll(val) {
        const fileReader = new FileReader();
        const $this = this;

        fileReader.onloadend = function() {
            $this.document.bytes = this.result;
            $this.document.name = val[0]._file.name;
            $this.$scope.$digest();
        };

        fileReader.readAsArrayBuffer(val[0]._file);
    }

    _onWhenAddingFileFailed(item, filter, options) {
        this.ngToast.danger(`Invalid file type. Selected file ''${item.name}'' 
                                has invalid type, must be:
                                 'docx, doc, rtf, ods, xml, xps, xls, xlsx, xla, xlsm, xlsb, 
                                 csv, ppt, txt, odt, pdf, jpg, jpeg, png'<br/>`);
    }

    _onErrorItem(fileItem, response, status, headers) {
        this.ngToast.danger("unexpected error happend while uploading files");
    }

    _getUploader() {
        let uploader = new this.FileUploader();

        uploader.filters.push({
            name: 'documentFilter',
            fn: function (item) {
                const validFilenameExtensions = ["docx", "doc", "rtf", "ods", "xml", "xps", "xls", "xlsx", "xla", "xlsm", "xlsb", "csv", "ppt", "txt", "odt", "pdf", "jpg", "jpeg", "png"];
                const currentExtention = item.name.slice(item.name.lastIndexOf(".") + 1).toLowerCase();
                return validFilenameExtensions.indexOf(currentExtention) !== -1;
            }
        });
        uploader.options = this.uploadOptions;

        uploader.onAfterAddingAll = this._onAfterAddingAll.bind(this);
        uploader.onWhenAddingFileFailed = this._onWhenAddingFileFailed.bind(this);
        uploader.onErrorItem = this._onErrorItem.bind(this);

        this.uploader = uploader;
    }

    _getOrders() {
        this.documentsService.getOrders(patientId)
            .then((response) => this.document.orders = response.data);
    }
}
