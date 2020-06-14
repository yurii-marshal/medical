export default class closeInvoiceModalController {
    constructor($rootScope, $mdDialog, ngToast, bsLoadingOverlayService, invoicesService, invoiceId, displayId) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.invoiceId = invoiceId;
        this.displayId = displayId;
    }

    save() {
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.invoicesService.closeInvoice(this.invoiceId)
            .then(() => {
                this.ngToast.success('Invoice status was changed to Closed');
                this.$mdDialog.hide();
                this.$rootScope.$broadcast('reloadInvoiceInfo');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
        this.$rootScope.$broadcast('reloadInvoiceInfo');
    }
}