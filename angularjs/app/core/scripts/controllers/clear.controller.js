(function () {
    "use strict";

    angular
        .module("app")
        .controller("clearController", clearController);

    /* @ngInject */
    function clearController($rootScope, $scope, $state, $mdDialog, copyClearService, idForAction, calendarActionType) {
        var ccCtrl = this; // copy clear controller prefix, asigned in one place for all types of modal dialogs

        ccCtrl.typeOfAction = 0;
        ccCtrl.skip = "";
        ccCtrl.take = "";
        ccCtrl.includeInnerEvents = false;
        ccCtrl.personnelId = 0;
        ccCtrl.actionDisabled = false;

        ccCtrl.clearSchedule = function (agendaType) {
            if (ccCtrl.clearForm.$valid) {
                var modelToSave = {
                };
                if (agendaType === "day") {
                    modelToSave.Type = 1;
                    modelToSave.IncludeInnerBreaks = ccCtrl.includeInnerEvents;
                    modelToSave.DaySettings = {
                        Type: ccCtrl.typeOfAction
                    };
                    modelToSave.DaySettings.Date = $state.params.date ? moment.utc($state.params.date).toDate() : moment.utc().toDate();
                    if (ccCtrl.typeOfAction === 2) {
                        modelToSave.DaySettings.Custom = {
                            Skip: ccCtrl.skip,
                            Take: ccCtrl.take
                        }
                    }
                } else {
                    modelToSave.Type = 2;
                    //modelToSave.IncludeInnerBreaks = ccCtrl.includeInnerEvents;
                    modelToSave.WeekSettings = {
                        Type: ccCtrl.typeOfAction
                    };
                    modelToSave.WeekSettings.FromDate = $state.params.date ? moment.utc($state.params.date).toDate() : moment.utc().toDate();
                    if (ccCtrl.typeOfAction === 2) {
                        modelToSave.WeekSettings.Custom = {
                            Skip: ccCtrl.skip,
                            Take: ccCtrl.take
                        }
                    }
                }
                copyClearService.clearSchedule(modelToSave, calendarActionType, idForAction)
                    .then(function () {
                        $rootScope.$broadcast('fullCalendar.reload', 'true');
                        $mdDialog.hide();
                    });
            } else {
                angular.forEach(ccCtrl.clearForm.$error, function (error) {
                    angular.forEach(error, function (field) {
                        field.$setTouched();
                    });
                });
            }
        };



        var body = document.getElementsByTagName("body")[0];
        body.classList.add("has_modal");
        $scope.closeDialog = function () {
            $mdDialog.hide();
        }

        $scope.$watch(function () {
            return ccCtrl.typeOfAction;
        }, function (newValue) {
            if (newValue) {
                if (newValue !== 1) {
                    ccCtrl.skip = "";
                    ccCtrl.take = "";
                }
            }
        });
    };
})();