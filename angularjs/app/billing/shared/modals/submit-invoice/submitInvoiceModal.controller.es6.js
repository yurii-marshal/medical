export default class submitInvoiceModalController {
    constructor($mdDialog, isMultiple) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.isMupltiple = isMultiple;
    }

    save() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
