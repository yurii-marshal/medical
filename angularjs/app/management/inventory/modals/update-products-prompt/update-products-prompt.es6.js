export default class updateProductsPromptModalCtrl {
    constructor($mdDialog, $state, productListSize) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.productListSize = productListSize;
    }

    update() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
        this.$state.go('root.management.inventory.products');
    }
}
