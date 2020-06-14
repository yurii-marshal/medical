import { orderStatusConstants } from '../../../../../core/constants/core.constants.es6.js';

// Modal Controllers
import selectPatientOrdersModalController from './select-patient-orders/selectPatientOrdersModal.controller.es6.js';
import appointmentPickupEquipmentController from './appointment-pickup-equipment/appointment-pickup-equipment.controller.es6.js';

// Templates
import template from './appointment-orders.html';
import selectPatientOrdersModalTemplate from './select-patient-orders/select-patient-orders-modal.html';
import appointmentPickupEquipmentTemplate from './appointment-pickup-equipment/appointment-pickup-equipment.html';

class appointmentOrdersCtrl {
    constructor($scope,
                $state,
                $mdDialog,
                ngToast,
                $filter,
                bsLoadingOverlayService,
                $q,
                appointmentOrdersService,
                calendarAppointmentService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;
        this.appointmentOrdersService = appointmentOrdersService;
        this.calendarAppointmentService = calendarAppointmentService;

        this.orderId = $state.params.orderId;
        this.model = calendarAppointmentService.getModel();

        this.dictionaries = {};
        this.orders = [];
        this.patientEquipment = [];

        this.allActiveOrders = [];

        this._activate();
    }

    $onInit() {
        this.appointmentTypeId = this.appointmentType && this.appointmentType.Id;
    }

    _activate() {
        const pageSize = 0;

        let promise1 = this.appointmentOrdersService.getPatientEquipment(this.patientId)
            .then((response) => this.patientEquipment = _.uniqBy(response.data.Items, (item) => item.Id));

        let promise2 = this.appointmentOrdersService.getPatientActiveOrders(this.patientId, { pageSize })
            .then((response) => {
                this.totalOrdersCount = response.data.Count;

                if (!this.allActiveOrders.length) {
                    this.allActiveOrders = response.data.Items;
                }

                if (this.orderId) {
                    const filterPreselectedOrder = response.data.Items.filter((item) => item.Id === this.orderId)[0];

                    this.preselectedOrder = this._formatPatientOrders(filterPreselectedOrder);
                }
                if (response.data.Count === 1) {
                    this.preselectedOrder = this._formatPatientOrders(response.data.Items[0]);
                }
            });

        let promise3 = this.appointmentOrdersService.getOrderDictionaries()
            .then((response) => this.dictionaries = response);

        let promises = [ promise1, promise2, promise3 ];

        this.bsLoadingOverlayService.start({ referenceId: 'appointmentOrders' });
        this.$q.all(promises)
            .then(() => {
                if (!this.selectedOrders || !this.selectedOrders.length) {
                    this.selectedOrders = [this._getDefaultOrderModel(this.preselectedOrder)];
                    this.preselectedOrder = null;
                } else {
                    this.selectedOrders = this.selectedOrders.map((item) => {
                        return {
                            patientOrder: this._formatPatientOrders(item)
                        };
                    });
                    this.calculateDuration();
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'appointmentOrders' }));
    }

    getPatientOrders(query) {
        return Promise.resolve(this.allActiveOrders)
            .then((orders) => {
                orders = orders.filter((item) => {
                    const index = _.findIndex(this.selectedOrders, (orderEntity) => {
                        if (!orderEntity.patientOrder) {
                            return false;
                        }
                        return orderEntity.patientOrder.Id === item.Id;
                    });

                    return index === -1;
                });
                if (query) {
                    orders = orders.filter((item) => item.DisplayText.toLowerCase().indexOf(query.toLowerCase()) !== -1);
                }
                orders.forEach((item) => this._formatPatientOrders(item));
                return orders;
            });
    }

    _formatPatientOrders(item) {
        this.allActiveOrders.forEach((activeOrder) => {
            if (activeOrder.Id === item.Id) {
                item.State = activeOrder.State;
            }
        });

        if (item.patientOrder && item.patientOrder.Id) {
            item = item.patientOrder;
        }

        let orderDate = this.$filter('amDateFormat')(this.$filter('amUtc')(item.CreatedDate), 'MM/DD/YYYY');
        // TODO - to find out if we need this check
        let statusText = _.has(item, 'State.Status.Text')
            ? item.State.Status.Text
            : (item.Completed ? 'Completed' : 'Ready');

        item.Id = item.Id || item.orderId;

        const refProvider = !_.isEmpty(item.Physician)
            ? `| Ref. Provider: ${this.$filter('referralDisplayName')(item)}`
            : '';

        item.DisplayText = `Order: ${item.DisplayId} | Status: ${statusText} | Date: ${orderDate} ${refProvider}`;

        item.StatusClass = this._getStatusClass(item);
        if (!_.has(item, 'State.Status')) {
            item.State = {
                Status: { Text: statusText }
            };
        }

        return item;
    }

    _getStatusClass(item) {
        let statusClass = '';

        if (_.has(item, 'State.Status')) {
            statusClass = this.appointmentOrdersService.getOrderStatusClass(item.State.Status.Id);
        } else {
            statusClass = item.Completed
                ? this.appointmentOrdersService.getOrderStatusClass(orderStatusConstants.COMPLETED_ORDER_ID)
                : this.appointmentOrdersService.getOrderStatusClass(orderStatusConstants.NEW_ORDER_ID);
        }

        return statusClass;
    }

