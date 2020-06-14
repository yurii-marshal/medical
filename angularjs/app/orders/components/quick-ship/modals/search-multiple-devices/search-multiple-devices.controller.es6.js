export default class SearchMultipleDevicesModalCtrl {
    constructor(
        $mdDialog,
        ngToast,
        inventoryEquipmentHttpService,
        quickShipService,
        bsLoadingOverlayService,
        params
    ) {
        'ngInject';

        this.inventoryEquipmentHttpService = inventoryEquipmentHttpService;
        this.quickShipService = quickShipService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;

        this.selectedCount = 0;

        this.locationProductsCounter = params.locationProductsCounter;
        this.chosenLocation = params.chosenLocation;
        this.countInOrder = params.countInOrder;

        this.getAvailableLocationCount = (item) => this.quickShipService.getAvailableLocationCount(
            item,
            params.locationProductsCounter
        )

        this._activate(params);
    }

    _activate(params) {
        if (params.searchItems) {
            this.searchState = _.merge({}, this.setSelectedCount(params.searchItems));
            this.isCurrentLocationAvailable();
        } else {
            this.bsLoadingOverlayService.start({ referenceId: 'searchMultipleDevicesModal' });

            this.inventoryEquipmentHttpService.searchEquipment(params.requestParam)
                .then((response) => {
                    this.searchState = this.setSelectedCount(response);
                    this.isCurrentLocationAvailable();
                    this.bsLoadingOverlayService.stop({ referenceId: 'searchMultipleDevicesModal' });
                });
        }

        this.onCalcSelectedItems();
    }

    isCurrentLocationAvailable() {
        if (this.chosenLocation) {

            let itemVisible = false;

            this.searchState.items.allIds.forEach((itemId) => {
                if ( this.searchState.items.byId[itemId].locationId === this.chosenLocation ) {
                    if (this.getAvailableLocationCount(this.searchState.items.byId[itemId]) > 0) {
                        itemVisible = true;
                    }
                }
            });

            if (!itemVisible) {
                this.ngToast.warning(`No items available at selected location, please select other location from list`);
            }
        }

    }

    onResetSelectedData() {
        this.searchState.items.allIds.forEach((itemId) => {
            this.searchState.items.byId[itemId].selectCount = null;
            this.selectedCount = 0;
        });
    }

    onCalcSelectedItems() {
        this.selectedCount = 0;

        this.searchState.items.allIds.forEach((itemId) => {
            const selectCount = parseInt(this.searchState.items.byId[itemId].selectCount);

            if (!isNaN(selectCount)) {
                this.selectedCount += parseInt(this.searchState.items.byId[itemId].selectCount);
            }
        });
    }

    setSelectedCount(state) {
        let stateCopy = angular.copy(state);

        let isSomeItemsSelected = stateCopy.items.allIds.reduce((acc, itemId) => {
            if (this.locationProductsCounter.byId[itemId] &&
                this.locationProductsCounter.byId[itemId].tempCount) {

                acc = true;
            }
            return acc;
        }, false);

        stateCopy.items.allIds.forEach((itemId) => {
            const locationProductsCounter = this.locationProductsCounter.byId[itemId];
            let preselectedCount = null;

            if (locationProductsCounter) {
                preselectedCount = !isSomeItemsSelected ?
                                   locationProductsCounter.tempCount || locationProductsCounter.prefilledCount || null :
                                   locationProductsCounter.tempCount || null;
            }

            stateCopy.items.byId[itemId].selectCount = preselectedCount;
        });

        return stateCopy;
    }

    updateCount(state) {
        let stateCopy = angular.copy(state);

        stateCopy.items.allIds.forEach((itemId) => {
            if (stateCopy.items.byId[itemId].selectCount) {
                stateCopy.items.byId[itemId].count = stateCopy.items.byId[itemId].selectCount;
                stateCopy.items.byId[itemId].isSelected = true;
                delete stateCopy.items.byId[itemId].selectCount;
            }
        });

        return stateCopy;
    }

    onSave() {
        // Update count from selected count and set isSelected flag
        this.searchState = this.updateCount(this.searchState);

        const selectedItemsState = {
            items: {
                allIds: [],
                byId: {}
            },
            components: {
                allIds: [],
                byId: {}
            },
            nextKey: {},
            status: {}
        };

        this.searchState.items.allIds.forEach((itemId) => {
            if (this.searchState.items.byId[itemId].isSelected) {
                selectedItemsState.items.allIds.push(itemId);
                selectedItemsState.items.byId[itemId] = this.searchState.items.byId[itemId];

                if (this.searchState.items.byId[itemId].componentsIds) {
                    this.searchState.items.byId[itemId].componentsIds.forEach((componentId) => {
                        selectedItemsState.components.byId[componentId] = this.searchState.components.byId[componentId];
                    });

                    selectedItemsState.components.allIds = [...new Set(selectedItemsState.components.allIds.concat(this.searchState.items.byId[itemId].componentsIds))];

                }
            }
        });

        selectedItemsState.status = this.searchState.status;
        selectedItemsState.nextKey = this.searchState.nextKey;

        this.$mdDialog.hide(selectedItemsState);
    }

    onCancel() {
        this.$mdDialog.cancel();
    }
}
