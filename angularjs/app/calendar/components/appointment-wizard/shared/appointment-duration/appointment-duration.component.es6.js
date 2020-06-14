import template from './appointment-duration.html';

class AppointmentDurationCtrl {
    constructor($scope, calendarAppointmentService) {
        'ngInject';

        this.model = calendarAppointmentService.getModel();

        $scope.$watch(() => this.model.durationFromServer, (newVal) => {
            if (newVal && !this.model.IsCustomDuration) {
                this._updateDuration();
            }
        }, true);
    }

    $onInit() {

        if (this.model.selectedDuration === '0h 0m'
            && this.model.event
            && this.model.event.DateRange) {

            let diff = moment(this.model.event.DateRange.To).diff(moment(this.model.event.DateRange.From));
            let duration = moment.duration(diff, 'milliseconds');

            this.model.selectedDuration = `${duration.hours()}h ${duration.minutes()}m`;
        }
    }

    durationChanged() {
        this.model.IsCustomDuration = this.model.selectedDuration !== this._convertTimeToDuration(this.model.durationFromServer);
    }

    _updateDuration() {
        this.model.selectedDuration = this._convertTimeToDuration(this.model.durationFromServer);
    }

    /**
     * Convert Time "16:30:00" to Duration string "16h 30m"
     * @param strTime
     * @returns {string}
     */
    _convertTimeToDuration(strTime) {
        let arr = /(\d+):(\d+):(\d+)/.exec(strTime);

        return (!arr) ? '0h 0m' : `${parseInt(arr[1])}h ${parseInt(arr[2])}m`;
    }
}

const appointmentDuration = {
    bindings: {
        readonly: '<?'
    },
    template,
    controller: AppointmentDurationCtrl
};

export default appointmentDuration;