    selectPatientOrdersModal(selectedOrder, orderIndex) {
        this.$mdDialog.show({
            template: selectPatientOrdersModalTemplate,
            clickOutsideToClose: true,
            controllerAs: '$ctrl',
            controller: selectPatientOrdersModalController,
            locals: {
                patientId: this.patientId
            }
        })
        .then((response) => {
            let index = _.findIndex(this.selectedOrders, (order) => response.Id === (order.patientOrder && order.patientOrder.Id));

            if (index !== -1) {
                this.ngToast.warning('This order is already selected');
                return;
            }

            if (!selectedOrder.patientOrder
                || (selectedOrder.patientOrder && selectedOrder.patientOrder.Id !== response.Id)) {
                let newOrderObject = {
                    patientOrder: this._formatPatientOrders(response)
                };

                this.changeOrder(newOrderObject, orderIndex, this.appointmentType.Id);
            }
        });
    }

    addOrder() {
        this.selectedOrders.push(this._getDefaultOrderModel(this.preselectedOrder));
    }

    changeOrder(order, orderIndex) {
        const orderId = order.patientOrder && order.patientOrder.Id;

        this.selectedOrders.splice(
                orderIndex,
                1,
                (orderId ? order : { Id: undefined, patientOrder: null })
            );

        this.model.durationFromServer = '00:00:00';
        this.calculateDuration();
    }

    changeAppType(appointmentType, appointmentTypeId) {
        appointmentType.Id = appointmentTypeId;
        appointmentType.PickupOptions = {
            Reason: undefined,
            ReasonPatientExpired: undefined,
            ReasonOtherText: undefined,
            Devices: []
        };

        appointmentType.RevisitOptions = {
            RevisitList: {
                0: { Name: 'MaskRefitType', Id: 1 },
                1: { Name: 'EquipmentChangeType', Id: 2 },
                2: { Name: 'EquipmentMaintenance', Id: 4 },
                3: { Name: 'PatientAssesment', Id: 8 }
            }
        };

        this.model.durationFromServer = '00:00:00';
        this.model.IsCustomDuration = false;
        this.calculateDuration();
    }

    initRevisitOptions(RevisitItem, revisitOptionId) {
        if (!RevisitItem) {
            RevisitItem = { Id: revisitOptionId };
        } else {
            RevisitItem.Id = revisitOptionId;
        }
    }

    viewOrderDetails(orderInfo) {
        this.calendarAppointmentService.openOrderDetails(orderInfo.patientOrder.Id);
    }

    deleteOrder(index) {
        if (this.selectedOrders[index]) {
            this.selectedOrders.splice(index, 1);
            this.model.durationFromServer = '00:00:00';
            this.calculateDuration();
        } else {
            this.selectedOrders.splice(index, 1);
        }
    }

    openPickup() {
        this.$mdDialog.show({
            template: appointmentPickupEquipmentTemplate,
            clickOutsideToClose: true,
            controllerAs: '$ctrl',
            controller: appointmentPickupEquipmentController,
            locals: {
                selectedOrderEquipment: this.appointmentType.PickupOptions.Devices,
                patientEquipment: this.patientEquipment
            }
        })
        .then((response) => this.appointmentType.PickupOptions.Devices = response);
    }

    deleteSelectedEquipment(itemId) {
        let index = _.findIndex(this.appointmentType.PickupOptions.Devices, (item) => item.Id === itemId);

        this.appointmentType.PickupOptions.Devices.splice(index, 1);
    }

    clearReason(appointmentType) {
        appointmentType.PickupOptions.ReasonPatientExpired = undefined;
        appointmentType.PickupOptions.ReasonOtherText = undefined;
    }

    calculateDuration() {
        const selectedOrderCount = this.selectedOrders.reduce((acc, item) => {
            if (item.patientOrder) {
                acc++;
            }
            return acc;
        }, 0);

        if (!this.appointmentTypeId) {
            this.appointmentOrders.appointmentType.$setTouched();
            return;
        }

        if (this.model.durationFromServer && this.model.durationFromServer !== '00:00:00'
            || this.model.IsCustomDuration) {
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'appointmentOrders' });
        let request = this.calendarAppointmentService.getDurationSettingsModel(selectedOrderCount, this.appointmentType);

        this.calendarAppointmentService.getDuration(request)
            .then((response) => {
                this.model.durationFromServer = response.data;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'appointmentOrders' }));
    }

    _getDefaultOrderModel(preselectedOrder) {
        const patientOrder = preselectedOrder ? angular.copy(preselectedOrder) : null;

        return {
            Id: undefined,
            patientOrder
        };
    }

    isAddOrderDisabled() {
        let btnDisabled = false;

        this.selectedOrders.forEach((order) => {
            if (!order.patientOrder) {
                btnDisabled = true;
            }
        });

        return btnDisabled;
    }
}

const appointmentOrders = {
    bindings: {
        patientId: '<',
        selectedOrders: '=',
        appointmentType: '=',
        selectedPatient: '<'
    },
    template,
    controller: appointmentOrdersCtrl
};

export default appointmentOrders;
