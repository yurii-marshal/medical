export default class searchProductsModalController {
    constructor($scope, $mdDialog, $timeout, bsLoadingOverlayService, inventoryProductsService) {
        'ngInject';
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryProductsService = inventoryProductsService;

        this.filtersObj = {
            Id: undefined,
            Name: undefined,
            Manufacturer: undefined,
            HcpcsCode: undefined
        };

        this.sortExpr = {
            Name: true
        };

        this.productList = [];
        this.statuses = [];
        this.selectedProduct = undefined;
        this.pageIndex = 0;
        this.showMoreButton = true;
        this.pageSize = 10;

        this.getProducts = this._getProducts.bind(this);

        $scope.$watch( () => this.filtersObj, () => {
            this.pageIndex = 0;
            this._getProducts(true);
        }, true);

        $timeout( () => $('md-dialog').animate( { scrollTop: 0 }, 200), 600);
    }

    _getProducts(isNeedReset) {

        this.bsLoadingOverlayService.start({ referenceId: 'searchProduct' });
        return this.inventoryProductsService.getProductsList(this.filtersObj, this.sortExpr, this.pageIndex, this.pageSize)
            .then( (response) => {

                if (isNeedReset) {
                    this.productList = [];
                }

                this.productList = this.productList.concat(response.data.Items);

                this.showMoreButton = response.data.Items.length === this.pageSize;

            }).finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'searchProduct' }));
    }

    showMore() {
        this.pageIndex++;
        this._getProducts(false);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    ok() {
        this.$mdDialog.hide({
            Id: this.selectedProduct.Id,
            Name: this.selectedProduct.Name,
            PartNumber: this.selectedProduct.PartNumber,
            Manufacturer: this.selectedProduct.Manufacturer
        });
    }

    clearFilters() {
        this.filtersObj = {
            Id: undefined,
            Name: undefined,
            Manufacturer: undefined,
            HcpcsCode: undefined
        };
    }

    getHcpcsCodes(code) {
        return this.inventoryProductsService.getHcpcsCodes(code).then((response) => response.data.Items);
    }
}
