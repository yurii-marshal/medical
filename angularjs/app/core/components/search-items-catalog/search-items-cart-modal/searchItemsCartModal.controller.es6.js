class searchItemsCartModalController {
    constructor($mdDialog, $filter, $state, items) {
        'ngInject';
        this.$mdDialog = $mdDialog;
        this.items = items;
        this.isCompleteWizard = $state.current.name === "root.completeOrder.step1.add";

        this.items.forEach((item) => {
            item.allHcpcsCodes = $filter('hcpcsCodesToArr')(item);
        });
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    delete(item) {
        if (item.isAny && item.HcpcsCode) {
            _.remove(this.items, model => model.isAny && model.HcpcsCode.Id == item.HcpcsCode.Id);
        }

        if (item.Id || item.ProductId) {
            _.remove(this.items, model => (model.Id || model.ProductId) == (item.Id || item.ProductId));
        }
    }
}

angular.module('app.core')
    .controller('searchItemsCartModalController', searchItemsCartModalController);
