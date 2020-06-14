import { importItemsTypeConstants } from '../../../../core/constants/core.constants.es6';
import importItemsModalController from '../../../../core/modals/import-items/import-items.controller.es6';
import importItemsModalTemplate from '../../../../core/modals/import-items/import-items.html';

export default class inventoryProductsController {
    constructor($state, $scope, $mdDialog, ngToast) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.isLoading = false;
        this.toolbarItems = [
            {
                text: "New Product",
                icon: {
                    url: "assets/images/default/inventory.svg",
                    w: 20,
                    h: 22
                },
                clickFunction: this.newProduct.bind(this)
            },
            {
                text: "Add Product",
                icon: {
                    url: "assets/images/default/inventory.svg",
                    w: 20,
                    h: 22
                },
                clickFunction: this.addProductFromManafucture.bind(this)
            },
            {
                text: "Print Labels",
                icon: {
                    url: "assets/images/default/documents.svg",
                    w: 16,
                    h: 20
                },
                clickFunction: this.printProductLabels.bind(this)
            },
            {
                text: "Learn Barcodes",
                icon: {
                    url: "assets/images/default/barcode.svg",
                    w: 20,
                    h: 22
                },
                clickFunction: this.learnBarcodes.bind(this)
            },
             {
             text: "Import",
             icon: {
             url: "assets/images/default/upload-v2.svg",
             w: 14,
             h: 17
             },
             clickFunction: this.importProducts.bind(this)
             }
        ];

        this.tabs = [
            {
                'number' : 1,
                'title' : 'Product List',
                'view' : 'root.management.inventory.products.list'
            },
            {
                'number' : 2,
                'title' : 'Product Lookups',
                'view' : 'root.management.inventory.products.lookups'
            }
        ];

        this.activate();

        $scope.$on('$stateChangeSuccess', () => {
            this.checkState();
        });


    }

    activate(){
        this.checkState();
    }

    checkState() {
        if (this.$state.is("root.management.inventory.products")) {
            this.$state.go("root.management.inventory.products.list");
        }
    }

    newProduct() {
        this.$state.go('root.management.inventory.product_new');
    }

    printProductLabels() {
        this.$state.go('root.product-labels');
    }

    learnBarcodes() {
        this.$state.go('root.learn_barcodes.add.step1');
    }

    addProductFromManafucture() {
        this.$state.go('root.add_manufacture_product');
    }

    importProducts() {
        if (this.isLoading) {
            this.ngToast.warning("Sorry, loading was already started");
            return false;
        }

        this.$mdDialog.show({
            controller: importItemsModalController,
            controllerAs: "$ctrl",
            template: importItemsModalTemplate,
            locals: {
                itemsType: importItemsTypeConstants.PRODUCTS_TYPE,
                isManagement: true
            }
        }).then((isSuccess) => {
            if (isSuccess) {
                this.ngToast.success('Import product(s) was processed.');
                this.$state.reload();
            }
        });
    }
}
