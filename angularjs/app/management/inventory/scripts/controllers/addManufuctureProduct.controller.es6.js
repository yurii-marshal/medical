// updateProductsPromptModal
import updateProductsPromptModalTmpl from '../../modals/update-products-prompt/update-products-prompt.html'
import updateProductsPromptModalCtrl from '../../modals/update-products-prompt/update-products-prompt.es6';

export default class addManufactureProductController {
    constructor(
        $state,
        $mdDialog,
        coreCatalogImportService,
        ngToast,
        bsLoadingOverlayService
    ) {
        'ngInject';
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.coreCatalogImportService = coreCatalogImportService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.products = [];
        this.pageName = this.$state.params.pageTitle;
    }

    saveItems() {
        this.bsLoadingOverlayService.start({ referenceId: 'addProductManufacture' });
        this.coreCatalogImportService.checkIfProductsExist(this._getProductExistParams(this.products))
            .then((res) => {
                if (res.data.length) {
                    this.$mdDialog.show({
                        template: updateProductsPromptModalTmpl,
                        controller: updateProductsPromptModalCtrl,
                        controllerAs: '$ctrl',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        locals: {
                            productListSize: res.data.length
                        }
                    })
                    .then(() => {
                        this._addProducts('Products was updated');
                    });
                } else {
                    this._addProducts('Products was added');
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'addProductManufacture' }));
    }

    _productIds(products) {
        return products.map((item) => {
            if (item && item.Id) {
                return item.Id;
            }
        });
    }

    _getProductExistParams(products) {
        return {
            Products: products.map((item) => {
                return {
                    Manufacturer: item.Manufacturer,
                    PartNumber: item.PartNumber
                };
            })
        };
    }

    _addProducts(msg) {
        this.bsLoadingOverlayService.start({ referenceId: 'addProductManufacture' });
        this.coreCatalogImportService.addProductsFromManufactures(this._productIds(this.products))
            .then(() => {
                this.$state.go('root.management.inventory.products');
                this.ngToast.success(msg);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'addProductManufacture' }));
    }

    cancelItems() {
        this.$state.go('root.management.inventory.products');
    }
}
