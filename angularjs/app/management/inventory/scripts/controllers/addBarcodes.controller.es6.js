import updateAssociationModalController from './modals/updateAssociationModal.controller.es6';
import searchProductsModalController from './modals/searchProductsModal.controller.es6';
import template from '../../views/modals/update-association-modal.html';
export default class addBarcodesController {
    constructor($scope,
                $state,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                inventoryBarcodeService,
                inventoryProductsService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryBarcodeService = inventoryBarcodeService;
        this.inventoryProductsService = inventoryProductsService;

        this.barcodeId = '';
        this.productId = '';
        this.productName = '';
        this.selectedItems = [];
        this.partNumber = '';
        this.manufacturer = '';
        this.lastItem = undefined;
        this.productIdTrusted = false;

        this.activate();

        $scope.$on('$stateChangeSuccess', () => {
            this.checkState();
        });
    }

    activate() {
        this.checkState();
    }

    // click 'enter' on step1
    addBarcode() {
        this.$state.go('root.learn_barcodes.add.step2');
    }

    // click 'enter' on step2
    addProduct() {
        // check for full duplicates
        if (this._hasDuplicates()) {
            this.ngToast.warning('Such product/barcode pair already added.');
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'barcode-wizard' });
        this._checkProductId()
            .then((response) => {

                if (this.productIdTrusted) {
                    if (response && response.data) {
                        // if association was found
                        this.updateAssociation()
                            .then(() => {
                                // override association by adding to list
                                this._addPairToList();
                            }, () => {
                                // don't override
                                this._clearPair();
                            });
                    } else {
                        // no associations found, add to list
                        this._addPairToList();
                    }
                }
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'barcode-wizard' });
                this.productIdTrusted = false;
            });
    }

    _checkProductId() {
        // if this.productId was chosen from  search list
        if (this.productIdTrusted) {
            // check for others association
            return this.inventoryBarcodeService.checkAssociation(this.productId, this.barcodeId);
        }
            // check if such productId exist
        return this.inventoryProductsService.getProductsListFilteredById(this.productId)
                .then((response) => {
                    if (+response.data.Count === 0) {
                        this.ngToast.warning(`Product '${this.productId}' was not found.`);
                        this._clearPair();
                    } else {
                        this.productIdTrusted = true;
                        this.productName = response.data.Items[0].Name;
                        // check for others association
                        return this.inventoryBarcodeService.checkAssociation(this.productId, this.barcodeId);
                    }
                });

    }

    _hasDuplicates() {
        return _.find(this.selectedItems,
            (o) => {
                return o.productId === this.productId && o.barcodeId === this.barcodeId;
            }) !==
            undefined;
    }

    _addPairToList() {

        this.selectedItems = this.selectedItems.filter((item) => {
            return item.barcodeId.trim().toLocaleLowerCase() !== this.barcodeId.trim().toLocaleLowerCase();
        });

        this.selectedItems.push({
            productId: this.productId,
            productName: this.productName,
            barcodeId: this.barcodeId,
            partNumber: this.partNumber,
            manufacturer: this.manufacturer
        });
        this.lastItem = this.selectedItems[this.selectedItems.length - 1];
        this._clearPair();
    }

    _clearPair() {
        this.barcodeId = '';
        this.productId = '';
        this.productName = '';
        this.$state.go('root.learn_barcodes.add.step1');
    }

    searchProducts($event) {
        this.$mdDialog.show({
            templateUrl: 'management/inventory/views/modals/search-products-modal.html',
            targetEvent: $event,
            controller: searchProductsModalController,
            controllerAs: 'modal',
            parent: angular.element(document.body),
            locals: {},
            clickOutsideToClose: true
        }).then((product) => {
            this.productIdTrusted = true;
            this.productId = product.Id;
            this.productName = product.Name;
            this.partNumber = product.PartNumber;
            this.manufacturer = product.Manufacturer;
        });
    }

    updateAssociation() {
        return this.$mdDialog.show({
            template,
            controller: updateAssociationModalController,
            controllerAs: 'modal',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        });
    }

    reviewBarcodes() {
        if (this.selectedItems.length > 0) {
            this.inventoryBarcodeService.addToModel(this.selectedItems);
            this._clearPair();
            this.$state.go('root.learn_barcodes');
        }
    }

    checkState() {
        if (this.$state.is('root.learn_barcodes.add')) {
            this.$state.go('root.learn_barcodes.add.step1');
        }

        if (this.$state.is('root.learn_barcodes.add.step2') && this.barcodeId === '') {
            this.$state.go('root.learn_barcodes.add.step1');
        }
    }

}
