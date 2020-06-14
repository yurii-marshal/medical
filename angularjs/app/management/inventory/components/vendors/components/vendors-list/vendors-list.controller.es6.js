export default class vendorsListController {
    constructor(
        $state,
        $mdDialog,
        ngToast,
        inventoryVendorsHttpService,
        infinityTableService,
        infinityTableFilterService) {

        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.inventoryVendorsHttpService = inventoryVendorsHttpService;
        this.infinityTableService = infinityTableService;
        this.infinityTableFilterService = infinityTableFilterService;

        this.cacheFiltersKey = 'management-inventory-vendors';
        this.sortExpr = {
            Name: true
        };
        this.filters = {};

        this.getVendors = this._getVendors.bind(this);
    }

    _getVendors(pageIndex, pageSize) {

        if (this.sortExpr.Name === undefined) {
            this.sortExpr.Name = true;
        }

        const sortExpression = this.infinityTableFilterService.getSortExpressions(this.sortExpr);
        const filters = this.infinityTableFilterService.getFilters(this.filters);
        const params = Object.assign({}, filters, {
            SortExpression: sortExpression,
            PageIndex: pageIndex,
            PageSize: pageSize
        });

        return this.inventoryVendorsHttpService.getVendors(params)
            .then((response) => {
                response.data.Items.forEach((item) => {
                    if (item.Contacts) {
                        item.Contacts = item.Contacts.map((c) => ({ type: c.Type.Name, value: c.Value }));
                    }
                });
                return response;
            });
    }

    editVendor(vendorId) {
        this.$state.go('root.management.inventory.vendors.edit', { vendorId });
    }

    deleteVendor(vendorId) {
        this.inventoryVendorsHttpService.deleteVendor(vendorId)
            .then(() => this.ngToast.success('Vendor is deleted'))
            .finally(() => this.infinityTableService.reload());
    }
}
