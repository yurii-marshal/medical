(function () {
    "use strict";

    angular
        .module("app")
        .controller("breakShortController", breakShortController);

    /* @ngInject */
    function breakShortController($scope, $mdDialog, date, appointment, save, remove, setupCenterManagementService, ngToast) {
        var breakCtrl = this;

        var isNewBreak = appointment === undefined || appointment === null;
        //Delete break reasons from setupCenters
        breakCtrl.breakReasons = false;
        // breakCtrl.breakReasons = setupCenterManagementService.getBreakReasons();
        breakCtrl.isScheduleAble = false;//eventsProfileService.getIsScheduleAble();

        //eventAddressService.setIsNarowStyle(true);

        breakCtrl.appointment = {};

        function activate() {
            if (!isNewBreak) {
                setupCenterManagementService.getBreakById(appointment.id)
                    .then(function(response) {
                        breakCtrl.appointment = {
                            id: appointment.id,
                            date: appointment.start.format("MM/DD/YYYY"),
                            start: appointment.start.format("hh:mm A"),
                            end: appointment.end.format("hh:mm A"),
                            description: appointment.description,
                            title: (appointment.reason.Description || appointment.reason.Text),
                            editable: appointment.editable
                        };
                    }, function(err) {

                    });
            } else {
                breakCtrl.appointment = {
                    id: 0,
                    date: date.format("MM/DD/YYYY"),
                    start: date.format("hh:mm A"),
                    end: date.add("1", "hours").format("hh:mm A"),
                    description: "",
                    title: "",
                    editable: true
                };
            }
        }

        activate();

        breakCtrl.save = function () {
            if (breakCtrl.editBreak.$valid) {
                save(breakCtrl.appointment)
                    .then(function (resolveMsg) {
                        ngToast.success(resolveMsg || 'Saved');
                        $mdDialog.hide();
                    });

            } else {
                angular.forEach(breakCtrl.editBreak.$error, function (error) {
                    angular.forEach(error, function (field) {
                        if (!field.$error) {
                            field.$setTouched();
                        }
                    });
                });
            }
        };

        breakCtrl.cancel = function () {
            $mdDialog.hide();
        };

        breakCtrl.delete = function () {
            remove(breakCtrl.appointment.id);
            $mdDialog.hide();
        };
    }
})();
