export default class HoursModalController {
    constructor($mdDialog,
                $rootScope,
                eventsProfileService,
                bsLoadingOverlayService,
                ngToast,
                eventAddressService,
                geoAddressesService,
                $timeout,
                locObj,
                reopenModal) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.eventAddressService = eventAddressService;
        this.eventsProfileService = eventsProfileService;
        this.geoAddressesService = geoAddressesService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.reopenModal = reopenModal;
        this.locObj = locObj;

        this.isLoading = false;
        this.date = locObj.date;
        this.personnelId = locObj.personnelId;
        this.workingHours = !locObj.isOnCallHours;
        this.isOnlyView = locObj.action && locObj.action === 'view';

        this.isScheduleAble = eventsProfileService.getIsScheduleAble();

        this.successText = '';
        this.deleteText = '';

        if (locObj.id) {
            if (this.workingHours) {
                this.successText = 'Working hours are successfully updated.';
                this.deleteText = 'Working hours are successfully deleted.';
            } else {
                this.successText = 'On-Call hours are successfully updated.';
                this.deleteText = 'On-Call hours are successfully deleted.';
            }
        } else {
            if (this.workingHours) {
                this.successText = 'Working hours are successfully created.';
            } else {
                this.successText = 'On-Call hours are successfully created.';
            }
        }

        eventAddressService.setIsNarowStyle(false);
        this._activate();

