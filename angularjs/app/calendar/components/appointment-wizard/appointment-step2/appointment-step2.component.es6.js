import template from './appointment-step2.inner.html';

class AppointmentStep2Ctrl {

    constructor(
        $scope,
        $filter,
        $state,
        ngToast,
        bsLoadingOverlayService,
        calendarAppointmentService
    ) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.calendarAppointmentService = calendarAppointmentService;
        this.$filter = $filter;
        this.$state = $state;
        this.ngToast = ngToast;

        this.model = calendarAppointmentService.getModel();
        this.isPastDate = moment(this.appoitmentDate).isBefore(moment());
        this.appoitmentDate = this.isPastDate ? moment().format('MM/DD/YYYY') : this.appoitmentDate;
        this.isAppointmentTimeManually = false;
        this.startDate = this.appoitmentDate;
        this.appointmentAddress = [];
        this.personnelIds = $state.params.personnelIds ? $state.params.personnelIds.split(',') : [];

        // Service centers
        this.serviceCenters = [];
        this.serviceCenterIds = [];
        this.serviceCentersList = [];
        this.serviceCentersFilters = {
            Name: '',
            searchAddress: ''
        };

        // Enum for location types
        this.locationTypes = {
            patientAddress: 1,
            serviceCenter: 2
        };

        $scope.$watch(() => {
            return this.serviceCenters;
        }, (newVal) => {

            if (newVal) {
                this.serviceCentersList = angular.copy(this.serviceCenters);
            }
        });

        $scope.$watchCollection(() => {
            return [
                this.isAppointmentTimeManually,
                this.appoitmentDate,
                this.timeFrom,
                this.selectedServiceCenter,
                this.selectedEventLocation,
                this.isTeamMemberRequired
            ];
        }, () => {
            this.person = undefined;
            this.choosenAppointment = undefined;
            this.isPersonnelBlockShow = false;
            if (this.appoitmentDate && this.timeFrom) {
                if ((this.selectedEventLocation === this.locationTypes.serviceCenter && this.selectedServiceCenter)
                    || (this.selectedEventLocation === this.locationTypes.patientAddress && this.isAppointmentTimeManually)) {
                    this.getPersonnel();
                }
            }

            if (this.selectedEventLocation !== this.locationTypes.serviceCenter) {
                this.isTeamMemberRequired = false;
            }

            if (this.isTeamMemberRequired
                && this.selectedServiceCenter
                && this.isAppointmentTimeManually) {

                this.selectPersonnel();
            }
        });

        // Manual
        $scope.$watchCollection(() => {
            return [
                this.appoitmentDate,
                this.timeFrom,
                this.selectedEventLocation
            ];
        }, () => {
            if (this.selectedEventLocation === this.locationTypes.serviceCenter
                && this.timeTo
                && this.timeFrom
                && this.appoitmentDate
            ) {
                let timeInterval = {
                    'from': moment.utc(`${this.appoitmentDate } ${ this.timeFrom}`, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm'),
                    'to': moment.utc(`${this.appoitmentDate } ${ this.timeTo}`, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm')
                };

                this.selectedServiceCenter = null;
                // Get service centers with date duration
                this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
                this.calendarAppointmentService.getServiceCenters({
                    'pageSize': 100,
                    'sortExpression': 'Name ASC',
                    'SchedulesRange.From': timeInterval.from,
                    'SchedulesRange.To': timeInterval.to
                }).then((response) => {
                    this.serviceCenters = response.data.Items;
                }).finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' });
                });
            }
        });

        // Appointments Block
        $scope.$watchCollection(() => {
            return [
                this.startDate,
                this.endDate,
                this.appointmentAddress,
                this.partOfDay
            ];
        }, () => {
            this.isAppointmentsShown = false;
        });

