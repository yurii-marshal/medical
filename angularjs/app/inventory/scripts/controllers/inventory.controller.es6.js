import { importItemsTypeConstants } from '../../../core/constants/core.constants.es6';
import importItemsModalController from '../../../core/modals/import-items/import-items.controller.es6';
import importItemsModalTemplate from '../../../core/modals/import-items/import-items.html';

export default class inventoryController {
    constructor($scope, $state, $mdDialog, ngToast) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.isLoading = false;
        this.toolbarItems = [
            {
                text: 'Receive Items',
                icon: {
                    url: 'assets/images/default/inventory.svg',
                    w: 20,
                    h: 22
                },
                clickFunction: this._goReceiveEquipment.bind(this)
            },
            {
                text: 'Transfer Items',
                icon: {
                    url: 'assets/images/default/arrow-back.svg',
                    w: 18,
                    h: 15
                },
                clickFunction: this._goTransferEquipment.bind(this)
            },
            {
                text: 'Import',
                icon: {
                    url: 'assets/images/default/upload-v2.svg',
                    w: 14,
                    h: 17
                },
                clickFunction: this.importProducts.bind(this)
            }
        ];

        $scope.$on('$stateChangeSuccess', () => this._checkState());

        this._checkState();
    }

    _checkState() {
        if (this.$state.is('root.inventory')) {
            this.$state.go('root.inventory.list');
        }
    }

    _goReceiveEquipment() {
        this.$state.go('root.receive_equipment.add.step1');
    }

    _goTransferEquipment() {
        this.$state.go('root.transfer_equipment.add.step1');
    }

    importProducts() {
        if (this.isLoading) {
            this.ngToast.warning('Sorry, loading was already started');
            return false;
        }

        this.$mdDialog.show({
            controller: importItemsModalController,
            controllerAs: '$ctrl',
            template: importItemsModalTemplate,
            locals: {
                itemsType: importItemsTypeConstants.PRODUCTS_TYPE,
                isManagement: false
            }

        }).then((isSuccess) => {
            if (isSuccess) {
                this.ngToast.success('Import product(s) was processed.');
                this.isLoading = true;
                this.$state.reload();
            }
        });
    }
}
