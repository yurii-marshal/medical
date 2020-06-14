export default class inventoryProductsListController {
    constructor($state, ngToast, infinityTableService, inventoryProductsService){
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.inventoryProductsService = inventoryProductsService;

        this.sortExpr = {
            'Name': true
        };

        this.cacheFiltersKey = 'management-inventory-catalog';

        this.filter = {};
        this.statuses = [];
        this.getProductsList = this._getProductList.bind(this);
        this.activate();
    }

    activate() {
        this.inventoryProductsService.getStatuses().then((response) => {
            this.statuses = response.data;
        }, (err) => {});
    }

    _getProductList(pageIndex, pageSize) {
        return this.inventoryProductsService.getProductsList(this.filter, this.sortExpr, pageIndex, pageSize);
    }

    getHcpcsCodes(code, pageIndex) {
        return this.inventoryProductsService.getHcpcsCodes(code, pageIndex).then((res)=> res.data);
    }

    editProduct(productID) {
        this.$state.go('root.management.inventory.product_edit', { productId: productID });
    }

    deleteProduct(productId) {
        if(!productId) { return; }
        this.inventoryProductsService.deleteProductById(productId).then((_) => {
            this.ngToast.success("Product is deleted");
        }).finally(()=> {this.infinityTableService.reload();});
    }


}
