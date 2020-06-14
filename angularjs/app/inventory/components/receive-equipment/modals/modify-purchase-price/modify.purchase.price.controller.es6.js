export default class modifyPurchasePriceController {
    constructor($mdDialog, purchasePrice) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.purchasePrice = angular.copy(purchasePrice);

    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.purchasePriceForm.$invalid) {
            touchedErrorFields(this.purchasePriceForm);
            return;
        }
        this.$mdDialog.hide(this.purchasePrice);
    }
}
