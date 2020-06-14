import actions from '../../actions/quick-ship.actions.es6.js';
import { normalizeEquipmentLocationsData } from '../../../../../core/services/http/inventory/inventory-locations/get-equipment-locations.normalization.es6';
import { searchEquipmentStatusConstants } from '../../../../../core/constants/order.constants.es6';
import { storeTypeIdsConstants } from '../../../../../core/constants/inventory.constants.es6';
import { lookupProperties } from '../../quick-ship.config.es6';

import searchMultipleDevicesTemplate from '../../modals/search-multiple-devices/search-multiple-devices-modal.html';
import SearchMultipleDevicesModalCtrl from '../../modals/search-multiple-devices/search-multiple-devices.controller.es6';

export default class QuickShipInventoryPickCtrl {
    constructor($q,
                $scope,
                $state,
                ngToast,
                $ngRedux,
                $mdDialog,
                quickShipService,
                bsLoadingOverlayService) {
        'ngInject';

        this.$q = $q;
        this.$ngRedux = $ngRedux;
        this.$state = $state;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.quickShipService = quickShipService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.searchEquipmentStatusConstants = searchEquipmentStatusConstants;
        this.lookupProperties = lookupProperties;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);

        $scope.$on('$destroy', unsubscribe);

        this.locationTypeIds = [
            storeTypeIdsConstants.WAREHOUSE_ID,
            storeTypeIdsConstants.TEAM_MEMBER_ID
        ];

