export default class completeModalController {
    constructor($scope, $state, $mdDialog, bsLoadingOverlayService, appointmentId, event, personnelId) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.personnelId = personnelId;

        this.appointmentId = appointmentId;
        this.event = event;

        this.event.orders = _.filter(this.event.Relations, (order) => !order.Completed);

        $scope.$watch(() => $state.current.name, (newVal, oldVal) => {
            if (oldVal === 'calendar-appointment.complete' && newVal !== 'calendar-appointment.complete') {
                $mdDialog.hide();
            }
        });

        $scope.$on('$stateChangeStart', () => $mdDialog.cancel());
    }

    complete(order) {
        this.$mdDialog.cancel();

        this.$state.go('root.completeEvent.step1.equipments', {
            appointmentId: this.appointmentId,
            orderId: order.OrderId,
            personnelId: this.personnelId
        });
    }

    cancel() {
        this.$mdDialog.cancel();
        this.$state.go('root.calendar-appointment');
    }
}