        $timeout(() => {
            $('md-dialog').animate({
                scrollTop: 0
            }, 300);
        }, 600);
    }

    _activate() {
        if (this.locObj.isReopenModal) {
            this.constraintVm = this.locObj;
            this.constraint = this.constraintVm.savedConstraint;
        } else {
            this.eventAddressService.clearModel();
            this.constraint = {
                id: '',
                start: !this.locObj.id ? this._setTime(this.locObj.time, 'start') : '',
                end: !this.locObj.id ? this._setTime(this.locObj.time, 'end') : '',
                date: this.locObj.date !== '' ? moment(this.locObj.date, 'YYYY-MM-DD').format('MM/DD/YYYY') : ''
            };
            this._getCleanModel();
        }

        if (this.locObj.id) {
            this.bsLoadingOverlayService.start({ referenceId: 'hoursModal' });

            let runFunc = (
                this.workingHours
                    ? this.eventsProfileService.getConstraintById.bind(this.eventsProfileService)
                    : this.eventsProfileService.getExtraConstraintById.bind(this.eventsProfileService)
            );

            runFunc(this.locObj.id)
                .then((constraint) => {
                    angular.extend(constraint, { Id: this.locObj.id });
                    this._setConstraints(constraint);
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'hoursModal' }));

        } else {
            if (this.isScheduleAble) {
                this.eventAddressService.setDepartureAddress(this.constraintVm.DepartureAddress);
                this.eventAddressService.setArrivalAddress(this.constraintVm.ArrivalAddress);
            }
        }
    }

    _getCleanModel() {
        this.constraintVm = {
            Id: this.locObj.id,
            Range: {
                From: '',
                To: ''
            },
            Description: ''
        };
        if (this.isScheduleAble) {
            const newAddressModel = {
                AddressLine: '',
                AddressLine2: '',
                City: '',
                Zip: '',
                State: ''
            };

            this.constraintVm.DepartureAddress = angular.copy(newAddressModel);
            this.constraintVm.ArrivalAddress = angular.copy(newAddressModel);
        }
    }

    _setConstraints(constraint) {
        this.constraint.id = constraint.Id;
        this.constraintVm = constraint;
        const newAddressModel = {
            AddressLine: '',
            AddressLine2: '',
            City: '',
            Zip: '',
            State: ''
        };

        if (this.isScheduleAble) {
            if (!this.constraintVm.DepartureAddress) {
                this.constraintVm.DepartureAddress = angular.copy(newAddressModel);
            }
            if (!this.constraintVm.ArrivalAddress) {
                this.constraintVm.ArrivalAddress = angular.copy(newAddressModel);
            }
            this.eventAddressService.setDepartureAddress(this.constraintVm.DepartureAddress);
            this.eventAddressService.setArrivalAddress(this.constraintVm.ArrivalAddress);
        }
        this.constraint.start = moment(this.constraintVm.Range.From, 'YYYY-MM-DDTHH:mm').format('hh:mm A');
        this.constraint.end = moment(this.constraintVm.Range.To, 'YYYY-MM-DDTHH:mm').format('hh:mm A');
        this.constraint.date = moment(this.constraintVm.Range.From).format('MM/DD/YYYY');
    }

    _checkAddressAndSave() {
        let addressesArr = [];

        if (this.constraintVm.DepartureAddress && this.constraintVm.DepartureAddress.AddressLine) {
            addressesArr.push({
                addressObj: this.constraintVm.DepartureAddress,
                modalTitle: 'Departure Address'
            });
        }

        if (this.constraintVm.ArrivalAddress && this.constraintVm.ArrivalAddress.AddressLine) {
            addressesArr.push({
                addressObj: this.constraintVm.ArrivalAddress,
                modalTitle: 'Arrival Address'
            });
        }

        if (addressesArr.length) {
            this.geoAddressesService.checkOrModifyAddresses(addressesArr)
                .then(() => this._saveConstraint(), () => {
                    this.constraintVm.isReopenModal = true;
                    this.constraintVm.date = this.date;
                    this.constraintVm.personnelId = this.personnelId;
                    this.constraintVm.savedConstraint = this.constraint;
                    this.reopenModal(angular.extend(this.locObj, this.constraintVm));
                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'hoursModal' });
                });
        } else {
            return this._saveConstraint();
        }

    }

    _saveConstraint() {
        let promise = this.workingHours
            ? this.eventsProfileService.saveConstraint.bind(this.eventsProfileService)
            : this.eventsProfileService.saveExtraConstraint.bind(this.eventsProfileService);

        return promise(this.constraintVm, this.locObj.personnelId)
            .then((response) => {
                this.$rootScope.$broadcast('fullCalendar.reload', 'true');
                this.$mdDialog.hide();
                this.ngToast.success(this.successText);
                return response;
            })
            .catch((err) => err)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'hoursModal' }));
    }

    _setTime(time, type) {
        switch (type) {
            case 'start':
                return !time ? '07:00 AM' : moment(time, 'hh-mm-a').format('hh:mm A');
            case 'end':
                return !time ? '07:00 PM' : moment(time, 'hh-mm-a').add(1, 'h').format('hh:mm A');
            default:
                return;
        }
    }

    save() {
        if (!this.locObj.personnelId) {
            this.ngToast.danger('PersonnelId is empty.');
            return false;
        }

        if (this.editForm.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'hoursModal' });

            let date = moment(this.constraint.date, 'MM-DD/YYYY').format('YYYY-MM-DD');

            this.constraintVm.Range.From = `${date}T${moment(this.constraint.start, 'hh:mm A').format('HH:mm')}`;
            this.constraintVm.Range.To = `${date}T${moment(this.constraint.end, 'hh:mm A').format('HH:mm')}`;

            if (this.isScheduleAble) {
                this.constraintVm.DepartureAddress = this.eventAddressService.getDepartureAddress();
                this.constraintVm.ArrivalAddress = this.eventAddressService.getArrivalAddress();
            } else {
                this.constraintVm.DepartureAddress = undefined;
                this.constraintVm.ArrivalAddress = undefined;
            }

            this._checkAddressAndSave();

        } else {
            touchedErrorFields(this.editForm.addressForm);
        }
    }

    delete() {
        this.bsLoadingOverlayService.start({ referenceId: 'hoursModal' });

        let runFunc = (
            this.workingHours
                ? this.eventsProfileService.deleteConstraint.bind(this.eventsProfileService)
                : this.eventsProfileService.deleteExtraConstraint.bind(this.eventsProfileService)
        );

        runFunc(this.constraintVm.Id)
            .then(() => {
                this.eventAddressService.clearModel();
                this.ngToast.success(this.deleteText);
                this.$rootScope.$broadcast('fullCalendar.reload', 'true');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'hoursModal' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }

}