        // End manual
        this.timeUpdate = (_value) => {
            this.timeFrom = _value || this.timeFrom;
            if (this.timeFrom === '' && this.timeTo === '') {
                this.person = undefined;
            }
            this.timeTo = moment(moment(this.timeFrom, 'h:mm A').add({
                h: this.parseHours(this.model.selectedDuration),
                m: this.parseMinutes(this.model.selectedDuration)
            })).format('h:mm A');
        };
    }

    setDefaultStep2() {
        this.serviceCentersFilters = {
            Name: '',
            searchAddress: ''
        };

        this.appointmentAddress = [];
        this.serviceCenterIds = [];

        this.emergencyCallChecked = false;

        this.startDate = this.appoitmentDate;
        this.endDate = undefined;

        this.timeFrom = '8:30 AM'; // by default for manual set appointment
        this.timeUpdate();

        this.partOfDay = 4;

        this.selectedEventLocation = 1;
        this.choosenAppointment = null;

        this.selectedServiceCenter = null;

        this.person = undefined;
        this.isPersonnelBlockShow = false;

        this.isAppointmentsShown = false;

        this.isTeamMemberRequired = false;
    }

    getPersonnel() {

        let data = {
            DateRange: {
                'From': moment.utc(`${this.appoitmentDate } ${ this.timeFrom}`, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm'),
                'To': moment.utc(`${this.appoitmentDate } ${ this.timeTo}`, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm')
            }
        };

        // Reschedule
        if (this.appointmentId) {
            data.EventId = this.appointmentId;
        }
        if (this.selectedEventLocation === this.locationTypes.serviceCenter && this.selectedServiceCenter) {
            data.SetupCenterId = this.selectedServiceCenter;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
        this.calendarAppointmentService.getPersonnel(data)
            .then((response) => {
                this.personnel = this.$filter('orderBy')(response.data.Items, 'Name.FullName');
                if (this.personnelIds && this.personnelIds.length) {
                    this.personnel = this.personnel.filter((item) => {
                        return this.personnelIds.indexOf(item.Id.toString()) !== -1;
                    });
                }

                if (!this.personnel.length && !this.isTeamMemberRequired) {
                    this.ngToast.info('0 personnel members available. Please use another appointment time.');
                }
            })
            .finally(() => {
                this.isPersonnelBlockShow = true;
                this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' });
            });
    }

    selectPersonnel() {
        this.choosenAppointment = {
            Date: {
                From: moment.utc(`${this.appoitmentDate } ${ this.timeFrom}`, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm'),
                To: moment.utc(`${this.appoitmentDate } ${ this.timeTo}`, 'MM/DD/YYYY hh:mm A').format('YYYY-MM-DDTHH:mm')
            },
            EventAddress: {
                FullAddress: this.$filter('addressToString')(this.selectedPatient.Address)
            },
            Personnel: this.person
        };

        if (this.selectedEventLocation === this.locationTypes.serviceCenter && this.selectedServiceCenter) {
            this.choosenAppointment.CenterId = this.selectedServiceCenter;
            let selectedSetupCenterObj = _.find(this.serviceCenters, ['Id', this.selectedServiceCenter]);

            this.choosenAppointment.EventAddress = Object.assign({}, selectedSetupCenterObj.Address);
        }
        this.isSelectedAppointment = true;
    }


    selectServiceCenter(id) {
        let position = this.serviceCenterIds.indexOf(id);

        if (position > -1) {
            this.serviceCenterIds.splice(position, 1);
        } else {
            this.serviceCenterIds.push(id);
        }

        this.isAppointmentsShown = false;
    }

    isSelectedServiceCenter(id) {
        return this.serviceCenterIds.indexOf(id) > -1;
    }

    isSearchAppointmentsBlockShown() {
        let status = false;
        let dictionary = this.serviceCenters && this.serviceCenters.length;

        if (dictionary && !this.isAppointmentTimeManually) {
            status = this.isSelectedLocation(this.locationTypes.patientAddress) || this.isSelectedLocation(this.locationTypes.serviceCenter);
        } else if (!dictionary && !this.isAppointmentTimeManually) {
            status = this.isSelectedLocation(this.locationTypes.patientAddress) && !this.isSelectedLocation(this.locationTypes.serviceCenter);
        } else if (this.isAppointmentTimeManually) {
            status = false;
        }

        return status;
    }

    searchAppointments() {
        // Check all parametrs
        if (!this.isValidAppointmentSearchData()) {
            return false;
        }

        this.isSearchingAppointments = true;
        this.isAppointmentsShown = false;
        this.choosenAppointment = undefined;
        this.appointments = [];

        this.isSelectedAppointment = false;

        const timezone = moment().format('Z');
        const timezoneOffset = timezone.charAt(0) === '+' ? `${timezone.substring(1)}:00` : `${timezone}:00`;
        let request = {
            PatientId: this.selectedPatient.Id,
            DateRange: {
                From: moment(this.startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                To: moment(this.endDate, 'MM/DD/YYYY').format('YYYY-MM-DD')
            },
            TimezoneOffset: timezoneOffset,
            EventAddress: this.selectedPatient.Address,
            Duration: `${this.parseHours(this.model.selectedDuration) }:${ this.parseMinutes(this.model.selectedDuration)}`,
            Emergency: this.emergencyCallChecked,
            PartOfDay: this.partOfDay,
            Locations: this.appointmentAddress,
            PersonnelIds: this.$state.params.personnelIds ? this.$state.params.personnelIds.split(',') : []
        };

        if (this.appointmentAddress.indexOf(this.locationTypes.serviceCenter) > -1) {
            request.Centers = (this.serviceCenterIds && this.serviceCenterIds.length > 0) ? this.serviceCenterIds : [];
        }

        if (this.appointmentId) {
            request.EventId = this.appointmentId;
        }

        this.calendarAppointmentService.getAppointments(request)
            .then((response) => {
                this._mapDataToAppointments(response);
            }, () => {
                this.isAppointmentsShown = false;
            })
            .finally(() => {
                this.isSearchingAppointments = false;
            });
    }

    _mapDataToAppointments(response) {
        let formatTime = (time) => {
            if (!time) {
                return '';
            }

            let duration = moment.duration(time, 'hours');
            let result = moment(duration._data).format('H[h] m[m]');

            return result;
        };

        let i = 0;

        _.map(response.data.Items, (appointment) => {
            // Modify appointments for view
            let val = appointment.Date.From;

            appointment.Date.FromFormatedDate = this.$filter('amDateFormat')(this.$filter('amUtc')(val), 'MM/DD/YYYY');
            appointment.Date.FromFormatedTime = this.$filter('amDateFormat')(this.$filter('amUtc')(val), 'h:mm A');
            appointment.Driving = formatTime(appointment.Driving);
            appointment.Duration = formatTime(appointment.Duration);
            appointment.Id = i++;

            return appointment;
        });

        this.appointments = response.data.Items;
        this.isAppointmentsShown = true;
    }

    changeAppointmentAddress(locationId) {

        let position = this.appointmentAddress.indexOf(locationId);

        if (position > -1) {
            this.appointmentAddress.splice(position, 1);
        } else {
            this.appointmentAddress.push(locationId);
        }
        this.isAppointmentsShown = false;

        // Get service centers without date duration params
        if (this.appointmentAddress.indexOf(this.locationTypes.serviceCenter) > -1
            && locationId === this.locationTypes.serviceCenter
            && !this.isAppointmentTimeManually
        ) {
            this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
            this.serviceCenters = [];
            this.calendarAppointmentService.getServiceCenters({
                'pageSize': 100,
                'sortExpression': 'Name ASC'
            }).then((response) => {
                this.serviceCenters = response.data.Items;
            }).finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' });
            });
        }

    }

    isSelectedLocation(locationId) {
        if (!this.isAppointmentTimeManually) {
            // auto
            return this.appointmentAddress.indexOf(locationId) > -1;
        }
        // Manual
        return this.selectedEventLocation === locationId;
    }

    isValidAppointmentSearchData() {
        let msgArr = [];

        if (!this.selectedPatient) {
            msgArr.push('Patient isn\'t selected.');
        }
        if (!this.startDate) {
            msgArr.push('Start Date is empty');
        }
        if (!this.endDate) {
            msgArr.push('End Date is empty');
        }
        if (!this.appointmentAddress.length) {
            msgArr.push('Location isn\'t selected.');
        }
        if (msgArr.length) {
            _.map(msgArr, (item) => {
                this.ngToast.danger(item);
            });
            touchedErrorFields(this.appointmentStep2Form);
            return false;
        }

        // selected setup centers
        if (this.isSelectedLocation(this.locationTypes.serviceCenter)) {
            // at least one of setups centers must be selected
            if (!(this.serviceCenterIds && this.serviceCenterIds.length > 0)) {
                this.ngToast.danger('Please select at least one Patient Service Center.');
                return false;
            }
        }
        return true;
    }

    filterServiceCenters() {
        let params = angular.copy(this.serviceCentersFilters);

        angular.forEach(params, (value, key) => {
            if (!value) {
                delete params[key];
            } else {
                params[key] = value.toLowerCase();
            }
        });

        this.serviceCentersList = this.serviceCenters.filter((item) => {
            let isItemPassFilter = true;

            angular.forEach(params, (value, key) => {
                if (_.has(item, key) && typeof item[key] !== 'undefined') {
                    let itemValue = item[key].toLowerCase();

                    if (itemValue.indexOf(value) === -1) {
                        isItemPassFilter = false;
                    }
                }
            });

            return isItemPassFilter;
        });
    }

    /**
     * get Hours from Duration str ex."2h 15m" => 2
     * @param duration
     * @returns {*}
     */
    parseHours(duration) {
        let parsedHours = /(\d+)h/.exec(duration);

        return !parsedHours
            ? 0
            : parseInt(parsedHours[1]);
    }

    /**
     * get Minutes from Duration str ex."2h 15m" => 15
     * @param duration
     * @returns {*}
     */
    parseMinutes(duration) {
        let parsedMinutes = /(\d+)m/.exec(duration);

        return !parsedMinutes ? 0 : parseInt(parsedMinutes[1]);
    }
}

export const appointmentStep2Component = {
    template,
    controller: AppointmentStep2Ctrl,
    bindings: {
        appointmentId: '<',
        appoitmentDate: '=',
        selectedPatient: '=',
        dictionaries: '<',
        canAddPast: '<',
        isSelectedAppointment: '=',
        choosenAppointment: '=',
        isAppointmentTimeManually: '=',
        selectedOrders: '<'
    }
};

export default appointmentStep2Component;
