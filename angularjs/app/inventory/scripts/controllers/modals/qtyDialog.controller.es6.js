export default class qtyDialogController {
    constructor($mdDialog, $timeout, currentQty, maxQty, needMaxQtyValidation, product) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.currentQty = currentQty || 1;
        this.maxQty = maxQty;
        this.needMaxQtyValidation = needMaxQtyValidation;
        this.product = product || '';
    }

    qtyChanged() {
        let isValid = this.currentQty <= this.maxQty;
        if (!isValid) {
            this.editQtyForm.product_qty.$setTouched();
        } else {
            this.editQtyForm.product_qty.$setUntouched();
        }

        this.$timeout(() => this.editQtyForm.product_qty.$setValidity('max', isValid));
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.editQtyForm.$invalid) {
            touchedErrorFields(this.editQtyForm);
            return;
        }
        this.$mdDialog.hide(this.currentQty);
    }
}
