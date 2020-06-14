(function () {
    "use strict";

    angular
        .module("app.calendar")
        .component('appointmentsList', {
            templateUrl: 'calendar/views/appointment/appointmentList.directive.html',
            controller: newAppointmentAppointmentsListCtrl,
            bindings: {
                appointments: '<',
                choosenAppointment: '=',
                isSelectedAppointment: '='
            }
        });

    /* @ngInject */
    function newAppointmentAppointmentsListCtrl($timeout, $filter) {
        var ctrl = this;

        init();

        //For select appointment transformation
        ctrl.chooseAppointmentFunc = function (appointment) {
            var _appointment = appointment;

            var smallPath = '';

            if (!appointment.EventAddress.FullAddress) {
                smallPath = appointment.EventAddress;
                _appointment.EventAddress.FullAddress = $filter("addressToString")(_appointment.EventAddress);
            }

            if (!appointment.Personnel.Name.FullName) {
                smallPath = appointment.Personnel.Name;
                _appointment.Personnel.Name.FullName = smallPath.First + ' ' + smallPath.Last;
            }

            //hack for digest start
            $timeout(function () {
                ctrl.choosenAppointment = _appointment;
                ctrl.isSelectedAppointment = true;
            }, 0);

        };


        //Use for filtration by selected params
        ctrl.appointmentsFilter = function (appointment) {
            //Filter appointments by Date (example:2016/07/11)
            //Filter appointments by Time (morning from 00:00 to 12:00)
            return passFilterByDate(appointment, ctrl.appointmentDateActive)
                && passFilterByTime(appointment, ctrl.appointmentTimeActive);

        };

        //Select filter by date
        ctrl.applyFilterByDate = function (item) {
            ctrl.showAppointments = false;
            ctrl.appointmentDateActive = item;
            ctrl.appointmentsHours = generateAppintmentsHours(ctrl.appointments, ctrl.appointmentDateActive);
            ctrl.filteredAppointments = _.filter(ctrl.appointments, ctrl.appointmentsFilter);

            $timeout(function(){
                ctrl.showAppointments = true;
            },0);

        };

        //Select filter by time
        ctrl.applyFilterByTime = function (item) {
            ctrl.showAppointments = false;
            ctrl.appointmentTimeActive = item;
            ctrl.filteredAppointments = _.filter(ctrl.appointments, ctrl.appointmentsFilter);

            $timeout(function(){
                ctrl.showAppointments = true;
            },0);
        };

        function init() {
            ctrl.showAppointments = false;

            ctrl.appointmentsDates = [{
                "UnixDate": 0,
                "Date": undefined,
                "viewAll": true
            }];
            ctrl.appointmentDateActive = ctrl.appointmentsDates[0];

            _.map(ctrl.appointments, function (appointment) {

                //Parse YYYY-MM-DD, hh, mm
                var regex = /(\d+-\d+-\d+)T(\d+):(\d+)/gi;
                var parsedDateObject = regex.exec(appointment.Date.From);

                //get unix time for current date for 00:00:00 time
                var dateStr = parsedDateObject[1] + "T00:00:00Z";
                var UnixDate = moment(dateStr).valueOf();

                //add only unic value of date to filter
                if (!_.findLastKey(ctrl.appointmentsDates, {UnixDate: UnixDate})) {
                    var startDateMoment = moment(appointment.Date.From).utc();
                    ctrl.appointmentsDates.push({
                        "UnixDate": UnixDate,
                        "Date": startDateMoment.format("MMMM DD[,] YYYY"),
                        "DayOfWeek": startDateMoment.format("dddd")
                    });
                }

                //for filterByDate
                //add in appointment value for FilterByDate
                appointment.UnixDate = UnixDate;

                //for filterByTime
                //get hours from date: 2016-01-01 01:30pm => 13.5
                appointment.eventStartHours = parsedDateObject[2]*1 + parsedDateObject[3]/60;

                return appointment;
            });

            ctrl.appointmentsHours = generateAppintmentsHours(ctrl.appointments, ctrl.appointmentDateActive);
            ctrl.appointmentTimeActive = ctrl.appointmentsHours[0];

            ctrl.filteredAppointments = _.filter(ctrl.appointments, ctrl.appointmentsFilter);
            $timeout(function() {
                ctrl.showAppointments = true;
            },0);

        }

    }

    function passFilterByDate(appointment, appointmentDateActive) {
        //if filter isn't set
        if (!appointmentDateActive || !appointmentDateActive.UnixDate) return true;

        return appointment.UnixDate === appointmentDateActive.UnixDate
    }

    function passFilterByTime(appointment, appointmentTimeActive) {
        //if filter isn't set or id = 0
        if (!appointmentTimeActive || !appointmentTimeActive.Id) return true;

        return (appointment.eventStartHours >= appointmentTimeActive.StartTimeHours)
            && (appointment.eventStartHours < appointmentTimeActive.EndTimeHours);
    }

    function generateAppintmentsHours(appointments, fiterDate) {

        var timeIntervalsArr = getTimeTemplate();

        var filteredAppointments = _.filter(appointments, function (item) {
            return passFilterByDate(item, fiterDate)
        });

        //calculate count for all time interval
        angular.forEach(filteredAppointments, function (appointment) {
            _.map(timeIntervalsArr, function (timeInterval) {
                if (passFilterByTime(appointment, timeInterval)) {
                    timeInterval.Count++;
                }
                return timeInterval;
            });
        });

        return timeIntervalsArr;
    }

    function getTimeTemplate() {
        return [
            {
                "Text": "View All",
                "Id": 0,
                "Count": 0
            },
            {
                "Text": "Morning",
                "Id": 1,
                "Count": 0,
                "StartTimeHours": 0,
                "EndTimeHours": 12
            },
            {
                "Text": "Afternoon",
                "Id": 2,
                "Count": 0,
                "StartTimeHours": 12,
                "EndTimeHours": 16
            },
            {
                "Text": "Evening",
                "Id": 3,
                "Count": 0,
                "StartTimeHours": 16,
                "EndTimeHours": 24
            }
        ];
    }


})();
