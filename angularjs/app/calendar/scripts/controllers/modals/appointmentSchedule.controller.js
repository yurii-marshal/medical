(function () {
    "use strict";

    angular
        .module("app.calendar")
        .controller("appointmentScheduleController", appointmentScheduleController);

    /* @ngInject */
    function appointmentScheduleController($mdDialog, date, schedules) {
        var schedule = this;

        schedule.schedules = schedules;
        schedule.date = moment(date).format("DD MMMM YYYY");

        schedule.close = function() {
            $mdDialog.cancel();
        };
    }
})();
