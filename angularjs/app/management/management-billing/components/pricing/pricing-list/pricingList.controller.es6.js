export default class pricingListController {
    constructor($state, ngToast, infinityTableService, pricingService) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.pricingService = pricingService;

        this.cacheFiltersKey = 'management-pricing-list';

        this.filter = {};
        this.sortExpr = {};
        this.typeList = [];
        this.cycleList = [];
        this.hasCommonPricing = false;

        this.toolbarItems = [
            {
                text: "Add",
                icon: {
                    url: "assets/images/default/documents.svg",
                    w: 16,
                    h: 20
                },
                clickFunction: this.addCode.bind(this)
            },
            {
                text: "Import.csv",
                icon: {
                    url: "assets/images/default/upload-v2.svg",
                    w: 14,
                    h: 17
                }
            }
        ];

        this._activate();

        this.getPricingList = (pageIndex, pageSize) => {
            this.hasCommonPricing = true;
            angular.forEach(this.filter, (filterItem) => {
                if (filterItem) {
                    this.hasCommonPricing = false;
                }
            });
            return pricingService.getList(this.filter, this.sortExpr, pageIndex, pageSize)
                .then((response) => {
                    if (response.data.Items) {
                        angular.forEach(response.data.Items, (item) => item.hasCommonPricing = this.hasCommonPricing);
                    }
                    return response;
                });
        };
    }

    _activate() {
        this.pricingService.getPricingTypes()
            .then((response) => this.typeList = response.data.map((item) => item.Name));

        this.pricingService.getPricingCycles()
            .then((response) => this.cycleList = response.data.map((item) => item.Id));
    }

    getPayers(name) {
        return this.pricingService.getPayers(name);
    }

    addCode() {
        this.$state.go('root.management.billing.pricing.add');
    }

    editPricing(pricingId) {
        this.$state.go('root.management.billing.pricing.edit', { pricingId });
    }

    deletePricing(Id) {
        this.pricingService.deletePricing(Id)
            .then(_ => this.ngToast.success('Pricing record is deleted'))
            .finally(_ => this.infinityTableService.reload());
    }
}
