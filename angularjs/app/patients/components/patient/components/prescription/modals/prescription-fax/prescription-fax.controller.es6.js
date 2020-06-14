export default class PrescriptionFaxCtrl {
    constructor($mdDialog, bsLoadingOverlayService, ngToast, actionFunc, params, showOptionsPopup) {
        'ngInject';
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.actionFunc = actionFunc;
        this.params = params;
        this.showOptionsPopup = showOptionsPopup;

        this.params.fax = this.params.fax || '';
    }

    back() {
        this.showOptionsPopup(this.params);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    send() {
        if (!this.actionsForm.$valid) {
            touchedErrorFields(this.actionsForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.actionFunc(this.params.fax)
            .then(() => {
                this.ngToast.success('Fax was sent to the Fax service.');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }
}
