// productItemsTrackingDetailsModal
import productItemsTrackingDetailsCtrl from './product-items-tracking-details/product-items-tracking-details.controller.es6';
import productItemsTrackingDetailsModalTemplate from './product-items-tracking-details/product-items-tracking-details.html';

// productItemsDetailsModal
import productItemsDetailsController from '../../modals/product-items-details/product-items-details.controller.es6.js';
import productItemsDetailsTemplate from '../../modals/product-items-details/product-items-details.html';

class productItemsCtrl {
    constructor($state, $scope, $mdDialog, $filter, bsLoadingOverlayService, popupMenuCalendar, ordersService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.popupMenuCalendar = popupMenuCalendar;
        this.ordersService = ordersService;

        this.statuses = {
            'pending': 'Pending',
            'backordered': 'Backordered',
            'shipped': 'Shipped',
            'delivered': 'Delivered'
        };

        this.orderId = $state.params.orderId;

        $scope.$watch(() => this.items, (newVal) => {
            if (newVal) {
                angular.forEach(this.items, (i) => {
                    i.allHcpcsCodes = $filter('hcpcsCodesToArr')(i);

                    if (i.Components && i.Components.length) {
                        angular.forEach(i.Components, (item) => {
                            item.allHcpcsCodes = $filter('hcpcsCodesToArr')(item);
                        });
                    }
                });
            }
        });
    }

    deleteOrderItem(itemId) {
        this.bsLoadingOverlayService.start({ referenceId: 'orderPage' });
        this.ordersService.deleteOrderItem(this.orderId, itemId)
            .then(() => {
                let index = _.findIndex(this.items, (item) => item.Id === itemId);

                if (index !== -1) {
                    this.items.splice(index, 1);
                }
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderPage' }));
    }

    showMenuDropdown(item, $event) {
        let menuItems = this._getMenuItems(item);

        this.popupMenuCalendar.showPopupMenu(menuItems, $event);
    }

    showItemDetails($event, item) {
        this.$mdDialog.show({
            controller: productItemsDetailsController,
            controllerAs: '$ctrl',
            template: productItemsDetailsTemplate,
            parent: angular.element(document.body),
            targetEvent: $event,
            clickOutsideToClose: false,
            locals: {
                item,
                patientId: this.patientId,
                modalType: 'order'
            }
        });
    }

    showTrackingDetails(item) {
        this.$mdDialog.show({
            controller: productItemsTrackingDetailsCtrl,
            controllerAs: '$ctrl',
            template: productItemsTrackingDetailsModalTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { item }
        });
    }

    _getMenuItems(item) {
        let result = [];

        item.actions.forEach((action) => {
            if (+action.Id !== 4) {
                result.push({
                    'title': action.Text,
                    'class': 'no-left-icon',
                    'exec': () => {
                        this._doAction(item, action.Id);
                    }
                });
            }
        });

        return result;
    }

    _doAction(item, actionTypeId) {
        switch (+actionTypeId) {
            case 1:
                this._backorder(item, actionTypeId);
                break;

            case 2:
                this._shipItem(item);
                break;

            case 3:
                this._markAsDelivered(item, actionTypeId);
                break;
            default:
                break;
        }
    }

    _markAsDelivered(item, actionTypeId) {
        this.$mdDialog.show({
            templateUrl: 'orders/views/modals/change-item-tracking-status-modal.html',
            controller: 'itemTrackingStatusModalController',
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                orderId: this.orderId,
                itemId: item.Id,
                actionTypeId: actionTypeId
            }
        });
    }

    _shipItem(item) {
        this.$state.go('root.orders.quick_ship.items', {
            orderId: this.orderId,
            itemId: item.Id,
            patientId: this.patientId
        });
    }

    _backorder(item, actionTypeId) {
        this.$mdDialog.show({
            templateUrl: 'orders/views/modals/change-item-tracking-status-modal.html',
            controller: 'itemTrackingStatusModalController',
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                orderId: this.orderId,
                itemId: item.Id,
                actionTypeId: actionTypeId
            }
        });
    }
}

const productItems = {
    bindings: {
        items: '=',
        patientId: '<?',
        hasActionBtns: '<?',
        hasDeleteBtns: '<?'
    },
    templateUrl: 'core/components/product-items/product-items.html',
    controller: productItemsCtrl
};

export default productItems;

