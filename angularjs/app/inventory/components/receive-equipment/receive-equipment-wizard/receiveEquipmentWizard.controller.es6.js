import actions from '../../../../core/actions/inventory_receive.actions.es6.js';

import SelectPurchaseOrderCtrl from '../modals/select-purchase-order/select-purchase-order.controller.es6';

import { minusPercentage } from '../../../../core/helpers/math-operations.helper.es6';

export default class receiveEquipmentWizardController {
    constructor(
        $scope,
        $state,
        $mdDialog,
        $ngRedux,
        $filter,
        bsLoadingOverlayService,
        ngToast,
        receiveEquipmentService,
        purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.$scope = $scope;
        this.$ngRedux = $ngRedux;
        this.$filter = $filter;
        this.ngToast = ngToast;

        this.receiveEquipmentService = receiveEquipmentService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.bsLoadingOverlayService = bsLoadingOverlayService;

        const unsubscribe = $ngRedux.connect(this.mapStateToThis, actions)(this);

        $scope.$on('$destroy', unsubscribe);

        this.resetPairCurrent();

        this.pairLast = undefined;
        this.currentStep = 1;

        this.componentInputType = 'serial';
        this.componentInputValue = '';
        this.componentInputCounter = 0;

        this.$scope.$on('$stateChangeSuccess', () => {

            // on page leave
            if (this.$state.current.name.indexOf('root.receive_equipment') < 0) {
                return;
            }

            // step1 is by default
            if (this.$state.is('root.receive_equipment.add')) {
                this.$state.go('root.receive_equipment.add.step1');
            }

            // if on step2 and data is invalid
            if ((!this.$state.is('root.receive_equipment.add.step1') &&
                !this.$state.is('root.receive_equipment')) &&
                (!this.pairCurrent || !this.pairCurrent.location.Id)) {

                this.resetPairCurrent();

                this.$state.go('root.receive_equipment.add.step1');
            }

            if (this.$state.is('root.receive_equipment.add.step1')) {
                this.currentStep = 1;
            }

            if (this.$state.is('root.receive_equipment.add.step2')) {
                this.currentStep = 2;
            }

            if (this.$state.is('root.receive_equipment.add.step1PurchaseOrder')) {
                this.currentStep = 2;
            }

            if (this.$state.is('root.receive_equipment.add.step3Serialized') ||
                this.$state.is('root.receive_equipment.add.step3NonSerialized') ||
                this.$state.is('root.receive_equipment.add.step3BundleSerialNumber') ||
                this.$state.is('root.receive_equipment.add.step3BundleLotNumber')
            ) {
                this.currentStep = 3;
            }
            if (this.$state.is('root.receive_equipment.add.step4Serialized')) {
                this.currentStep = 4;
            }
            if (this.$state.is('root.receive_equipment.add.step5DeviceNumber')) {
                this.currentStep = 5;
            }
        });

    }

    mapStateToThis(state) {

        return {
            pairList: state.inventoryReceive.pairList,
            pairCurrent: state.inventoryReceive.pairCurrent,
            purchaseOrder: state.inventoryReceive.purchaseOrder
        };
    }

    determinePriceAndSet(items) {
        const matchedItem = items.find((item) => item.ProductId === this.pairLast.product.Id);

        if (matchedItem) {
            this.pairLast.product.PurchasePrice = minusPercentage(matchedItem.Price, matchedItem.Discount);
        } else {
            this.pairLast.product.PurchasePrice = 0;
        }
    }

    setItemPriceUsePurchaseOrder(purchaseOrderId) {
        this.bsLoadingOverlayService.start({ referenceId: 'receiveStep2' });

        return this.purchaseOrdersHttpService.getPurchaseOrder(purchaseOrderId)
            .then((response) => {

                this.bsLoadingOverlayService.stop({ referenceId: 'receiveStep2' });

                this.pairLast.purchaseOrder.Items = response.data.Items;
                this.pairCurrent.purchaseOrder.Items = response.data.Items;
                this.setPairCurrent(this.pairCurrent);
                this.determinePriceAndSet(response.data.Items);
            });
    }

