export default class completeWizardEquipmentController {
    constructor(
        $state,
        $scope,
        completeWizardService,
        bsLoadingOverlayService
    ) {
        'ngInject';

        this.$state = $state;
        this.completeWizardService = completeWizardService;

        this.model = completeWizardService.getModel();
        this.model.selectedHiddenItems = [];

        this.IsHaveEventPersonnel = !!$state.params.personnelId;

        this.isEventComplete = !!$state.params.appointmentId;

        this.bsLoadingOverlayService = bsLoadingOverlayService;

        $scope.$on('$stateChangeSuccess', () => {
            if (this.$state.is('root.completeEvent.step1.equipments')) {
                this._dynamicMaxCountUpdate();
            }
        });
    }

    selectOrder(order) {
        this.model.orders.forEach((order) => {
            order.isActive = false;
        });

        if (!order.ordered.length) {
            this.bsLoadingOverlayService.start({ referenceId: 'orderItems' });

            this.completeWizardService.getItemsByOrderId(order.OrderId).then((response) => {

                order.ordered = response.data.Items;

                this.bsLoadingOverlayService.stop({ referenceId: 'orderItems' });
            });
        }

        this.model.selectedOrder = order;
        order.isActive = true;

        this._dynamicMaxCountUpdate();
    }

    addEquipment() {

        if (this.model.selectedOrder && this.model.selectedOrder.ordered) {
            const manufacturersForSearch = this.model.selectedOrder.ordered.map((item) => {
                return {
                    Id: item.ManufacturerId,
                    Name: item.Manufacturer
                };
            });

            this.model.manufacturersForSearch = _.uniqBy(manufacturersForSearch, 'Id');
            this.model.partNumbersForSearchFilter = _.uniq(this.model.selectedOrder.ordered.map((item) => item.PartNumber));
        }

        this.completeWizardService.saveSelectedItemsToTmp();

        this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step1.add`,
            { orderId: this.model.selectedOrder.OrderId });

        this.model.selectedHiddenItems = this.getRelatedOrdersItems();
    }

    /**
     * @description - return items, which selected in related orders in theirs max qty
     * @returns {Array}
     */
    getRelatedOrdersItems() {
        let selectedHiddenItems = [];
        const inactiveOrders = this.model.orders.filter((order) => {
            return order.OrderId !== this.model.selectedOrder.OrderId;
        });

        inactiveOrders.forEach((i) => {
            selectedHiddenItems = i.selected.concat(selectedHiddenItems);
        });

        selectedHiddenItems = selectedHiddenItems.filter((item) => {
            return item.Count === item.maxCount;
        });

        return selectedHiddenItems;
    }

    /**
     * @description dynamically update value of max count for all new selected items
     *              (actually add new property for items with dynamic max count)
     * @private
     */
    _dynamicMaxCountUpdate() {
        if (this.model.selectedOrder.selected) {
            this.model.selectedOrder.selected = this.model.selectedOrder.selected.map((i) => {
                i.dynamicMaxCount = this._changeMaxQty(i);
                return i;
            });
        }
    }

    /**
     * @description - calculation dynamicMaxCount property for device depending on exisiting
     *                same devices elected on related order
     * @param {Object} - device, which we are changing max count (dynamicMaxCount) for
     * @returns {number} - max count value
     * @private
     */
    _changeMaxQty(i) {
        let selectedItems = [];

        const relatedOrders = this.model.orders.filter((order) => {
            return order.OrderId !== this.model.selectedOrder.OrderId;
        });

        relatedOrders.forEach((i) => {
            selectedItems = i.selected.concat(selectedItems);
        });

        const sameItemsArr = selectedItems.length ? selectedItems.filter((item) => item.Id === i.Id ) : [];
        const selectedCountArr = sameItemsArr.length ? sameItemsArr.map((i) => i.Count) : [];
        const dynamicMaxCount = selectedCountArr.length ?
            selectedCountArr.reduce((accumulator, currentValue) => accumulator + currentValue) :
            0;

        return (i.maxCount - dynamicMaxCount) > 0 ? (i.maxCount - dynamicMaxCount) : 1;
    }
}
