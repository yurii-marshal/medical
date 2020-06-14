export default class billingImportModalController {
    constructor($mdDialog, ngToast, bsLoadingOverlayService, invoicesService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;

        this.uploadExtensionsStr = '.ara,.ARA';
        this.uploadFile = null;
    }

    save() {
        if (!this.modalForm.$valid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'importModal' });
        this.invoicesService.billingImport(this.uploadFile)
            .then(() => {
                this.ngToast.success('File was successfully imported');
                this.$mdDialog.hide(true);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'importModal' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
