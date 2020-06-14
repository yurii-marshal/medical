export default class selectProductDialogController {
    constructor($mdDialog, transferEquipmentService, productList) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.productList = productList;

        angular.forEach(this.productList, item => {
            switch (item.Status.Name) {
                case 'Active':
                    item.statusClass = "green";
                    break;
                case 'Retired':
                    item.statusClass = "dark-blue";
                    break;
                default:
                    item.statusClass = "gray";
                    break;
            }
        });
        this.selectedItem = undefined;
    }

    cancel () {
        this.$mdDialog.cancel();
    }

    save() {
        this.$mdDialog.hide(this.selectedItem);
    }
}
