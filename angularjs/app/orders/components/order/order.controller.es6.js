import NewOrderDocumentCtrl from './modals/new-order-document/new-order-document.controller.es6.js';
import OrderStatusEditModalCtrl from './modals/order-status-edit/order-status-edit-modal.controller.es6.js';

import {
    patientStatusEnumConstants,
    orderStatusConstants
} from '../../../core/constants/core.constants.es6.js';

import {
    permissionsCategoriesConstants,
    ordersPermissionsConstants
} from '../../../core/constants/permissions.constants.es6';

import newOrderDocumentTpl from './modals/new-order-document/new-order-document.html';
import orderStatusEditTpl from './modals/order-status-edit/order-status-edit-popup.html';

export default class orderController {
    constructor(
        $scope,
        $state,
        ngToast,
        $mdDialog,
        bsLoadingOverlayService,
        $q,
        $filter,
        ordersService,
        invoicesService,
        patientsService,
        userPermissions
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;
        this.$filter = $filter;
        this.ordersService = ordersService;
        this.invoicesService = invoicesService;
        this.userPermissions = userPermissions;

        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.orderStatusConstants = orderStatusConstants;
        this.ordersPermissionsConstants = ordersPermissionsConstants;

        this.orderId = $state.params.orderId;
        this.isToolbarItemsHidden = false;

        this.orderStatus = undefined;
        this.orderType = undefined;
        this.orderStateObj = undefined;

        this.dictionaries = {
            statuses: [],
            methods: [],
            reasons: []
        };

        ordersService.clearModel();
        this.model = ordersService.getModel();

        this.tabs = [
            {
                'title': 'Details',
                'view': 'root.orders.order.details'
            },
            {
                'title': 'Items',
                'view': 'root.orders.order.items'
            },
            {
                'title': 'Documents',
                'view': 'root.orders.order.documents'
            },
            {
                'title': 'Notes',
                'view': 'root.orders.order.notes'
            },
            {
                'title': 'Financial',
                'view': 'root.orders.order.financial'
            },
            {
                'title': 'Cost Sharing',
                'view': 'root.orders.order.expense',
                'isHidden': true
            }
        ];

        this.toolbarItems = [
            {
                text: 'New Order',
                icon: {
                    url: 'assets/images/default/tasks.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this._newOrder.bind(this)
            },
            {
                text: 'New Document',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 16,
                    h: 20
                },
                clickFunction: this._newDocument.bind(this),
                isHidden: !this.userPermissions.isAllow(this.permissionsCategoriesConstants.ORDERS, this.ordersPermissionsConstants.ORDER_MODIFY)
            },
            {
                text: 'New Note',
                icon: {
                    url: 'assets/images/default/messages-reverse.svg',
                    w: 18,
                    h: 18
                },
                clickFunction: this._goNoteTab.bind(this),
                isHidden: !this.userPermissions.isAllow(this.permissionsCategoriesConstants.ORDERS, this.ordersPermissionsConstants.ORDER_MODIFY)
            },
            {
                text: 'New Invoice',
                name: 'invoice',
                icon: {
                    url: 'assets/images/default/insurance.svg',
                    w: 18,
                    h: 20
                },
                clickFunction: this._createInvoice.bind(this),
                isHidden: true
            },
            {
                text: 'Modify',
                name: 'modify',
                icon: {
                    url: 'assets/images/default/edit.svg',
                    w: 19,
                    h: 18
                },
                clickFunction: this._modifyOrder.bind(this),
                isHidden: true
            },
            {
                text: 'Quick Ship',
                name: 'quick-ship',
                icon: {
                    url: 'assets/images/default/track.svg',
                    w: 22,
                    h: 16
                },
                clickFunction: this._quickShip.bind(this),
                isHidden: true
            },
            {
                text: 'Complete',
                name: 'complete-order',
                icon: {
                    url: 'assets/images/default/check-square.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this._completeOrder.bind(this),
                isHidden: true
            },
            {
                text: 'New Appointment',
                name: 'appointment',
                icon: {
                    url: 'assets/images/default/plus.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this.redirectToCalendarWizard.bind(this),
                isHidden: true
            }
        ];

        this._activate();

        $scope.$on('orderUpdated', () => this._activate());

        $scope.$on('removeAllPendingItems', () => {
            this._hideExpenseEstimatesTab();
        });

    }

    _hideExpenseEstimatesTab() {
        const expanseTab = this.tabs.find((tab) => tab.title === 'Cost Sharing');

        expanseTab.isHidden = true;
    }

    _activate() {
        let promises = [
            this.ordersService.getOrderShortInfo(this.orderId),
            // TODO - remove this and short info at all in next release
            this.ordersService.getOrderDetails(this.orderId)
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'orderPage' });
        return this.$q.all(promises)
            .then((responses) => {

                if (responses[1].HasPendingItems) {
                    const expanseTab = this.tabs.find((tab) => tab.title === 'Cost Sharing');

                    expanseTab.isHidden = false;
                } else {
                    if (this.$state.is('root.orders.order.expense')) {
                        this.$state.go('root.orders.order.details');
                    }
                }

                this.model.Tags = responses[1].Tags;

                this.orderStatus = this.model.shortInfo.State.Status.Id;
                this.orderType = +this.model.shortInfo.Type.Id;
                this.orderStateObj = angular.copy(this.model.shortInfo.State);

                /**
                 * this.model.Tags setted up in this.ordersService from getOrderDetails
                 */

                // Hide action toolbar for Cancelled order

                if (+this.orderStatus === orderStatusConstants.CANCELLED_ORDER_ID) {
                    this.isToolbarItemsHidden = true;
                } else {
                    this.isToolbarItemsHidden = false;
                }

                // Style order status label
                this._setStatusColor(this.orderStateObj.Status);

                this._setActionButtonsVisibility();

                this._getOrderStatuses()
                    .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderPage' }));

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderPage' }));

    }

    // Dictionaries
    _getOrderStatuses() {
        return this.ordersService.getOrderStatuses(this.orderId)
            .then((response) => {
                this.dictionaries.statuses = response.data;
                this.dictionaries.statuses.forEach((status) => this._setStatusColor(status));
            });
    }

    // Action buttons
    _newOrder() {
        this.$state.go('root.orders.add');
    }

    _modifyOrder() {
        this.$state.go('root.orders.edit.step1', {
            orderId: this.$state.params.orderId,
            isFromPhys: this.model.shortInfo.Patient.Id === undefined
        });
    }

    _newDocument($event) {
        this.$mdDialog.show({
            template: newOrderDocumentTpl,
            targetEvent: $event,
            controller: NewOrderDocumentCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                patientId: this.model.shortInfo.Patient.Id
            }
        });
    }

    _goNoteTab() {
        this.$state.go('root.orders.order.notes');
    }

    _createInvoice() {
        this.invoicesService.createInvoice(this.model.shortInfo.Patient, this.model.shortInfo);
    }

    _quickShip() {
        this.$state.go('root.orders.quick_ship.items', {
            orderId: this.orderId,
            patientId: this.model.shortInfo.Patient.Id,
            itemId: 'update'
        });
    }

    _addResupplyProgram() {
        this.$state.go('root.orders.resupplyProgram.view', { orderId: this.orderId });
    }

    _completeOrder() {
        this.$state.go('root.completeOrder.step1.equipments',
            { orderId: this.orderId, patientId: this.model.shortInfo.Patient.Id });
    }

    _setActionButtonsVisibility() {
        const patientStatus = this.model.shortInfo.Patient.Status && this.model.shortInfo.Patient.Status.Id;

        // Show New Appointment action button
        const appoitmentToolbarItemIndex = _.findIndex(this.toolbarItems, { name: 'appointment' });

        if (
            (+this.orderStatus === orderStatusConstants.NEW_ORDER_ID ||
            +this.orderStatus === orderStatusConstants.IN_PROGRESS_ORDER_ID ||
            +this.orderStatus === orderStatusConstants.COMPLETED_ORDER_ID) &&
            patientStatus === patientStatusEnumConstants.ACTIVE_STATUS_ID
        ) {
            this.toolbarItems[appoitmentToolbarItemIndex].isHidden = false;
        } else {
            this.toolbarItems[appoitmentToolbarItemIndex].isHidden = true;
        }


        // Show New Invoice action button
        const newInvoiceToolbarItemIndex = _.findIndex(this.toolbarItems, { name: 'invoice' });

        if (+this.orderStatus !== orderStatusConstants.CANCELLED_ORDER_ID) {
            this.toolbarItems[newInvoiceToolbarItemIndex].isHidden = false;
        } else {
            this.toolbarItems[newInvoiceToolbarItemIndex].isHidden = true;
        }

        // Show Quick Ship action button
        const quickShipToolbarItemIndex = _.findIndex(this.toolbarItems, { name: 'quick-ship' });

        if (this.userPermissions.isAllow(this.permissionsCategoriesConstants.ORDERS, this.ordersPermissionsConstants.ORDER_MODIFY) &&
            (+this.orderStatus === orderStatusConstants.NEW_ORDER_ID ||
             +this.orderStatus === orderStatusConstants.IN_PROGRESS_ORDER_ID)
        ) {
            this.toolbarItems[quickShipToolbarItemIndex].isHidden = false;
        } else {
            this.toolbarItems[quickShipToolbarItemIndex].isHidden = true;
        }

        // Show Complete Order action button
        const completeOrderToolbarItemIndex = _.findIndex(this.toolbarItems, { name: 'complete-order' });

        if (this.userPermissions.isAllow(this.permissionsCategoriesConstants.ORDERS, this.ordersPermissionsConstants.ORDER_MODIFY) &&
            patientStatus === patientStatusEnumConstants.ACTIVE_STATUS_ID &&
            (+this.orderStatus === orderStatusConstants.NEW_ORDER_ID ||
            +this.orderStatus === orderStatusConstants.IN_PROGRESS_ORDER_ID)
        ) {
            this.toolbarItems[completeOrderToolbarItemIndex].isHidden = false;
        } else {
            this.toolbarItems[completeOrderToolbarItemIndex].isHidden = true;
        }

        if (this.userPermissions.isAllow(this.permissionsCategoriesConstants.ORDERS, this.ordersPermissionsConstants.ORDER_MODIFY)) {
            // Show Modify Order action button
            const modifyToolbarItemIndex = _.findIndex(this.toolbarItems, { name: 'modify' });

            if ((+this.orderStatus === orderStatusConstants.CANCELLED_ORDER_ID ||
                +this.orderStatus === orderStatusConstants.COMPLETED_ORDER_ID)
            ) {
                this.toolbarItems[modifyToolbarItemIndex].isHidden = true;
            } else {
                this.toolbarItems[modifyToolbarItemIndex].isHidden = false;
            }
        }
    }

    // Style Order status
    _setStatusColor(status) {
        switch (Number(status.Id)) {
            case 1:
                status.statusClass = 'orange';
                break;
            case 2:
                status.statusClass = 'green';
                break;
            case 3:
                status.statusClass = 'blue';
                break;
            case 4:
                status.statusClass = 'gray';
                break;
            case 5:
                status.statusClass = 'dark-blue';
                break;
            default :
                break;
        }
    }

    editOrderStatus() {

        this.$mdDialog.show({
            controller: OrderStatusEditModalCtrl,
            controllerAs: '$ctrl',
            template: orderStatusEditTpl,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                orderStateObj: angular.copy(this.orderStateObj), // prevent changes on current view
                orderTags: angular.copy(this.model.Tags),
                dictionaries: this.dictionaries,
                orderType: this.orderType,
                orderId: this.orderId
            }
        })
            .then((resultPopup) => {
                // Modal inside triggered order reset event

                this.model.Tags = resultPopup.orderTags;
            });
    }

    redirectToCalendarWizard() {
        this.$state.go('root.order_appointment_wizard.step1', { patientId: this.model.Patient.Id, orderId: this.orderId });
    }
}
