(function () {
    'use strict';

    angular
        .module('app.management.service_center')
        .controller('appointPersonnelModalController', appointPersonnelModalController);

    /* @ngInject */
    function appointPersonnelModalController(
        $scope,
        $state,
        $q,
        bsLoadingOverlayService,
        setupCenterAppointmentService,
        setupCenterManagementService,
        ngToast,
        $mdDialog,
        $filter,
        centerId,
        eventId
    ) {

        var appointPersonnel = this;

        appointPersonnel.isEditMode = false;

        appointPersonnel.selectedPersonnel = null;
        appointPersonnel.searchTextPersonnel = undefined;
        appointPersonnel.description = "";
        appointPersonnel.toggleRepeat = false; // is repeat enabled
        appointPersonnel.repeatPatternsType = [];
        appointPersonnel.repeatPatternsDaily = [];
        appointPersonnel.repeatPatternsMonthly = [];
        appointPersonnel.weekDaysDictionary = [];
        appointPersonnel.monthlyRepeat = 1;
        appointPersonnel.dailyRepeat = 1;
        appointPersonnel.dailyRepeat_EveryDay = 1;
        appointPersonnel.weeklyRepeat_EveryWeek = 1;
        appointPersonnel.weeklyRepeat_daySunday = false;
        appointPersonnel.weeklyRepeat_dayMonday = false;
        appointPersonnel.weeklyRepeat_dayTuesday = false;
        appointPersonnel.weeklyRepeat_dayWednesday = false;
        appointPersonnel.weeklyRepeat_dayThursday = false;
        appointPersonnel.weeklyRepeat_dayFriday = false;
        appointPersonnel.weeklyRepeat_daySaturday = false;
        appointPersonnel.monthlyRepeat_EveryDay_MonthsDay = "";
        appointPersonnel.monthlyRepeat_EveryDay_Months = 1;
        appointPersonnel.monthlyRepeat_SpecificDay_DayStart = "";
        appointPersonnel.monthlyRepeat_SpecificDay_DayOption = "";
        appointPersonnel.monthlyRepeat_SpecificDay_Months = 1;

        appointPersonnel.daysNumberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
        appointPersonnel.startRangeOfRepetitionStart = moment().format('L');
        appointPersonnel.startRangeOfRepetition = 1;
        appointPersonnel.endRangeOfRepetitionOccurances = 1;
        appointPersonnel.startRangeOfRepetitionEnd = "";

        appointPersonnel.repeatOption = '';
        appointPersonnel.specialDates = [""];

        appointPersonnel.setupCenterList = [];
        appointPersonnel.selectedSetupCenter = null;

        $scope.$watch(function () {
            return appointPersonnel.toggleRepeat;
        }, function (newVal) {
            if (!newVal) {
                setDefaultRepeatSection();
            }
        });

        $scope.$watch(function () {
            return appointPersonnel.startRangeOfRepetition;
        }, function () {
            setDefaultRepetitionRange();
        });

        $scope.$watch(function () {
            return appointPersonnel.repeatOption;
        }, function () {
            setDefaultRepeatOption();
        });

        $scope.$watch(function () {
            return appointPersonnel.dailyRepeat;
        }, function () {
            setDefaultRepeatDaily();
        });

        $scope.$watch(function () {
            return appointPersonnel.monthlyRepeat;
        }, function () {
            setDefaultRepeatMonthly();
        });

        function setDefaultRepeatSection() {
            appointPersonnel.repeatOption = undefined;
            appointPersonnel.dailyRepeat = 1;
            appointPersonnel.monthlyRepeat = 1;
            appointPersonnel.startRangeOfRepetition = 1;

            setDefaultRepeatOption();
            setDefaultRepetitionRange();
        }

        function setDefaultRepeatOption() {
            setDefaultRepeatDaily();
            setDefaultRepeatWeekly();
            setDefaultRepeatMonthly();
        }

        function setDefaultRepeatDaily() {
            appointPersonnel.dailyRepeat_EveryDay = 1;
            appointPersonnel.specialDates = [""];
        }

        function setDefaultRepeatWeekly() {
            appointPersonnel.weeklyRepeat_EveryWeek = 1;
            angular.forEach(appointPersonnel.weekDaysDictionary, function (item) {
                item.isChecked = false;
            });
        }

        function setDefaultRepeatMonthly() {
            appointPersonnel.monthlyRepeat_EveryDay_MonthsDay = undefined;
            appointPersonnel.monthlyRepeat_EveryDay_Months = 1;
            appointPersonnel.monthlyRepeat_SpecificDay_DayStart = undefined;
            appointPersonnel.monthlyRepeat_SpecificDay_DayOption = undefined;
            appointPersonnel.monthlyRepeat_SpecificDay_Months = 1;
        }

        function setDefaultRepetitionRange() {
            appointPersonnel.endRangeOfRepetitionOccurances = 1;
            appointPersonnel.startRangeOfRepetitionEnd = undefined;
        }

        appointPersonnel.getPersonnelByName = function(query) {
            return setupCenterAppointmentService.getPersonnelDictionaryPromise(query).then(function(response) {
                if (response) {
                    return response.data.Items;
                }
                return [];
            });
        };

        function getSetupCenters() {
            setupCenterManagementService.getSetupCenterListPromise().then(function(res) {
                appointPersonnel.setupCenterList = res.data.Items;
            });
        }

        function activate() {
            bsLoadingOverlayService.start({ referenceId: 'appointPersonnel' });
            setupCenterAppointmentService.getAllRepeatPatterns().then(function(rptPatterns) {
                if (rptPatterns && rptPatterns.length === 4) {
                    appointPersonnel.repeatPatternsType = rptPatterns[0];
                    appointPersonnel.repeatPatternsDaily = rptPatterns[1];
                    appointPersonnel.repeatPatternsMonthly = rptPatterns[2];
                    appointPersonnel.weekDaysDictionary = rptPatterns[3];

                    if (eventId && eventId > 0) {
                        appointPersonnel.isEditMode = true;
                        fillModel();
                    }
                }
            }, function () { }).then(function() {
                bsLoadingOverlayService.stop({ referenceId: "appointPersonnel" });
            });

            getSetupCenters();
        }

        activate();

        appointPersonnel.addSpecialDate = function() {

            var haveEmpty = false;

            for (var i = 0; i < appointPersonnel.specialDates.length; i++) {
                if (appointPersonnel.specialDates[i] === "") {
                    haveEmpty = true;
                }
            }

            if (!haveEmpty) {
                appointPersonnel.specialDates.push("");
            }
        };

        appointPersonnel.removeSpecialDate = function(index) {
            appointPersonnel.specialDates.splice(index, 1);
        };

        function generateModel() {
            var modelToSave = {};
            modelToSave.PersonnelId = appointPersonnel.selectedPersonnel.Id;
            modelToSave.SetupCenterId = centerId;

            modelToSave.Description = appointPersonnel.description;
            modelToSave.TimeRange = {
                From: moment(appointPersonnel.start, "hh:mm A").format("HH:mm"),
                To: moment(appointPersonnel.end, "hh:mm A").format("HH:mm")
            };

            if (appointPersonnel.toggleRepeat) {
                modelToSave.RepeatPattern = {};
                modelToSave.RepeatPattern.EventRepeatTypeValue = appointPersonnel.repeatOption;
                if (appointPersonnel.repeatOption == 1) { //daily
                    modelToSave.RepeatPattern.RepeatPatternDaily = {};
                    modelToSave.RepeatPattern.RepeatPatternDaily.RepeatTypeValue = appointPersonnel.dailyRepeat;
                    if (appointPersonnel.dailyRepeat == 1) { // every days
                        modelToSave.RepeatPattern.RepeatPatternDaily.EveryDayNumber = appointPersonnel.dailyRepeat_EveryDay;
                    } else if (appointPersonnel.dailyRepeat == 3) { // special days
                        modelToSave.RepeatPattern.RepeatPatternDaily.SpecificDates = appointPersonnel.specialDates.map(function (item) {
                            return moment(item, "MM/DD/YYYY").format('YYYY-MM-DDTHH:mm:ss');
                        });
                    }
                } else if (appointPersonnel.repeatOption == 2) { //weekly
                    modelToSave.RepeatPattern.RepeatPatternWeekly = {};
                    modelToSave.RepeatPattern.RepeatPatternWeekly.EveryWeekNumber = appointPersonnel.weeklyRepeat_EveryWeek;
                    modelToSave.RepeatPattern.RepeatPatternWeekly.WeekDays = [];

                    for (var i = 0; i < appointPersonnel.weekDaysDictionary.length; i++) {
                        if (appointPersonnel.weekDaysDictionary[i].isChecked) {
                            modelToSave.RepeatPattern.RepeatPatternWeekly.WeekDays.push(appointPersonnel.weekDaysDictionary[i].Id);
                        }
                    }
                } else if (appointPersonnel.repeatOption == 3) { //monthly
                    modelToSave.RepeatPattern.RepeatPatternMonthly = {};
                    modelToSave.RepeatPattern.RepeatPatternMonthly.RepeatTypeValue = appointPersonnel.monthlyRepeat;
                    if (appointPersonnel.monthlyRepeat == 1) { // Day of every month
                        modelToSave.RepeatPattern.RepeatPatternMonthly.Day = appointPersonnel.monthlyRepeat_EveryDay_MonthsDay;
                        modelToSave.RepeatPattern.RepeatPatternMonthly.EveryMonthNumber = appointPersonnel.monthlyRepeat_EveryDay_Months;

                    } else if (appointPersonnel.monthlyRepeat == 2) { // Specific day of every month
                        modelToSave.RepeatPattern.RepeatPatternMonthly.RepeatDayType = appointPersonnel.monthlyRepeat_SpecificDay_DayStart;
                        modelToSave.RepeatPattern.RepeatPatternMonthly.WeekDay = appointPersonnel.monthlyRepeat_SpecificDay_DayOption;
                        modelToSave.RepeatPattern.RepeatPatternMonthly.EveryMonthNumber = appointPersonnel.monthlyRepeat_SpecificDay_Months;
                    }
                }
            }
            modelToSave.RepeatSettings = {};
            modelToSave.RepeatSettings.StartDate = moment(appointPersonnel.startRangeOfRepetitionStart, "MM/DD/YYYY").format('YYYY-MM-DDTHH:mm:ss');
            if (appointPersonnel.startRangeOfRepetition == 1) {
                modelToSave.RepeatSettings.EndAfterNumber = appointPersonnel.endRangeOfRepetitionOccurances;
            } else if (appointPersonnel.startRangeOfRepetition == 2) {
                modelToSave.RepeatSettings.EndAfterDate = moment(appointPersonnel.startRangeOfRepetitionEnd, "MM/DD/YYYY").format('YYYY-MM-DDTHH:mm:ss');
            }
            return modelToSave;
        }

        function fillModel() {
            setupCenterAppointmentService.getAppointmentPromise(eventId).then(function(response) {
                if (response) {

                    appointPersonnel.selectedPersonnel = {
                        Text: response.data.Personnel.Name.FullName,
                        Id: response.data.Personnel.Id
                    };
                    appointPersonnel.searchTextPersonnel = response.data.Personnel.Name.FullName;
                    appointPersonnel.description = response.data.Description;

                    appointPersonnel.start = moment(response.data.TimeRange.From, "HH:mm:ss").format("hh:mm A");
                    appointPersonnel.end = moment(response.data.TimeRange.To, "HH:mm:ss").format("hh:mm A");

                    //appointPersonnel.startRangeOfRepetitionStart = moment.utc(response.data.RepeatSettings.StartDate).format("MM/DD/YYYY");
                    appointPersonnel.startRangeOfRepetitionStart = $filter("amUtc")(response.data.RepeatSettings.StartDate);
                    appointPersonnel.startRangeOfRepetitionStart = $filter("amDateFormat")(appointPersonnel.startRangeOfRepetitionStart, "MM/DD/YYYY");

                    if (response.data.RepeatSettings.EndAfterDate) {
                        appointPersonnel.startRangeOfRepetition = 2;
                        //appointPersonnel.startRangeOfRepetitionEnd = moment.utc(response.data.RepeatSettings.EndAfterDate).format("MM/DD/YYYY");
                        appointPersonnel.startRangeOfRepetitionEnd = $filter("amUtc")(response.data.RepeatSettings.EndAfterDate);
                        appointPersonnel.startRangeOfRepetitionEnd = $filter("amDateFormat")(appointPersonnel.startRangeOfRepetitionEnd, "MM/DD/YYYY");
                        //appointPersonnel.startRangeOfRepetitionEnd = $filter("amDateFormat")(response.data.RepeatSettings.EndAfterDate.StartDate, "MM/DD/YYYY");
                    } else {
                        appointPersonnel.startRangeOfRepetition = 1;
                        if (response.data.RepeatSettings.EndAfterNumber) {
                            appointPersonnel.endRangeOfRepetitionOccurances = response.data.RepeatSettings.EndAfterNumber;
                        } else {
                            appointPersonnel.endRangeOfRepetitionOccurances = 1;
                        }
                    }

                    if (response.data.RepeatPattern) {
                        appointPersonnel.toggleRepeat = true;
                        appointPersonnel.repeatOption = response.data.RepeatPattern.EventRepeatTypeValue;
                        if (appointPersonnel.repeatOption == 1) {
                            appointPersonnel.dailyRepeat = response.data.RepeatPattern.RepeatPatternDaily.RepeatTypeValue;
                            if (appointPersonnel.dailyRepeat == 1) { // every days
                                appointPersonnel.dailyRepeat_EveryDay = response.data.RepeatPattern.RepeatPatternDaily.EveryDayNumber;
                            } else if (appointPersonnel.dailyRepeat == 3) { // special days
                                appointPersonnel.specialDates = response.data.RepeatPattern.RepeatPatternDaily.SpecificDates
                                    .map(function(item) {
                                        return moment(item).format("MM/DD/YYYY");
                                    });
                            }
                        } else if (appointPersonnel.repeatOption == 2) {
                            appointPersonnel.weeklyRepeat_EveryWeek = response.data.RepeatPattern.RepeatPatternWeekly.EveryWeekNumber;
                            if (response.data.RepeatPattern.RepeatPatternWeekly.WeekDays) {
                                angular.forEach(response.data.RepeatPattern.RepeatPatternWeekly.WeekDays, function(value) {
                                    var _day = _.find(appointPersonnel.weekDaysDictionary, function(item) {
                                        return item.Id == value;
                                    });
                                    if (_day) {
                                        _day.isChecked = true;
                                    }
                                });
                            }
                        } else if (appointPersonnel.repeatOption == 3) {
                            appointPersonnel.monthlyRepeat = response.data.RepeatPattern.RepeatPatternMonthly.RepeatTypeValue;
                            if (appointPersonnel.monthlyRepeat == 1) { // every days
                                appointPersonnel.monthlyRepeat_EveryDay_MonthsDay = response.data.RepeatPattern.RepeatPatternMonthly.Day;
                                appointPersonnel.monthlyRepeat_EveryDay_Months = response.data.RepeatPattern.RepeatPatternMonthly.EveryMonthNumber;
                            } else if (appointPersonnel.monthlyRepeat == 2) { // special days
                                appointPersonnel.monthlyRepeat_SpecificDay_DayStart = response.data.RepeatPattern.RepeatPatternMonthly.RepeatDayType;
                                appointPersonnel.monthlyRepeat_SpecificDay_DayOption = response.data.RepeatPattern.RepeatPatternMonthly.WeekDay;
                                appointPersonnel.monthlyRepeat_SpecificDay_Months = response.data.RepeatPattern.RepeatPatternMonthly.EveryMonthNumber;
                            }
                        }
                    }
                }
            }, function () { }).then(function() {
                bsLoadingOverlayService.stop({ referenceId: 'appointPersonnel' });
            });
        }

        appointPersonnel.deleteEvent = function() {
            bsLoadingOverlayService.start({ referenceId: 'appointPersonnel' });
            setupCenterAppointmentService.deleteAppointmentPromise(eventId, false).then(function () {
                ngToast.success('Appointment deleted.');
                $mdDialog.hide();
            }, function () {}).then(function () {
                bsLoadingOverlayService.stop({ referenceId: 'appointPersonnel' });
            });
        }

        appointPersonnel.deleteEventAll = function () {
            bsLoadingOverlayService.start({ referenceId: 'appointPersonnel' });
            setupCenterAppointmentService.deleteAppointmentPromise(eventId, true).then(function() {
                ngToast.success('Appointments deleted.');
                $mdDialog.hide();
            }, function () {}).then(function () {
                bsLoadingOverlayService.stop({ referenceId: 'appointPersonnel' });
            });
        }

        appointPersonnel.save = function () {

            if ($scope.newAppointmentForm.$valid) {
                bsLoadingOverlayService.start({ referenceId: 'appointPersonnel' });

                var modelToSave = generateModel();

                if (eventId) {

                    modelToSave.UpdateOneEvent = !appointPersonnel.toggleRepeat;

                    modelToSave.Id = eventId;

                    setupCenterAppointmentService.updateAppointmentPromise(eventId, modelToSave).then(function(response) {
                        ngToast.success('Appointment updated.');
                        $mdDialog.hide();
                    }, function(err) {
                    }).then(function () {
                        bsLoadingOverlayService.stop({ referenceId: 'appointPersonnel' });
                    });

                } else {
                    setupCenterAppointmentService.saveAppointmentPromise(modelToSave).then(function (response) {
                        ngToast.success('Appointment created.');
                        $mdDialog.hide();
                    }, function(err) {
                    }).then(function () {
                        bsLoadingOverlayService.stop({ referenceId: 'appointPersonnel' });
                    });
                }

            } else {
                angular.forEach($scope.newAppointmentForm.$error, function (error) {
                    angular.forEach(error, function (field) {
                        field.$setTouched();
                    });
                });
            }
        };

        appointPersonnel.showModal = function(ev) {
            ev.stopPropagation();
            $mdDialog.show({
                controller: DialogController,
                controllerAs: 'modal',
                templateUrl: 'core/views/templates/confirmDeleteEvent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });

            function DialogController($mdDialog) {

                var modal = this;

                modal.deleteOption = 1;

                modal.save = function(del) {
                    if (del == 1) {
                        appointPersonnel.deleteEvent();
                    } else if (del == 2) {
                        appointPersonnel.deleteEventAll();
                    }
                    $mdDialog.hide();
                }

                modal.cancel = function() {
                    $mdDialog.cancel();
                }
            }
        }

        appointPersonnel.cancel = function () {
            $mdDialog.cancel();
        };

    }
})();
