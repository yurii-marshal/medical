import { mapOrderStatusClass } from '../../../core/helpers/map-order-css-statuses.helper.es6';

import {
    permissionsCategoriesConstants,
    ordersPermissionsConstants
} from '../../../core/constants/permissions.constants.es6';

export default class AppointmentDetailsCtrl {
    constructor(
        $rootScope,
        $state,
        bsLoadingOverlayService,
        ngToast,
        $mdDialog,
        eventsService,
        calendarAppointmentService,
        userPermissions
        ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.eventsService = eventsService;
        this.calendarAppointmentService = calendarAppointmentService;

        this.appointmentId = $state.params.appointmentId;
        this.appointmentStatus = undefined;
        this.appointmentStatuses = [];
        this.shortInfo = {};
        this.userPermissions = userPermissions;

        this.eventIsCompleted = false;

        this.toolbarItems = [
            {
                text: 'Complete',
                icon: {
                    url: 'assets/images/default/check-square.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this.goToComplate.bind(this),
                isHidden: false
            },
            {
                text: 'Reschedule',
                icon: {
                    url: 'assets/images/default/calendar.svg',
                    w: 14,
                    h: 16
                },
                clickFunction: this.rescheduleAppointment.bind(this)
            },
            {
                text: 'Cancel',
                icon: {
                    url: 'assets/images/default/cancel-square.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this.cancelAppointment.bind(this)
            },
            {
                text: 'Delete',
                icon: {
                    url: 'assets/images/default/trash.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: this.deleteAppointment.bind(this)
            }
        ];

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'appointmentDetails' });

        if (this.$state.current.name === 'calendar-appointment.complete') {
            this.showCompleteModal();
        }

        this._getEvent();

        this.eventsService.getEventAppointmentStatuses(this.appointmentId)
            .then((response) => this.appointmentStatuses = response.data);
    }

    _getEvent() {
        this.event = undefined;
        this.patientInfo = undefined;

        this.eventsService.getEventById(this.appointmentId)
            .then((response) => {
                const completeItem = this.toolbarItems.find((item) => {
                    return item.text.toLowerCase() === 'complete';
                });

                this.event = response.data;

                if (response.data.Relations &&
                    response.data.Relations.length) {

                    if (completeItem &&
                        !this.userPermissions.isAllow(permissionsCategoriesConstants.ORDERS, ordersPermissionsConstants.ORDER_MODIFY)) {

                        completeItem.isHidden = true;
                    }

                    response.data.Relations.forEach((order) => {
                        order.OrderStatus.statusClass = mapOrderStatusClass(order.OrderStatus.Id);
                    });
                }

                this.event.when = this._getDates(this.event.DateRange);
                this.completeIsShown = _.some(response.data.Orders, (order) => order.CompleteProcess);
            })
            .finally(() => {

                if (!this.event) {
                    this.bsLoadingOverlayService.stop({ referenceId: 'appointmentDetails' });
                    this.$state.go('root.calendar');
                    this.ngToast.danger('Appointment error');
                    return false;
                }

                this.isCancelled = this.event.AppointmentStatus.Id === 3;

                if (this.event.AppointmentStatus.Id === 4) {
                    this.eventIsCompleted = true;
                }

                if (!this.eventIsCompleted && this.event.ReadOnly) {
                    this.toolbarItems = [this.toolbarItems[0]];
                }

                this.bsLoadingOverlayService.stop({ referenceId: 'appointmentDetails' });
            });
    }

    updateStatus(id) {
        let model = { EventType: id };

        this.eventsService.changeAppointmentStatus(this.appointmentId, model)
            .then(() => {
                this._getEvent();
                this.$rootScope.$broadcast('patientUpdated');
                this.ngToast.success('Appointment status updated');
            });
    }

    goToComplate() {
        this.$state.go('root.completeEvent.step1.equipments', {
            appointmentId: this.appointmentId,
            patientId: this.shortInfo.Id,
            personnelId: this.event.Personnel ? this.event.Personnel.Id : null
        });
    }

    showCompleteModal() {
        this.$mdDialog.show({
            controller: 'completeModalController as $ctrl',
            templateUrl: 'calendar/views/modals/calendar.wizard.complete.modal.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                appointmentId: this.appointmentId,
                event: this.event,
                personnelId: this.event.Personnel ? this.event.Personnel.Id : null
            }
        });
    }

    cancelAppointment() {
        this.eventsService.cancelAppointment(this.appointmentId)
            .then(() => {
                this.ngToast.success('Appointment cancelled');
                this.$state.go('root.calendar');
            });

    }

    rescheduleAppointment() {
        this.$state.go('root.reschedule_appointment_wizard.step1', {
            patientId: this.event.Patient.Id,
            appointmentId: this.appointmentId
        });
    }

    deleteAppointment() {
        this.eventsService.deleteAppointment(this.appointmentId);
        this.ngToast.success('Appointment deleted');
        this.$state.go('root.calendar');
    }

    viewOrderDetails(orderId) {
        this.calendarAppointmentService.openOrderDetails(orderId);
    }

    openPreview(token) {
        this.eventsService.openDocument(token);
    }

    _getDates(dateRange) {
        let mask = 'YYYY-MM-DDThh:mm:ssZ',
            from = moment.utc(dateRange.From, mask),
            to = moment.utc(dateRange.To, mask);

        if (to.diff(from, 'days') === 0) {
            return {
                date: from.format('MM/DD/YYYY'),
                time: `${from.format('hh:mm A')} - ${to.format('hh:mm A')}`
            };
        }
        return {
            date: `${from.format('MM/DD/YYYY')} - ${to.format('MM/DD/YYYY')}`,
            time: `${from.format('hh:mm A')} - ${to.format('hh:mm A')}`
        };

    }

    isToolbarHidden() {
        return (this.event && this.event.ReadOnly) && (this.eventIsCompleted || this.isCancelled);
    }
}
