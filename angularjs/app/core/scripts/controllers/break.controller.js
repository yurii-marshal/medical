(function () {
    "use strict";

    angular
        .module("app")
        .controller("breakController", breakController);

    /* @ngInject */
    function breakController($scope,
                             $mdDialog,
                             date,
                             appointment,
                             save,
                             remove,
                             eventsProfileService,
                             eventAddressService,
                             geoAddressesService,
                             bsLoadingOverlayService,
                             reopenModalFn,
                             reopenModalData,
                             ngToast) {
        var breakCtrl = this;

        var isReopenModal = !!reopenModalData;
        var isNewBreak = appointment === undefined || appointment === null;
        breakCtrl.breakReasons = eventsProfileService.getBreakReasons();
        breakCtrl.isScheduleAble = eventsProfileService.getIsScheduleAble();
        breakCtrl.reopenModalFn = reopenModalFn;

        eventAddressService.setIsNarowStyle(true);

        breakCtrl.appointment = isReopenModal ? reopenModalData : {};

        if (!isNewBreak && !isReopenModal) {
            for (var i in breakCtrl.breakReasons) {
                if (breakCtrl.breakReasons[i].Id === appointment.reason.Id) {
                    appointment.reason = breakCtrl.breakReasons[i];
                }
            }
        }

        function activate() {
            if (isReopenModal) {
                return;
            }
            eventAddressService.clearModel();
            if (!isNewBreak) {
                eventsProfileService.getBreakById(appointment.id)
                    .then(function(response) {
                        breakCtrl.appointment = {
                            id: appointment.id,
                            date: appointment.start.format("MM/DD/YYYY"),
                            start: appointment.start.format("hh:mm A"),
                            end: appointment.end.format("hh:mm A"),
                            reason: appointment.reason,
                            description: appointment.description,
                            title: (appointment.reason.Description || appointment.reason.Text),
                            editable: appointment.editable
                        };
                        if (breakCtrl.isScheduleAble) {
                            if (response.data.DepartureAddress) {
                                breakCtrl.appointment.departureAddress = response.data.DepartureAddress;
                            } else {
                                breakCtrl.appointment.departureAddress = {
                                    AddressLine: "",
                                    AddressLine2: "",
                                    City: "",
                                    Zip: "",
                                    State: ""
                                };
                            }
                            if (response.data.ArrivalAddress) {
                                breakCtrl.appointment.arrivalAddress = response.data.ArrivalAddress;
                            } else {
                                breakCtrl.appointment.arrivalAddress = {
                                    AddressLine: "",
                                    AddressLine2: "",
                                    City: "",
                                    Zip: "",
                                    State: ""
                                };
                            }
                            eventAddressService.setDepartureAddress(breakCtrl.appointment.departureAddress);
                            eventAddressService.setArrivalAddress(breakCtrl.appointment.arrivalAddress);
                        }
                    });
            } else {
                breakCtrl.appointment = {
                    id: 0,
                    date: date.format("MM/DD/YYYY"),
                    start: date.format("hh:mm A"),
                    end: date.add("1", "hours").format("hh:mm A"),
                    reason: breakCtrl.breakReasons[0],
                    description: "",
                    title: "",
                    editable: true
                };
                if (breakCtrl.isScheduleAble) {
                    breakCtrl.appointment.departureAddress = {
                        AddressLine: "",
                        AddressLine2: "",
                        City: "",
                        Zip: "",
                        State: ""
                    };
                    breakCtrl.appointment.arrivalAddress = {
                        AddressLine: "",
                        AddressLine2: "",
                        City: "",
                        Zip: "",
                        State: ""
                    };
                    eventAddressService.setDepartureAddress(breakCtrl.appointment.departureAddress);
                    eventAddressService.setArrivalAddress(breakCtrl.appointment.arrivalAddress);
                }
            }
        }

        activate();

        breakCtrl.checkAddressAndSave = function() {
            var addressesArr = [];

            if (breakCtrl.appointment.departureAddress && breakCtrl.appointment.departureAddress.AddressLine) {
                addressesArr.push({
                    addressObj: breakCtrl.appointment.departureAddress,
                    modalTitle: 'Departure Address'
                });
            }

            if (breakCtrl.appointment.arrivalAddress && breakCtrl.appointment.arrivalAddress.AddressLine) {
                addressesArr.push({
                    addressObj: breakCtrl.appointment.arrivalAddress,
                    modalTitle: 'Arrival Address'
                });
            }

            if (addressesArr.length) {
                geoAddressesService.checkOrModifyAddresses(addressesArr)
                    .then(
                        function() {
                            return breakCtrl.saveConstraint();
                        },
                        function() {
                            breakCtrl.reopenModalFn(breakCtrl.appointment);
                        }
                    )
                    .finally(function() {
                        bsLoadingOverlayService.stop({ referenceId: 'breakModal' });
                    });
            } else {
                return breakCtrl.saveConstraint()
                    .finally(function() {
                        bsLoadingOverlayService.stop({ referenceId: 'breakModal' });
                    });
            }
        };

        breakCtrl.saveConstraint = function() {
            return save(breakCtrl.appointment)
                .then(function(resolveMsg) {
                    $mdDialog.hide();
                    eventAddressService.clearModel();
                    ngToast.success(resolveMsg || 'Saved');
                });
        };

        breakCtrl.save = function () {
            if (breakCtrl.editBreak.$valid) {

                bsLoadingOverlayService.start({ referenceId: 'breakModal' });

                if (breakCtrl.isScheduleAble) {
                    breakCtrl.appointment.departureAddress = eventAddressService.getDepartureAddress();
                    breakCtrl.appointment.arrivalAddress = eventAddressService.getArrivalAddress();
                } else {
                    breakCtrl.appointment.departureAddress = undefined;
                    breakCtrl.appointment.arrivalAddress = undefined;
                }

                breakCtrl.checkAddressAndSave();

            } else {
                angular.forEach(breakCtrl.editBreak.$error, function (error) {
                    angular.forEach(error, function (field) {
                        if (!field.$error) {
                            field.$setTouched();
                        }
                    });
                });
                if (breakCtrl.editBreak.addressForm) {
                    angular.forEach(breakCtrl.editBreak.addressForm.$error, function(error) {
                        angular.forEach(error, function(field) {
                            field.$setTouched();
                        });
                    });
                }
            }
        };

        breakCtrl.cancel = function () {
            eventAddressService.clearModel();
            $mdDialog.hide();
        };

        breakCtrl.delete = function () {
            remove(breakCtrl.appointment.id)
            .then(function(resolveMsg) {
                    ngToast.success(resolveMsg || 'Deleted');
                });
            eventAddressService.clearModel();
            $mdDialog.hide();
        };
    }
})();
