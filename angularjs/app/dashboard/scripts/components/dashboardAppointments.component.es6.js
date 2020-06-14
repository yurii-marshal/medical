import template from '../../views/components/dashboardAppointments.component.html';

class dashboardAppointmentsCtrl {
    constructor(dashboardService, bsLoadingOverlayService, $state) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.dashboardService = dashboardService;

        this.TotalCount = 0;
        this.Items = [];
        this.perPage = 2;
        this.appPage = 1;

        this.$onInit = () => {
            this.loadAppointments(0);
        };
    }

    loadAppointments(page){
        this.bsLoadingOverlayService.start({referenceId: 'upcomingAppointments'});

        this.dashboardService.getUpcommingAppointments(page, this.perPage)
            .then((res) => {
                this.Items = res.data.Items.map((item) => {
                    item.statusClass = `${item.Status.Text.toLowerCase()}-appointment`;
                    return item;
                });
                this.TotalCount = res.data.Count;
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({referenceId: 'upcomingAppointments'});
            });
    }

    openAppointment(item) {
        this.$state.go('root.calendar-appointment', { 'appointmentId': item.Id });
    }
}

const dashboardAppointments = {
    template,
    controller: dashboardAppointmentsCtrl
};

export default dashboardAppointments;