        /**
         * Reset temporary picked items and them counters
         */
        this.$ngRedux.dispatch(actions.resetAllTempCounts());
        this.$ngRedux.dispatch(actions.resetPickedItems());
    }

    mapStateToThis(state) {
        return {
            shipItems: state.quickShip.shipItems,
            pickedItems: state.quickShip.pickedItems,
            linkedItems: state.quickShip.linkedItems,
            currentProduct: state.quickShip.currentProduct,
            locationProductsCounter: state.quickShip.locationProductsCounter,
            inventory: state.quickShip.inventory
        };
    }

    onLocationEnter() {
        if (!this.currentProduct.locationFrom.uniqueId) {

            this.$ngRedux.dispatch(actions.setAnyLocationFrom(true));
            this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.PRODUCT_ID.id));
            this.searchProductByProductId();

        } else {
            this.searchLocationById();
        }
    }

    // search location FROM in modal window
    openSearchLocationModal(event) {
        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/location-dialog/search-locations-modal.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: 'locationDialogController as modal',
            locals: {
                inventoryAction: 'transfer',
                isAnyLocation: false,
                locationTypeId: this.locationTypeIds,
                storeIds: this.currentProduct.storeIds
            }
        })
        // search location
            .then((data) => {
                const result = normalizeEquipmentLocationsData({ data: { Items: [data] } }),
                    location = result.allIds.length ? result.byId[result.allIds[0]] : null;

                if (!location || !location.id) {
                    this.$ngRedux.dispatch(actions.setAnyLocationFrom(true));
                } else {
                    this.$ngRedux.dispatch(actions.setLocationFrom({
                        id: location.id,
                        uniqueId: location.uniqueId,
                        displayName: location.displayName
                    }));
                }

                this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.PRODUCT_ID.id));
                this.searchProductByProductId();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inventory-pick' }));
    }

    // search location by Id and apply it
    searchLocationById() {
        this.bsLoadingOverlayService.start({ referenceId: 'inventory-pick' });
        this.quickShipService.getLocationById(this.currentProduct.locationFrom.uniqueId)
            .then((response) => {
                if (response.allIds.length < 1) {

                    this.ngToast.warning(`Location by ID '${this.currentProduct.locationFrom.uniqueId}' was not found.`);
                    this.$ngRedux.dispatch(actions.resetLocationFrom());

                } else if (response.allIds.length === 1) {
                    const location = response.byId[response.allIds[0]];

                    this.$ngRedux.dispatch(actions.setLocationFrom({
                        id: location.id,
                        uniqueId: location.uniqueId,
                        displayName: location.displayName
                    }));

                    this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.PRODUCT_ID.id));
                    this.searchProductByProductId();
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inventory-pick' }));
    }

    searchProductByProductId() {
        if (this.currentProduct.lookupProperty === this.lookupProperties.PRODUCT_ID.id) {
            this.$ngRedux.dispatch(actions.setBarcodeProperty(this.currentProduct.productId));
        }

        this.bsLoadingOverlayService.start({ referenceId: 'inventory-pick' });
        return this.quickShipService.getProductByCodes(this.currentProduct)
            .then((response) => {

                const nextKeyProperty = response.nextKey || null;

                switch (response.status.id) {
                    case searchEquipmentStatusConstants.FOUND_ID:
                        this.$ngRedux.dispatch(actions.setStatusProperty(response.status.id));

                        const nonselectedCount = this._countOfNonselected(response);

                        if ((nonselectedCount.counter === 1) && !nonselectedCount.tmpCounter) {

                            const lastItem = nonselectedCount.lastItem;

                            this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.LOCATION.id));
                            this.$ngRedux.dispatch(actions.setBarcodeProperty(''));

                            this.$ngRedux.dispatch(actions.addSeparatedPickedItem(lastItem));

                        } else if (nonselectedCount.tmpCounter || (nonselectedCount.counter === 0)) {
                            this._showWarningMsg();

                            this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.LOCATION.id));
                            this.$ngRedux.dispatch(actions.setBarcodeProperty(''));
                            this.$ngRedux.dispatch(actions.clearProcessingItem());

                        } else {
                            this.openSelectProductModal(response);
                        }

                        break;

                    case searchEquipmentStatusConstants.NOT_FOUND_ID:

                        if (this.currentProduct.lookupProperty === lookupProperties.SERIAL_NUMBER.id ||
                            this.currentProduct.lookupProperty === lookupProperties.LOT_NUMBER.id) {

                            this.ngToast.warning(`No Devices were found with this  
                            ${lookupProperties[this.currentProduct.lookupProperty].name}
                            ${this.currentProduct.locationFrom.id ? ' in selected location' : ''}`);

                            this.$ngRedux.dispatch(actions.setBarcodeProperty(''));
                            // don't update status here before next search
                        } else if (this.currentProduct.lookupProperty === lookupProperties.PRODUCT_ID.id) {

                            this.$ngRedux.dispatch(actions.setBarcodeProperty(''));
                            this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.LOCATION.id));
                            this.$ngRedux.dispatch(actions.clearProcessingItem());
                            this.$ngRedux.dispatch(actions.setStatusProperty(response.status.id));

                            this.ngToast.warning(`No Devices were found in selected location`);
                        }

                        break;

                    case searchEquipmentStatusConstants.NOT_DETERMINED_ID:
                        this.$ngRedux.dispatch(actions.updateProcessingItem(response));

                        this.$ngRedux.dispatch(actions.setLookupProperty(nextKeyProperty));
                        this.$ngRedux.dispatch(actions.setNextKeyProperty(nextKeyProperty));
                        this.$ngRedux.dispatch(actions.setStatusProperty(response.status.id));
                        this.$ngRedux.dispatch(actions.setBarcodeProperty(''));

                        this.$ngRedux.dispatch(actions.determineActiveProperty({
                            lookupProperty: this.currentProduct.lookupProperty
                        }));

                        break;

                    default:
                        break;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'inventory-pick' }));
    }

    openSelectProductModal(searchItems) {
        let localsParams = { searchItems };

        this.determineSetPrefillSelectCount(searchItems);

        localsParams.countInOrder = this.currentProduct.product.countInOrder || 1;
        localsParams.locationProductsCounter = angular.copy(this.locationProductsCounter);
        localsParams.chosenLocation = this.currentProduct.locationFrom.id;

        if (!searchItems) {
            localsParams.requestParam = {
                LocationId: !this.currentProduct.isAnyLocationFrom ?
                    this.currentProduct.locationFrom.id :
                    null,
                ExcludeLocationId: this.currentProduct.locationTo.uniqueId,
                LocationIds: this.currentProduct.storeIds,
                ProductId: this.currentProduct.product.productId,
                SearchKeys: this.currentProduct.barcode && this.currentProduct.nextKey ?
                    {
                        Key: this.currentProduct.barcode,
                        Type: this.currentProduct.nextKey.keyType.code,
                        ProductId: this.currentProduct.nextKey.productId
                    } :
                    []
            };
        }

        this.$mdDialog.show({
            template: searchMultipleDevicesTemplate,
            controller: SearchMultipleDevicesModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                params: localsParams
            }
        })
        .then((response) => {

            this.$ngRedux.dispatch(actions.addPickedItems(response));
            this.$ngRedux.dispatch(actions.clearProcessingItem());

            this.$ngRedux.dispatch(actions.setNextKeyProperty(response.nextKey));
            this.$ngRedux.dispatch(actions.setStatusProperty(response.status.id));
            this.$ngRedux.dispatch(actions.setBarcodeProperty(''));
            this.$ngRedux.dispatch(actions.setLookupProperty(this.lookupProperties.LOCATION.id));
        });
    }

    determineSetPrefillSelectCount(searchItems) {
        const countInOrder = this.shipItems.items.byHash[this.currentProduct.hash].countInOrder || 1;

        const selectedInOrder = !this.shipItems.items.byHash[this.currentProduct.hash].linkedItemsHashes ?
            0 :
            this.shipItems.items.byHash[this.currentProduct.hash].linkedItemsHashes
                .reduce((acc, hash) => {
                    return acc += this.linkedItems.items.byHash[hash].count;
                }, 0);

        let prefillCount = countInOrder - selectedInOrder;

        if ( (prefillCount <= 0) || this.currentProduct.isAnyLocationFrom) {
            this.$ngRedux.dispatch(actions.clearPrefillSelectedQty());
        }

        let firstItemPreselected = null;
        const foundItemIdWithSimilarLocation = searchItems ?
            searchItems.items.allIds.reduce((acc, searchItemId) => {

                if (
                    !firstItemPreselected &&
                    this.quickShipService.getAvailableLocationCount(
                        searchItems.items.byId[searchItemId],
                        this.locationProductsCounter
                    ) &&
                    prefillCount > 0 &&
                    this.currentProduct.locationFrom.id === searchItems.items.byId[searchItemId].locationId
                ) {

                    firstItemPreselected = true;

                    prefillCount = prefillCount <= searchItems.items.byId[searchItemId].count ?
                        prefillCount :
                        searchItems.items.byId[searchItemId].count;

                    acc = searchItemId;
                }

                return acc;

            }, null) :
            null;

        if (foundItemIdWithSimilarLocation) {
            this.$ngRedux.dispatch(actions.setPrefillSelectedQtyByLocation({
                itemId: foundItemIdWithSimilarLocation,
                count: prefillCount
            }));
        }
    }


    /**
     * @description check if all items for current productId are selected and preselected (temporary)
     * @returns {boolean}
     */
    isLimitReached() {
        if (!this.inventory.byId[this.currentProduct.productId]) {
            return false;
        }

        const amountThisProductAtInventory = this.inventory.byId[this.currentProduct.productId].count;
        const amountThisProductLinked = this.linkedItems.items.allHashes
            .reduce((acc, hash) => {
                if (this.linkedItems.items.byHash[hash].productId === this.currentProduct.productId) {
                    acc += this.linkedItems.items.byHash[hash].count;
                }
                return acc;
            }, 0) ;
        const amountThisProductPicked = this.pickedItems.items.allIds.reduce((acc, id) => {
            return acc + this.pickedItems.items.byId[id].count;
        }, 0);

        return (amountThisProductLinked + amountThisProductPicked) === amountThisProductAtInventory;
    }

    _countOfNonselected(response) {
        let counter = 0;
        let tmpCounter = 0;
        let lastItemId = null;
        let lastItem = null;

        response.items.allIds.forEach((id) => {
            const linkedCounter = this.locationProductsCounter.byId[id] ?
                this.locationProductsCounter.byId[id].selectedCount:
                0;

            counter += (response.items.byId[id].count - linkedCounter);

            if ( (response.items.byId[id].count - linkedCounter) === 1) {
                lastItemId = id;
                tmpCounter = this.locationProductsCounter.byId[id] ?
                    this.locationProductsCounter.byId[id].tempCount :
                    0;
            }
        });


        if (counter === 1) {
            response.items.byId[lastItemId].count = 1;

            lastItem = {
                items: {
                    byId: { [lastItemId]: Object.assign({}, response.items.byId[lastItemId]) },
                    allIds: [lastItemId]
                },
                components: {
                    byId: {},
                    allIds: []
                }
            };

            if (response.items.byId[lastItemId].componentsIds) {
                lastItem.components = {
                    byId: response.items.byId[lastItemId].componentsIds.reduce((acc, id) => {
                        acc[id] = response.components.byId[id];
                        return acc;
                    }, {}),
                    allIds: response.items.byId[lastItemId].componentsIds
                };
            }

        }

        return { counter, tmpCounter, lastItem };
    }

    _showWarningMsg() {
        if (this.currentProduct.lookupProperty === lookupProperties.SERIAL_NUMBER.id ||
            this.currentProduct.lookupProperty === lookupProperties.LOT_NUMBER.id) {

            this.ngToast.warning(`This item already selected!
                                    Try another ${lookupProperties[this.currentProduct.lookupProperty].name}`);
        } else {
            this.ngToast.warning(`No Devices were found in selected location`);
        }
    }

    cancel() {
        this.$ngRedux.dispatch(actions.resetCurrentProduct());
        this.$state.go('root.orders.quick_ship.items');
    }

    undo() {}

    /**
     * @description save picked to linked and then reset all
     */
    finish() {
        this.$ngRedux.dispatch(actions.addLinkedItems({
            shipItemHash: this.currentProduct.hash,
            pickedItems: this.pickedItems
        }));

        this.$ngRedux.dispatch(actions.shiftFromTempToSelectedCount());

        this.$ngRedux.dispatch(actions.resetCurrentProduct());
        this.$state.go('root.orders.quick_ship.items');
    }
}
