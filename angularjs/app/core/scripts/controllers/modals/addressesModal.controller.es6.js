export default class addressesController {
    constructor($mdDialog, items) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.selectedAddress = null;
        this.availableAddresses = items;
    }

    ok() {
        if (this.isSelectedAddresses()) {
            this.$mdDialog.hide(this.availableAddresses);
        }
    }

    addressSelected(index, item) {
        item.Selected = true;
        item[index].Selected = true;
    }

    isSelectedAddresses() {
        let isAllSelected = true;
        angular.forEach(this.availableAddresses, (item) => {
            if (item.Selected !== true) {
                isAllSelected = false;
            }
        })
        return isAllSelected;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

}
