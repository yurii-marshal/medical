export default class searchItemsDetailsModalController {
    constructor($mdDialog, $filter, bsLoadingOverlayService, searchItemsService, item, type) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.searchItemsService = searchItemsService;
        this.item = item;
        this.type = type;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: "modalOverlay" });

        const SEARCH_PRODUCTS = 'products';
        const SEARCH_EQUIPMENT = 'equipment';

        if (this.type === SEARCH_PRODUCTS) {
            this.searchItemsService.getItemDetails(this.item.Id)
                .then((response) =>  {
                    this.model = response.data;
                    this._mapHcpcsCodes();
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: "modalOverlay" }));
        }

        if (this.type === SEARCH_EQUIPMENT) {
            this.searchItemsService.getEquipmentDetails(this.item.Id)
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