    selectPurchaseOrderModal(event) {
        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/select-purchase-order/select-purchase-order.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: SelectPurchaseOrderCtrl,
            controllerAs: 'modal',
            locals: {}
        }).then((selectedPurchaseOrder) => {

            this.pairCurrent.purchaseOrder = selectedPurchaseOrder;

            if (this.pairLast) {
                this.pairLast.purchaseOrder = selectedPurchaseOrder;
            }

            this.searchPurchaseOrderById(selectedPurchaseOrder.Id);
        });
    }

    searchPurchaseOrderBarcode() {
        if (!this.pairCurrent.purchaseOrder.Id) {
            this.goStep2();
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'receiveStep1PO' });

        this.purchaseOrdersHttpService.getPurchaseOrders({ Id: this.pairCurrent.purchaseOrder.Id })
            .then((response) => {
                if (response.data.Items.length !== 1) {
                    this.ngToast.warning(`Purchase Order by ID '${ this.pairCurrent.purchaseOrder.Id }' was not found.`);
                } else {
                    this.searchPurchaseOrderById(response.data.Items[0].Id);
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'receiveStep1PO' }));
    }

    searchPurchaseOrderById(purchaseOrderId) {

        if (!purchaseOrderId) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'receiveStep1PO' });

        this.purchaseOrdersHttpService.getPurchaseOrder(purchaseOrderId)
            .then((response) => {
                this.pairCurrent.purchaseOrder = response.data;

                if (this.pairLast) {
                    this.pairLast.purchaseOrder = response.data;
                }

                if (this.$state.is('root.receive_equipment.add.step1PurchaseOrder')) {
                    this.goStep2();
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'receiveStep1PO' }));
    }

    searchLocationModal(event, isAddNewLocation) {
        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/location-dialog/search-locations-modal.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controller: 'locationDialogController as modal',
            locals: {
                inventoryAction: 'receive',
                isAnyLocation: undefined,
                locationTypeId: undefined,
                storeIds: null
            }
        })
            .then((newLocation) => {
                this.pairCurrent.location = newLocation;
                this.setPairCurrent(this.pairCurrent);

                if (isAddNewLocation) {
                    this.goStep1PurchaseOrder();
                }
            });
    }

    searchProductModal(event) {
        this.$mdDialog.show({
            templateUrl: 'inventory/views/modals/search-products-modal.html',
            targetEvent: event,
            clickOutsideToClose: true,
            controllerAs: 'modal',
            controller: 'productsDialogController',
            locals: {
                excludeLocation: null,
                productType: 'any'
            }
        })
            .then((newProduct) => {
                // clear backup of previous item
                this.pairPrevBackup = undefined;
                this.inputTypePrevBackup = undefined;

                this.pairCurrent.product.Count = newProduct.Count;
                this.pairCurrent.product.barcode = newProduct.barcode;

                this.searchProductByBarcode();
            });
    }

    searchLocationById() {

        if (!this.pairCurrent.location.Id) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'receiveStep1' });
        this.receiveEquipmentService.getLocationById(this.pairCurrent.location.Id)
            .then((response) => {
                if (response.data.Items.length !== 1) {
                    this.ngToast.warning(`Location by ID '${this.pairCurrent.location.Id}' was not found.`);
                } else {
                    this.pairCurrent.location = response.data.Items[0];
                    this.setPairCurrent(this.pairCurrent);

                    this.goStep2();
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'receiveStep1' }));
    }

    searchProductByBarcode() {
        if (!this.pairCurrent.product.barcode) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'receiveStep2' });
        this.receiveEquipmentService.getProductById(this.pairCurrent.product.barcode)
            .then((response) => {
                if (!response.data) {
                    this.ngToast.warning(`Product '${this.pairCurrent.product.barcode}' was not found.`);
                    this.pairCurrent.product.barcode = '';
                    this.setPairCurrent(this.pairCurrent);
                } else if (response.data.Status.Code === 'Discontinued') {
                    this.ngToast.warning(`You can't receive product with status "Discontinued".`);
                    this.pairCurrent.product.barcode = '';
                    this.setPairCurrent(this.pairCurrent);
                } else {
                    this.pairCurrent.product = response.data;
                    this.setPairCurrent(this.pairCurrent);
                    this.goStep3();
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'receiveStep2' }));
    }

    editNotesModal(event, pairIndex, subIndex) {
        let productLink;

        if (pairIndex === 'last') {
            // last product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0) ?
                this.pairList[this.pairList.length - 1].product.Components[subIndex] :
                this.pairList[this.pairList.length - 1].product;
        } else {
            // current product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0) ?
                this.pairCurrent.product.Components[subIndex] :
                this.pairCurrent.product;
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
            .then((editedNote) => {
                productLink.notes = editedNote;
                if (pairIndex === 'last') {
                    // refresh last displaying product
                    this.pairLast.product = angular.copy(this.pairList[this.pairList.length - 1]).product;
                }
            });
    }

    editPurchaseModal(purchasePrice) {

        this.$mdDialog.show({
            templateUrl: 'inventory/components/receive-equipment/modals/modify-purchase-price/modify.purchase.price.html',
            controller: 'modifyPurchasePriceController as $ctrl',
            clickOutsideToClose: true,
            locals: {
                purchasePrice: purchasePrice ? +this.$filter('absNumber')(purchasePrice, 2) : 0
            }
        }).then((price) => this.pairLast.product.PurchasePrice = price);
    }

    editQtyModal(event, pairIndex, subIndex) {
        let productLink;

        if (pairIndex === 'last') {
            // last product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0) ?
                this.pairList[this.pairList.length - 1].product.Components[subIndex] :
                this.pairList[this.pairList.length - 1].product;
        } else {
            // current product
            // get parent pair product or component inside it
            productLink = (subIndex !== null && subIndex >= 0) ?
                this.pairCurrent.product.Components[subIndex] :
                this.pairCurrent.product;
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
                needMaxQtyValidation: false
            }
        })
            .then((editedNote) => {
                productLink.Count = editedNote;
                if (pairIndex === 'last') {
                    // refresh last displaying product
                    this.pairLast.product = angular.copy(this.pairList[this.pairList.length - 1].product);
                }
            });
    }

    // setting position of input at product Components
    setComponentPosition() {
        // checking if end is reached
        if ((this.componentInputCounter + 1) > this.pairCurrent.product.Components.length) {

            // if not unique by serial numbers
            if (!this.receiveEquipmentService.isUniqueBundleBySerials(this.pairCurrent, this.pairList)) {
                this.ngToast.danger('Bundle Product with same Serial Numbers set already added.');
                this.pairCurrent.product = {
                    Id: '',
                    Name: ''
                };

                this.setPairCurrent(this.pairCurrent);
                this.goStep2();
                return;
            }

            // if all checks passed - push pair to list
            this.pushPairToList();
            return;
        }

        switch (this.componentInputType) {
            case 'serial':
                if (this.pairCurrent.product.Components[this.componentInputCounter].serialNumberEnabled) {
                    this.componentInputValue = '';
                } else {
                    this.componentInputType = 'lot';
                    this.setComponentPosition();
                    return;
                }
                break;
            case 'lot':
                if (this.pairCurrent.product.Components[this.componentInputCounter].lotNumberEnabled) {
                    this.componentInputValue = '';
                } else {
                    this.componentInputType = 'num';
                    this.setComponentPosition();
                    return;
                }
                break;
            default: // 'num'
                if (this.pairCurrent.product.Components[this.componentInputCounter].NeedDeviceNumber) {
                    this.componentInputValue = '';
                } else {
                    this.componentInputCounter++;
                    this.componentInputType = 'serial';
                    this.setComponentPosition();
                    return;
                }
                break;
        }

        // save last componentInputType for using in back function
        this.inputTypePrevBackup = angular.copy(this.componentInputType);
    }

    // setting previous position of input at product Components
    setComponentPrevPosition() {
        this.componentInputValue = '';

        // checking if start is reached
        if (this.componentInputCounter < 0 ||
            (this.componentInputCounter === 0 && this.componentInputType === 'serial')) {
            this.clearComponentCounters();
            this.goStep3();
            return;
        }

        // move to prev element
        switch (this.componentInputType) {
            case 'serial':
                this.componentInputType = 'num';
                this.componentInputCounter--;

                if (this.pairCurrent.product.Components[this.componentInputCounter].NeedDeviceNumber) {
                    this.pairCurrent.product.Components[this.componentInputCounter].deviceNumber = '';
                    return;
                }
                this.setComponentPrevPosition();

                break;
            case 'lot':
                this.componentInputType = 'serial';

                if (this.pairCurrent.product.Components[this.componentInputCounter].serialNumberEnabled) {
                    this.pairCurrent.product.Components[this.componentInputCounter].serialNumber = '';
                    return;
                }
                this.setComponentPrevPosition();

                break;
            default: // 'num'
                this.componentInputType = 'lot';

                if (this.pairCurrent.product.Components[this.componentInputCounter].lotNumberEnabled) {
                    this.pairCurrent.product.Components[this.componentInputCounter].lotNumber = '';
                    return;
                }
                this.setComponentPrevPosition();

                break;
        }
    }

    // filling components with data step by step
    setCopmponentValue() {
        // setting data to component field

        if (!this.componentInputValue) {
            return false;
        }

        switch (this.componentInputType) {
            case 'serial':
                if (checkForSerialNumDuplicate(this.pairCurrent.product.Components, this.componentInputValue)) {
                    this.pairCurrent.product.Components[this.componentInputCounter].serialNumber = this.componentInputValue;
                    this.componentInputType = 'lot';
                } else {
                    this.ngToast.danger('Bundle Product with same Serial Numbers set already added.');
                }
                this.componentInputValue = '';
                break;
            case 'lot':
                this.pairCurrent.product.Components[this.componentInputCounter].lotNumber = this.componentInputValue;
                this.componentInputType = 'num';
                this.componentInputValue = '';
                break;
            default: // 'num'
                this.pairCurrent.product.Components[this.componentInputCounter].deviceNumber = this.componentInputValue;
                this.componentInputType = 'serial';
                this.componentInputValue = '';
                this.componentInputCounter++;
                break;
        }

        this.setComponentPosition();

        function checkForSerialNumDuplicate(list, serialNum) {
            let isSNUnique = _.findIndex(list, { serialNumber: serialNum });

            return isSNUnique === -1;
        }

    }

    clearComponentCounters() {
        this.componentInputType = 'serial';
        this.componentInputValue = '';
        this.componentInputCounter = 0;
    }

    pushPairToList() {
        let itemToPush = angular.copy(this.pairCurrent);

        this.pairList.push(itemToPush);

        this.pairCurrent.product = {
            Id: '',
            Name: ''
        };

        this.pairLast = this.pairList[this.pairList.length - 1];
        // save last pair for using in back function
        this.pairPrevBackup = angular.copy(this.pairLast);

        this.setPairList(this.pairList);
        this.setPairCurrent(this.pairCurrent);

        this.goStep2();

        if (this.pairLast.purchaseOrder.Id) {
            this.determinePriceAndSet(this.pairLast.purchaseOrder.Items);
        }
    }


    // back button logic
    back() {
        if (this.currentStep === 2) {

            if (this.pairCurrent.location.Id &&
                !this.pairCurrent.product.Id &&
                !this.pairLast) {

                this.pairPrevBackup = undefined;

                if (this.$state.is('root.receive_equipment.add.step1PurchaseOrder')) {
                    this.resetPairCurrent();
                    this.$state.go('root.receive_equipment.add.step1');
                } else {
                    this.resetPurchaseOrder();
                    this.$state.go('root.receive_equipment.add.step1PurchaseOrder');
                }


            } else if (this.pairCurrent.location.Id &&
                this.pairLast &&
                this.pairLast.product.Id &&
                (
                    this._findAdditionalFieldsInProduct(this.pairLast.product) ||
                    this._findAdditionalFieldsInComponents(this.pairLast.product)
                )) {

                this._findItemInReviewList();
                this.pairCurrent = angular.copy(this.pairPrevBackup);

                if (this.pairCurrent.product.isBundle &&
                    this._findAdditionalFieldsInComponents(this.pairCurrent.product)) {

                    this.componentInputCounter = this._findFirstAdditionalFieldIndex(this.pairCurrent.product, 'end');
                    const componentProp = this.inputTypePrevBackup === 'num' ?
                        'device' :
                        this.inputTypePrevBackup;

                    this.pairCurrent.product.Components[this.componentInputCounter][`${componentProp}Number`] = '';
                    this.componentInputType = this.inputTypePrevBackup;
                    this.goStep3(true);

                } else if (this._findAdditionalFieldsInProduct(this.pairCurrent.product)) {

                    if (this.pairCurrent.product.deviceNumber) {
                        this.pairCurrent.product.deviceNumber = '';
                        this.goStep5Serialized();

                    } else if (this.pairCurrent.product.lotNumber) {
                        this.pairCurrent.product.lotNumber = '';
                        this.$state.go('root.receive_equipment.add.step4Serialized');

                    } else if (this.pairCurrent.product.serialNumber) {
                        this.pairCurrent.product.serialNumber = '';
                        this.goStep3Serialized();
                    }
                }

                this.pairLast = undefined;
                this.pairPrevBackup = undefined;

            } else {
                /**
                 * @desc Product or it's Components don't have serial or lot number,
                 *       product added to list
                 */
                this._findItemInReviewList();
                this.pairLast = undefined;
                this.pairPrevBackup = undefined;
                this.clearPairProduct(this.pairCurrent);
            }

        } else if (this.currentStep > 2) {

            if (this.pairCurrent.product.isBundle &&
                this._areAdditionalFieldsEmpty(this.pairCurrent.product.Components, 0)) {

                let isLastEmptyCounter = this._isLastEmptyCounter(this.pairCurrent.product);

                if (isLastEmptyCounter) {
                    this.pairLast = undefined;
                    this.pairPrevBackup = undefined;
                    this.clearPairProduct(this.pairCurrent);

                    this.goStep2();
                } else {
                    this.setComponentPrevPosition();
                }

            } else if (this.pairCurrent.product.isBundle &&
                !this._areAdditionalFieldsEmpty(this.pairCurrent.product.Components, 0)) {
                /**
                 * @desc Product or it's Components has serial or lot number
                 *       and some of them is editing at this step,
                 *       product hasn't added to list yet
                 */
                this.setComponentPrevPosition();

            } else if (!this.pairCurrent.product.isBundle &&
                this._findAdditionalFieldsInProduct(this.pairCurrent.product)) {
                /**
                 * @desc Product has serial, lot, device number
                 *       and any is empty
                 */

                if (this.pairCurrent.product.NeedDeviceNumber &&
                    this.pairCurrent.product.deviceNumber) {

                    this.pairCurrent.product.deviceNumber = '';
                    this.$state.go('root.receive_equipment.add.step5DeviceNumber');

                } else if (this.pairCurrent.product.Lotted &&
                    this.pairCurrent.product.lotNumber) {

                    this.pairCurrent.product.lotNumber = '';
                    this.$state.go('root.receive_equipment.add.step4Serialized');

                } else if (this.pairCurrent.product.isSerialized &&
                    this.pairCurrent.product.serialNumber) {

                    this.pairCurrent.product.serialNumber = '';
                    this.goStep3Serialized();

                } else {

                    this.pairLast = undefined;
                    this.pairPrevBackup = undefined;
                    this.clearPairProduct(this.pairCurrent);

                    this.goStep2();
                }
            }
        }
    }

    _findAdditionalFieldsInProduct(product) {
        return product.Lotted || product.Type.Code === 'Serialized' || product.NeedDeviceNumber;
    }

    _findAdditionalFieldsInComponents(product) {
        let hasAdditionalFields = false;

        if (product.Components) {
            product.Components.forEach((component) => {
                if (component.Lotted || component.Type.Code === 'Serialized' || component.NeedDeviceNumber) {
                    hasAdditionalFields = true;
                }
            });
        }

        return hasAdditionalFields;
    }

    _findFirstAdditionalFieldIndex(product, startFrom) {
        let index;

        if (startFrom === 'beginning') {
            for (let i = 0; i < product.Components.length; i++) {
                if (product.Components[i].Lotted ||
                    product.Components[i].Type.Code === 'Serialized' ||
                    product.Components[i].NeedDeviceNumber) {
                    index = i;
                    return index;
                }
            }
        } else {
            for (let i = product.Components.length - 1; i >= 0; i--) {
                if (product.Components[i].Lotted ||
                    product.Components[i].Type.Code === 'Serialized' ||
                    product.Components[i].NeedDeviceNumber) {
                    index = i;
                    return index;
                }
            }
        }

        return index;
    }

    _isLastEmptyCounter(product) {
        let isLastEmpty = true;

        for (let i = this.componentInputCounter; i >= 0; i--) {

            let component = product.Components[i];

            if (component.lotNumber || component.serialNumber || component.deviceNumber) {
                isLastEmpty = false;
            }
        }

        return isLastEmpty;
    }

    _areAdditionalFieldsEmpty(items, itemIndex) {

        if (!isEveryFieldEmpty(items[itemIndex]) && itemIndex < items.length) {
            itemIndex++;
            this._areAdditionalFieldsEmpty(items, itemIndex);

        } else {
            return true;
        }

        function isEveryFieldEmpty(item) {
            const devNumEmpty = item.NeedDeviceNumber ? !item.deviceNumber : true;
            const lotNumEmpty = item.Lotted ? !item.lotNumber : true;
            const serialNumEmpty = item.Type.Code === 'Serialized' ? !item.serialNumber : true;

            let anyFieldEmpty = devNumEmpty && lotNumEmpty && serialNumEmpty;

            return anyFieldEmpty;
        }

        return false;
    }

    _findItemInReviewList() {
        if (!this.pairLast) {
            return;
        }

        let existingItemIndex = this.pairLast.product.Type.Code !== 'Bundle' ?
            this.receiveEquipmentService.findExistingNotBundleIndex(this.pairList, this.pairLast) :
            this.receiveEquipmentService.findExistingBundleIndex(this.pairList, this.pairLast);

        if (existingItemIndex !== -1) {
            this.pairList.splice(existingItemIndex, 1);
            this.setPairList(this.pairList);
        }
    }

    // managing steps
    goToReview() {
        this.resetPairCurrent();
        this.$state.go('root.receive_equipment');
    }

    goStep1PurchaseOrder() {
        this.$state.go('root.receive_equipment.add.step1PurchaseOrder');
    }

    goStep2() {
        this.$state.go('root.receive_equipment.add.step2');
    }

    goStep3(savePrevCounter) {
        switch (this.pairCurrent.product.Type.Code) {
            case 'Serialized':
                this.goStep3Serialized();
                break;
            case 'NonSerialized':
                this.goStep3NonSerialized();
                break;
            case 'Bundle':
                this.goStep3BundleSerialNumber(savePrevCounter);
                this.setComponentPosition();
                break;
        }
    }

    goStep3Serialized() {
        this.$state.go('root.receive_equipment.add.step3Serialized');
    }

    goStep4NonSerialized() {

        if (!this.pairCurrent.product.lotNumber) {
            return ;
        }

        this.pushPairToList();
    }

    goStep4Serialized() {

        if (!this.pairCurrent.product.serialNumber) {
            return ;
        }

        // check serial numbers for unique before next step
        if (!this.receiveEquipmentService.isUniqueBySerial(this.pairCurrent, this.pairList)) {
            this.ngToast.danger('Product with same Serial Number already added.');
            this.pairCurrent.product.serialNumber = undefined;
            this.setPairCurrent(this.pairCurrent);
            return;
        }

        if (this.pairCurrent.product.Lotted) {
            this.$state.go('root.receive_equipment.add.step4Serialized');
        } else {
            this.goStep5Serialized();
        }
    }

    goStep5Serialized() {

        if (this.pairCurrent.product.Lotted && !this.pairCurrent.product.lotNumber) {
            return ;
        }

        // check serial lot for unique before next step
        if (this.pairCurrent.product.NeedDeviceNumber) {
            this.$state.go('root.receive_equipment.add.step5DeviceNumber');
        } else {
            this.pushPairToList();
        }
    }

    goStep3NonSerialized() {
        if (this.pairCurrent.product.Lotted) {
            this.$state.go('root.receive_equipment.add.step3NonSerialized');
        } else {
            this.pushPairToList();
        }
    }

    goStep3BundleSerialNumber(savePrevCounters) {
        if (!savePrevCounters) {
            this.clearComponentCounters();
        }

        this.$state.go('root.receive_equipment.add.step3BundleSerialNumber');
    }

    goStep3BundleLotNumber() {
        this.$state.go('root.receive_equipment.add.step3BundleLotNumber');
    }

    cancel() {
        this.resetPairCurrent();
        this.$state.go('root.receive_equipment');
    }


    // dispatch redux actions
    setPairCurrent(pairCurrent) {
        this.$ngRedux.dispatch(actions.setPairCurrent(pairCurrent));
    }

    resetPairCurrent() {
        this.$ngRedux.dispatch(actions.resetPairCurrent());
    }

    resetPurchaseOrder() {
        this.$ngRedux.dispatch(actions.resetPurchaseOrder());
    }

    setPairList(pairList) {
        this.$ngRedux.dispatch(actions.setPairList(pairList));
    }

    clearPairProduct(pair) {
        pair.product = {
            Id: '',
            Name: ''
        };
    }

}
