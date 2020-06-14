import template from './appointmentDetailTimeInfo.component.html';

class AppointmentDetailTimeInfoCtrl {

    constructor() {
        this.Date = '';
        this.timeFrom = '';
        this.timeTo = '';

        let mask = 'YYYY-MM-DDThh:mm:ssZ';
        let from = moment.utc(this.start, mask);
        let to = moment.utc(this.end, mask);

        to.diff(from, 'days');

        this.Date = from.format('MM/DD/YYYY');
        this.timeFrom = from.format('hh:mm A');
        this.timeTo = to.format('hh:mm A');
    }
}

export const appointmentDetailTimeInfoComponent = {
    template: template,
    controller: AppointmentDetailTimeInfoCtrl,
    bindings: {
        start: '<',
        end: '<'
    }
};

export default appointmentDetailTimeInfoComponent;
