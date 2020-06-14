export default class productsDialogController {
    constructor($mdDialog,
                $timeout,
                $scope,
                $state,
                bsLoadingOverlayService,
                receiveEquipmentService,
                inventoryEquipmentService,
                transferEquipmentService,
                excludeLocation,
                productType) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.receiveEquipmentService = receiveEquipmentService;
        this.transferEquipmentService = transferEquipmentService;
        this.inventoryEquipmentService = inventoryEquipmentService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.excludeLocation = excludeLocation;
        this.productType = productType;

        this.filtersObj = {
            Id: undefined,
            Name: undefined,
            Manufacturer: undefined,
            HcpcsCode: undefined,
            LocationId: this.excludeLocation && this.excludeLocation.Id
                ? [this.excludeLocation.Id]
                : undefined
        };

        this.sortExpr = {
            Name: true
        };

        this.pageIndex = 0;
        this.locationsList = [];
        this.selectedProduct = undefined;
        this.showMoreButton = true;
        this.pageSize = 10;

        $timeout(() => $('md-dialog').animate({ scrollTop: 0 }, 200), 600);

        $scope.$watch(() => this.filtersObj, (newVal, oldVal) => {
            if (!_.isEqual(newVal, oldVal)) {
                this.pageIndex = 0;
                const needToCleanList = true;

                this.getProducts(needToCleanList);
            }
        }, true);
    }

    getProducts(needToCleanList) {
        this.bsLoadingOverlayService.start({ referenceId: 'searchProduct' });
        return this.receiveEquipmentService.getProducts(this.filtersObj, this.sortExpr, this.pageIndex, this.pageSize, this.productType)
            .then((response) => {
                if (needToCleanList) {
                    this.productsList = [];
                }
                this.productsList = this.productsList.concat(response.data.Items);
                this.showMoreButton = response.data.Items.length === this.pageSize;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'searchProduct' }));
    }

    getHcpcsCodes(code) {
        return this.inventoryEquipmentService.getHcpcsCodes(code)
            .then((response) => response.data.Items);
    }

    showMore() {
        this.pageIndex++;
        this.getProducts();
    }

    clearFilters() {
        this.filtersObj = {
            Id: undefined,
            Name: undefined,
            Manufacturer: undefined,
            PrimaryHcpcsCode: undefined
        };
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        let _product = this.selectedProduct;

        _product.barcode = this.selectedProduct.Id;
        this.$mdDialog.hide(_product);
    }
}
