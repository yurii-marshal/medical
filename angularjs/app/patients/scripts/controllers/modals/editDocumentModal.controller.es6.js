export default class editDocumentModalController {
    constructor($mdDialog, bsLoadingOverlayService, documentsService, document, save) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.documentsService = documentsService;
        this.saveFn = save;

        this.model = angular.copy(document);

        bsLoadingOverlayService.start({ referenceId: "modalOverlay" });
        documentsService.getDocumentById(document.Id)
            .then(response => {
                this.model.ExpiredDate = moment.utc(response.data.ExpiredDate).format('MM/DD/YYYY');
                this.model.IsCmn = response.data.IsCmn || false;
                this.model.DocumentType.IsCmn = response.data.IsCmn || false;
            })
            .finally(_ => bsLoadingOverlayService.stop({ referenceId: "modalOverlay" }));
    }

    getDocumentTypesDictionary(name) {
        return this.documentsService.getDocumentTypesDictionary(name)
            .then((response) =>  _.filter(response.data.Items, (item) => !item.IsCmn));
    }

    close() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.Form.$invalid) {
            touchedErrorFields(this.Form);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: "modalOverlay" });
        this.saveFn(this.model)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }
}

