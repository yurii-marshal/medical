import actions from '../../../core/actions/inventory_transfer.actions.es6.js';

export default class transferEquipmentWizardController {
    constructor($scope,
                $state,
                $ngRedux,
                $mdDialog,
                bsLoadingOverlayService,
                ngToast,
                inventoryEquipmentService,
                transferEquipmentService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.$ngRedux = $ngRedux;
        this.$scope = $scope;
        this.ngToast = ngToast;
        this.transferEquipmentService = transferEquipmentService;
        this.inventoryEquipmentService = inventoryEquipmentService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);
        $scope.$on('$destroy', unsubscribe);

        this.resetPairCurrent();

        this.pairLast = undefined;
        this.isProductNotFound = false;
        this.currentStep = 1;

        $scope.$on('$stateChangeSuccess', () => {

            // on page leave
            if (this.$state.current.name.indexOf("root.transfer_equipment") < 0) {
                return;
            }

            // step1 is by default
            if (this.$state.is("root.transfer_equipment.add")) {
                this.$state.go("root.transfer_equipment.add.step1");
            }

            // if on step3 and data is invalid
            if (this.$state.is("root.transfer_equipment.add.step3")
                && (!this.pairCurrent || !this.pairCurrent.locationTo.Id)) {
                this.resetPairCurrent();
                this.$state.go("root.transfer_equipment.add.step1");
            }

            if (this.$state.is("root.transfer_equipment.add.step1")) { this.currentStep = 1; }
            if (this.$state.is("root.transfer_equipment.add.step2")) { this.currentStep = 2; }
            if (this.$state.is("root.transfer_equipment.add.step3")) { this.currentStep = 3; }

        });
    }

    mapStateToThis(state) {
        return {
            pairList: state.inventoryTransfer.pairList,
            pairCurrent: state.inventoryTransfer.pairCurrent
        }
    }

    // search location FROM in modal window
    searchLocationFromModal (event, isAddNewLocation) {
        this.$mdDialog.show({
                templateUrl: 'inventory/components/receive-equipment/modals/location-dialog/search-locations-modal.html',
                targetEvent: event,
                clickOutsideToClose: true,
                controller: 'locationDialogController as modal',
                locals: {
                    inventoryAction: 'transfer',
                    isAnyLocation: false,
                    locationTypeId: undefined,
                    storeIds: null
                }
            })
            .then(newLocation => {
                this.pairCurrent.locationFrom = newLocation;
                this.setPairCurrent(this.pairCurrent);

                if (isAddNewLocation) { this.goStep2(); }
            });
    }

    // search location TO in modal window
    searchLocationToModal(event, isAddNewLocation) {
        this.$mdDialog.show({
                templateUrl: 'inventory/views/modals/search-locations-complex-modal.html',
                targetEvent: event,
                clickOutsideToClose: true,
                controllerAs: 'modal',
                controller: 'locationComplexDialogController',
                locals: {
                    excludeLocations: [this.pairCurrent.locationFrom.Id]
                }
            })
            .then(newLocation => {
                if (this.pairCurrent.locationFrom.UniqueId === newLocation.Id) {
                    this.ngToast.danger(`"Location From" and "Location To" are the same.
                                         Please change the selected locations.`);
                    return;
                }

                this.pairCurrent.locationTo = newLocation;
                this.setPairCurrent(this.pairCurrent);

                if (isAddNewLocation) { this.goStep3(); }

            }, err => {});
    }

    // search product in modal window
    searchProductModal(event) {
        // clear backup of previous item
        this.pairPrevBackup = undefined;

        this.$mdDialog.show({
                templateUrl: 'inventory/views/modals/search-products-modal.html',
                targetEvent: event,
                clickOutsideToClose: true,
                controllerAs: 'modal',
                controller: 'productsDialogController',
                locals: {
                    excludeLocation: this.pairCurrent.locationFrom,
                    productType: 'device'
                }
            })
            .then((newProduct) => {
                this.pairCurrent.product.Count = newProduct.Count;
                this.pairCurrent.product.Id = newProduct.barcode;

                this.searchProductByProductId();
            });
    }

    // called when more then 1 product was found
    selectProductModal(productList) {
        this.$mdDialog.show({
                templateUrl: "inventory/views/modals/select-products-modal.html",
                clickOutsideToClose: false,
                controllerAs: 'modal',
                controller: 'selectProductDialogController',
                locals: {
                    productList: productList || this.pairCurrent.product.items
                }
            })
            .then((selectedProduct) => {
                this.pairCurrent.product = selectedProduct;
                this.pairCurrent = this.transferEquipmentService.calculateProductProperties(this.pairCurrent);

                this.pushPairToList();
            });
    }

    // search location by Id and and apply it
    searchLocationById(typeofLocation) {
        this.bsLoadingOverlayService.start({ referenceId: "transferStep1" });

        let _loc = typeofLocation === 'from'
            ? this.pairCurrent.locationFrom
            : this.pairCurrent.locationTo;

        // if location From is emty
        if (_loc.Id === '' && typeofLocation === 'from') {
            this.goStep2();
            return;
        }

        let locPromise = undefined;

        if (typeofLocation === 'from') {
            locPromise = this.transferEquipmentService.getLocationById(_loc.Id)
            .then(response => response.data, err => {});
        } else {
            let paramsObj = { Id: _loc.Id };
            locPromise = this.inventoryEquipmentService.getLocationsByName(paramsObj);
        }

        locPromise
            .then((response) => {
                if (response.Items.length !== 1) {

                    this.ngToast.warning(`Location by ID '${_loc.Id}' was not found.`);
                    this.resetPairList();

                } else {

                    if (typeofLocation === 'from') {
                        this.pairCurrent.locationFrom = response.Items[0];
                        this.goStep2();
                    } else {
                        this.pairCurrent.locationTo = response.Items[0];
                        this.goStep3();
                    }
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'transferStep1' }));
    }

    // search product by barcode and and apply it
    searchProductByProductId() {
        this.pairLast = undefined;

        this.bsLoadingOverlayService.start({ referenceId: 'step3' });
        this.transferEquipmentService.getProductByCodes(this.pairCurrent)
            .then(response => {
                if (response.data.Status.Code === 'Found') {

                    this.isProductNotFound = false;
                    this.pairCurrent.product.items = response.data.Items;

                    let availableProductList = this.pairCurrent.product.items.filter((item) => {
                        let availableItem =
                            (item.LocationUniqueId.toString() !== this.pairCurrent.locationTo.Id)
                            && (item.LocationId.toString() !== this.pairCurrent.locationTo.Id);

                        return availableItem;
                    });

                    if (availableProductList.length > 1) {
                        // if more then 1 available item - show modal choose dialog
                        this.selectProductModal(availableProductList);

                    } else if (availableProductList.length === 1) {
                        // if only 1 product found, we select it in auto mode
                        this.pairCurrent.product = availableProductList[0];
                        this.pairCurrent =
                            this.transferEquipmentService.calculateProductProperties(this.pairCurrent);

                        this.pushPairToList();
                    } else {
                        this.ngToast.danger('This item is already located in the selected destination location.');
                        this.pairCurrent = this.transferEquipmentService.clearPair(this.pairCurrent);
                        this.setPairCurrent(this.pairCurrent);
                    }
                }

                if (response.data.Status.Code === 'NotFound') {
                    this.pairCurrent.product = response.data;
                    this.pairCurrent = this.transferEquipmentService.clearPair(this.pairCurrent);
                    this.setPairCurrent(this.pairCurrent);

                    this.isProductNotFound = true;
                }

                if (response.data.Status.Code === 'NotDetermined') {
                    this.pairCurrent.product = response.data.Product;
                    this.pairCurrent.Status = response.data.Status;
                    this.pairCurrent.NextKey = response.data.NextKey;

                    this.pairCurrent = this.transferEquipmentService.calculateProductNextKey(this.pairCurrent);
                    this.pairPrevBackup = angular.copy(this.pairCurrent);
                    this.setPairCurrent(this.pairCurrent);

                    this.isProductNotFound = false;
                }
            }, err => {})
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: "step3" }));
    }

    editNotesModal(event, pairIndex, subIndex) {
        let productLink = undefined;
        if (pairIndex === 'last') {
            // last product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0)
                ? this.pairList[this.pairList.length - 1].product.Components[subIndex]
                : this.pairList[this.pairList.length - 1].product;
        } else {
            // current product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0)
                ? this.pairCurrent.product.Components[subIndex]
                : this.pairCurrent.product;
        }

        this.$mdDialog.show({
                templateUrl: 'inventory/views/modals/show-notes-modal.html',
                targetEvent: event,
                clickOutsideToClose: true,
                controllerAs: 'modal',
                controller: 'notesDialogController',
                locals: {
                    currentNote: productLink.notes
                }
            })
            .then(editedNote => {
                productLink.notes = editedNote;
                if (pairIndex === 'last') {
                    // refresh last displaying product
                    this.pairLast.product = angular.copy(this.pairList[this.pairList.length - 1]).product;
                }
            });
    }

    editQtyModal(event, pairIndex, subIndex) {
        let productLink = undefined;
        if (pairIndex === 'last') {
            // last product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0)
                ? this.pairList[this.pairList.length - 1].product.Components[subIndex]
                : this.pairList[this.pairList.length - 1].product;
        } else {
            // current product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0)
                ? this.pairCurrent.product.Components[subIndex]
                : this.pairCurrent.product;
        }

        this.$mdDialog.show({
                templateUrl: 'inventory/views/modals/change-qty-modal.html',
                targetEvent: event,
                clickOutsideToClose: true,
                controllerAs: 'modal',
                controller: 'qtyDialogController',
                locals: {
                    currentQty: productLink.Count,
                    maxQty: productLink.maxCount,
                    product: productLink.Name,
                    needMaxQtyValidation: true
                }
            })
            .then(editedNote => {
                productLink.Count = editedNote;
                if (pairIndex === 'last') {
                    // refresh last displaying product
                    this.pairLast.product = angular.copy(this.pairList[this.pairList.length - 1].product);

                }
            });
    }

    // put product to wizard temp list of products
    pushPairToList() {
        let locationFromId = this.pairCurrent.locationFrom.UniqueId !== ''
            ? this.pairCurrent.locationFrom.UniqueId
            : this.pairCurrent.product.LocationUniqueId;

        if (locationFromId === this.pairCurrent.locationTo.Id) {
            this.ngToast.danger('This item is already located in the selected destination location.');
            this.pairCurrent = this.transferEquipmentService.clearPair(this.pairCurrent);
            this.setPairCurrent(this.pairCurrent);
            return;
        }

        let pushResult = this.transferEquipmentService.pushPairToList(this.pairCurrent, this.pairList);

        switch (pushResult) {
            case 'cantPush':
                this.ngToast.warning('This product already added');
                break;
            case 'countReached':
                this.ngToast.warning('Max amount of this product already added.');
                break;
            case 'push':
                this.pushPair(this.pairCurrent);
                this.ngToast.success('Product added to list.');
                break;
            default:
                this.ngToast.success('Product was added to the transfer list.');
                break;
        }

        this.pairLast = angular.copy(this.pairCurrent);

        this.pairCurrent = this.transferEquipmentService.clearPair(this.pairCurrent);
        this.setPairCurrent(this.pairCurrent);
    }

    pushPair(pair) {
        let itemToPush = angular.copy(pair);
        if (!itemToPush.locationFrom.Id) {
            itemToPush.locationFrom.Id = itemToPush.product.LocationId;
            itemToPush.locationFrom.Name = itemToPush.product.Location;
        }
        this.pairList.push(itemToPush);

        this.setPairList(this.pairList);
    }

    // back button logic
    back() {
        if (this.currentStep === 2) {
            /**
             * @desc this.pairCurrent has only locationFrom at this point
             */

            this.resetPairCurrent();
            this.pairPrevBackup = undefined;
            this.$state.go('root.transfer_equipment.add.step1');

        } else if (this.currentStep === 3) {
            /**
             * @desc this.pairCurrent has locationTo and has/hasn't chosen Product at this point
             */

            if (this.pairCurrent.locationTo
                && !this.pairCurrent.product.Id
                && !this.isProductNotFound
                && !this.pairLast) {

                this.resetPairCurrentLocation('to', this.pairCurrent);
                this.goStep2();

            } else if (this.pairCurrent.locationTo
                        && !this.pairCurrent.product.Id
                        && this.isProductNotFound) {

                this.isProductNotFound = false;
                this.pairPrevBackup = undefined;

            } else if (!this.pairCurrent.product.Id
                        && !this.pairPrevBackup
                        && this.pairLast) {

                this._findItemInReviewList();
                this.pairLast = undefined;

            }  else if (!this.pairCurrent.product.Id
                        && this.pairPrevBackup
                        && this.pairLast) {

                this._findItemInReviewList();
                this.pairLast = undefined;
                this.pairCurrent = this.pairPrevBackup;

            } else if (this.pairCurrent.product.Id) {

                this._findItemInReviewList();
                this.pairCurrent = this.transferEquipmentService.clearPair(this.pairCurrent);

            }
        }
    }

    _findItemInReviewList() {
        if (!this.pairLast || !this.pairLast.product.Id) { return; }

        let existingItemIndex = this.pairLast.product.Type.Code !== 'Bundle'
            ? this.transferEquipmentService.findExistingNotBundleIndex(this.pairList, this.pairLast)
            : this.transferEquipmentService.findExistingBundleIndex(this.pairList, this.pairLast);

        if (existingItemIndex !== -1) {

            if (!this.pairLast.product.isSerialized
                && ( this.pairList[existingItemIndex].product.Count > this.pairLast.product.Count ) ) {
                this.pairList[existingItemIndex].product.Count -= this.pairLast.product.Count;
            } else {
                this.pairList.splice(existingItemIndex);
            }

            this.setPairList(this.pairList);
        }
    }


    // managing steps
    skipStep() {
        this.resetPairCurrent();
        this.goStep2();
    }

    goStep2() {
        this.$state.go('root.transfer_equipment.add.step2');
    }

    goStep3() {
        this.$state.go('root.transfer_equipment.add.step3');
    }

    goToReview() {
        this.resetPairCurrent();
        this.$state.go("root.transfer_equipment");
    }

    cancel() {
        this.resetPairCurrent();
        this.$state.go("root.transfer_equipment");
    }


    // dispatch redux actions
    setPairCurrent(pairCurrent) {
        this.$ngRedux.dispatch(actions.setPairCurrent(pairCurrent));
    }

    resetPairCurrent() {
        this.$ngRedux.dispatch(actions.resetPairCurrent());
    }

    resetPairCurrentLocation(type, pairCurrent) {
        if (type === 'from') {
            pairCurrent.locationFrom = {
                Id: '',
                Description: '',
                Name: ''
            }
        } else {
            pairCurrent.locationTo = {
                Id: '',
                UniqueId: '',
                Description: '',
                Name: ''
            }
        }
        this.setPairCurrent(pairCurrent);
    }

    setPairList(pairList) {
        this.$ngRedux.dispatch(actions.setPairList(pairList));
    }

    resetPairList() {
        this.$ngRedux.dispatch(actions.resetPairList());
    }

}
