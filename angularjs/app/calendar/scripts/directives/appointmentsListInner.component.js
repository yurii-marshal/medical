(function () {
    "use strict";

    angular
        .module("app.calendar")
        .component('appointmentListInner', {
            templateUrl: 'calendar/views/appointment/appointmentListInner.component.html',
            controller: appointmentListInnerCtrl,
            bindings: {
                appointments: "<",
                choosenAppointment: "<",
                chooseAppointmentFunc: "=",
                isViewAll: "<"
            }
        });

    /* @ngInject */
    function appointmentListInnerCtrl($filter, $timeout) {
        var ctrl = this;
        var selected = ctrl.choosenAppointment;

        ctrl.click = function (item) {
            selected = item;
            ctrl.chooseAppointmentFunc(item);
        };

        ctrl.isActive = function (item) {
            return selected === item;
        };
    }
})();
