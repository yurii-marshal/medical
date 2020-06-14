export default class searchItemsDetailsModalController {
    constructor($mdDialog, $filter, bsLoadingOverlayService, searchItemsCatalogService, item, type) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.searchItemsCatalogService = searchItemsCatalogService;
        this.item = item;
        this.type = type;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: "modalOverlay" });

        const SEARCH_PRODUCTS = 'products_catalog';
        if (this.type === SEARCH_PRODUCTS) {
            this.searchItemsCatalogService.getItemDetails(this.item.Id)
                .then((response) =>  {
                    this.model = response.data;
                    this._mapHcpcsCodes();
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: "modalOverlay" }));
        }

    }

    _mapHcpcsCodes() {
        this.model.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(this.model);

        if (this.model.Components) {
            angular.forEach(this.model.Components, (component) => {
                component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
            });
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
