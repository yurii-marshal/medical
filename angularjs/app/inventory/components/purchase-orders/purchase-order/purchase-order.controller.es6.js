import { purchaseOrderStatusConstants } from '../../../../core/constants/core.constants.es6.js';

import editPurchaseOrderStatusModalController from './modals/edit-purchase-order-status-modal/edit-purchase-order-status-modal.controller.es6';
import editPurchaseOrderStatusModalTemplate from './modals/edit-purchase-order-status-modal/edit-purchase-order-status-modal.html';

export default class PurchaseOrderController {
    constructor($state,
                $scope,
                $mdDialog,
                ngToast,
                bsLoadingOverlayService,
                purchaseOrdersHttpService
    ) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;
        this.purchaseOrderStatusConstants = purchaseOrderStatusConstants;

        this.purchaseOrderId = $state.params.purchaseOrderId;
        this.model = {};
        this.statuses = [];

        this.tabs = [
            {
                'title': 'Details',
                'view': 'root.purchase-order.details'
            },
            {
                'title': 'Audit',
                'view': 'root.purchase-order.audit'
            }
        ];

        this.toolbarItems = [
            {
                text: 'New Purchase Order',
                icon: {
                    url: 'assets/images/default/ic-fab-purchase-order.svg',
                    w: 20,
                    h: 22
                },
                clickFunction: this._createNewPurchaseOrder.bind(this)
            },
            {
                text: 'Modify',
                name: 'modify',
                icon: {
                    url: 'assets/images/default/edit-underline.svg',
                    w: 20,
                    h: 20
                },
                isHidden: true,
                clickFunction: this._modifyPurchaseOrder.bind(this)
            },
            {
                text: 'Print',
                name: 'print',
                icon: {
                    url: 'assets/images/default/printer.svg',
                    w: 20,
                    h: 18
                },
                clickFunction: this._printPurchaseOrder.bind(this)
            },
            {
                name: 'delete',
                text: 'Delete',
                icon: {
                    url: 'assets/images/default/trash.svg',
                    w: 20,
                    h: 20
                },
                isHidden: true,
                clickFunction: this._deletePurchaseOrder.bind(this),
                hasConfirmation: true,
                confirmTitle: 'Delete Purchase Order',
                confirmMsg: 'Are you sure you want to delete this Purchase Order?',
                confirmBtnOk: 'Yes',
                confirmBtnCancel: 'No',
                byDefault: true
            }
        ];

        this._activate();
    }

    _activate() {
        this._getPurchaseOrder();
        this._getStatusesDictionary();
    }

    _getPurchaseOrder() {
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseOrderPage' });
        this.purchaseOrdersHttpService.getPurchaseOrder(this.purchaseOrderId)
            .then((response) => {
                this.model = response.data;
                this._mapStatusClass(this.model.Status);
                this._updateToolbarItems();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'purchaseOrderPage' }));
    }

    _updateToolbarItems() {
        this.toolbarItems.forEach((item) => {
            switch (item.name) {
                case 'modify':
                    item.isHidden = !this.isStatusEditable(this.model.Status);
                    break;
                case 'delete':
                    item.isHidden = this.model.Status.Id !== this.purchaseOrderStatusConstants.NEW_STATUS_ID;
                    break;
                default:
                    break;
            }
        });
    }

    editPurchaseOrderStatus() {
        this.$mdDialog.show({
            controller: editPurchaseOrderStatusModalController,
            controllerAs: '$ctrl',
            template: editPurchaseOrderStatusModalTemplate,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                purchaseOrderId: this.purchaseOrderId,
                model: angular.copy(this.model),
                statuses: this.statuses
            }
        })
        .then((model) => {
            this.model.Status = model.Status;
            this._updateToolbarItems();
        });
    }

    _getStatusesDictionary() {
        return this.purchaseOrdersHttpService.getStatusesDictionary()
            .then((response) => {
                this.statuses = response.data
                    .map((item) => this._mapStatusClass(item));
            });
    }

    _createNewPurchaseOrder() {
        this.$state.go('root.purchase-order-add-items');
    }

    _modifyPurchaseOrder() {
        this.$state.go('root.purchase-order-modify', { purchaseOrderId: this.purchaseOrderId });
    }

    _printPurchaseOrder() {
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseOrderPage' });
        this.purchaseOrdersHttpService.printPurchaseOrder(this.purchaseOrderId)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'purchaseOrderPage' }));
    }

    _deletePurchaseOrder() {
        this.bsLoadingOverlayService.start({ referenceId: 'purchaseOrderPage' });
        this.purchaseOrdersHttpService.deletePurchaseOrder(this.purchaseOrderId)
            .then(() => {
                this.ngToast.success('Purchase Order was successfully deleted');
                this.$state.go('root.inventory.purchase-orders');
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'purchaseOrderPage' });
            });
    }

    isStatusEditable(status) {
        return status && [
            this.purchaseOrderStatusConstants.NEW_STATUS_ID,
            this.purchaseOrderStatusConstants.SUBMITTED_STATUS_ID
        ].indexOf(status.Id) !== -1;
    }

    _mapStatusClass(status) {
        switch (status.Id) {
            case this.purchaseOrderStatusConstants.NEW_STATUS_ID:
                status.statusClass = 'green';
                break;
            case this.purchaseOrderStatusConstants.SUBMITTED_STATUS_ID:
                status.statusClass = 'blue';
                break;
            case this.purchaseOrderStatusConstants.IN_PROGRESS_STATUS_ID:
                status.statusClass = 'orange';
                break;
            case this.purchaseOrderStatusConstants.FULFILLED_STATUS_ID:
                status.statusClass = 'dark-blue';
                break;
            default :
                break;
        }
        return status;
    }
}
