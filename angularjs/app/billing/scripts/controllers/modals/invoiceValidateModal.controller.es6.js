export default class invoiceValidateModalController {
    constructor( $mdDialog, invoiceId, saveFn, updateFn, isValidationFailed ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.invoiceId = invoiceId;
        this.save = saveFn;
        this.update = updateFn;
        this.isValidationFailed = isValidationFailed;
    }

    updateInvoice() {
        this.update();
        this.$mdDialog.hide();
    }

    saveInvoice() {
        this.save();
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}

