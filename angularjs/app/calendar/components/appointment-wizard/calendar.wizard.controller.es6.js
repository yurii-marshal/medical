class CalendarWizardController {
    constructor(
        ngToast,
        bsLoadingOverlayService,
        $scope,
        $state,
        calendarAppointmentService,
        tabsService,
        geoAddressesService) {
        'ngInject';

        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$state = $state;
        this.calendarAppointmentService = calendarAppointmentService;
        this.geoAddressesService = geoAddressesService;

        calendarAppointmentService.setDefaultModel();
        this.model = calendarAppointmentService.getModel();

        // Get params from $state
        this.appointmentId = $state.params.appointmentId;
        this.selectedPatient = {
            Id: $state.params.patientId ? $state.params.patientId : undefined
        };

        // Wizard options
        this.isLoading = false;
        this.isStep1DataLoaded = false; // use for hide components before loading all dictionary
        this.ourSteps = this.getSteps(this.appointmentId, this.selectedPatient.Id);
        this.ourSteps = tabsService.getSteps(this.ourSteps, $state.current.name);
        this.dictionaries = {};

        // Params for request
        // Step1
        this.selectedContacts = [];
        this.selectedOrders = [];
        this.appointmentType = {};
        this.isUpdateAddress = false;
        this.notes = '';

        // Step2
        this.canAddPast = false;

        this.isAppointmentTimeManually = false;
        this.appoitmentDate = $state.params.date
            ? moment($state.params.date, 'YYYY-MM-DD').format('MM/DD/YYYY')
            : moment().format('MM/DD/YYYY');
        this.timeFrom = '';
        this.timeTo = '';
        this.manualPersonnel = {};
        this.selectedEventLocation = undefined;
        this.choosenAppointment = {};
        this.eventAppointmentStatusId = undefined; // if reschedule by this.appointmentId
        this.isSelectedAppointment = false;

        // Step3
        this.isConfirmed = false;
        // End params for request


        // Redirect to step 1 if no step in url
        this.redirectToTheFirstStep();
        this.getDataAndDictionaries();

        // Wizard Navigation
        // @params event, toState, toParams, fromState, fromParams
        $scope.$on('$stateChangeSuccess', () => {
            this.ourSteps = tabsService.getSteps(this.ourSteps, $state.current.name);
        });

        this.openPreview = calendarAppointmentService.openDocument.bind(calendarAppointmentService);
    }

    next() {
        this.isAppointmentsShown = false;

        for (let i = 0; i < this.ourSteps.length; i++) {
            if (this.ourSteps[i].active) {
                this.currentIndex = i;
                break;
            }
        }

        if (this.currentIndex !== undefined) {

            if (!this.main.$invalid) {
                if (this.selectedOrders.length === 1
                    && !this.selectedOrders[0].patientOrder) {

                    this.selectedOrders = [];
                }
            }

            if (this.main.$invalid) {
                touchedErrorFields(this.main);
            } else if (this.currentIndex === 0) {
                this.checkAddresses();
            } else {
                if (this.ourSteps[this.currentIndex].number === 2) { // if step 2
                    if (this.isUpdateAddress && this.choosenAppointment.CenterId) {
                        this.ngToast.warning('The Service Center address uses and Primary Patient\'s Address can\'t be updated in this way.');
                    }
                }
                this.ourSteps[this.currentIndex].finished = true;
                this.$state.go(this.ourSteps[this.currentIndex + 1].view);
            }
        }
    }

    previous() {
        this.isAppointmentsShown = false;

        for (let i = 0; i < this.ourSteps.length; i++) {
            if (this.ourSteps[i].active) {
                this.currentIndex = i;
                break;
            }
        }

        if (this.currentIndex !== undefined) {
            this.ourSteps[this.currentIndex].finished = false;
            this.$state.go(this.ourSteps[this.currentIndex - 1].view);
        }
    }

    cancel() {
        if (this.appointmentId) {
            this.$state.go('root.calendar-appointment', { appointmentId: this.$state.params.appointmentId });
        } else {
            this.$state.go('root.calendar');
        }
    }

    canGoNext() {
        if (this.$state.current.name.indexOf('step2') !== -1) {

            if (!(this.isSelectedAppointment
                  && this.choosenAppointment
                  && this.choosenAppointment.Date
                  && this.choosenAppointment.Date.From
                  && this.choosenAppointment.Date.To
                )) {

                return true;
            }
        }
    }

    checkAddresses() {
        let addressesArr = [{
            addressObj: this.selectedPatient.Address,
            modalTitle: 'Patient Address'
        }];

        this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
        this.geoAddressesService.checkOrModifyAddresses(addressesArr)
                .then(() => this.$state.go(this.ourSteps[this.currentIndex + 1].view))
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' }));
    }

    save() {
        this.isLoading = true;

        if (!this.isAllFieldsValid(this, this.ngToast)) {
            this.isLoading = false;
            return false;
        }

        // Create event model for create event
        let event = {
            DateRange: {},
            PatientId: this.selectedPatient.Id,
            IsAddressUpdate: this.choosenAppointment.CenterId ? false : this.isUpdateAddress,
            Address: this.choosenAppointment.CenterId ? this.choosenAppointment.EventAddress : this.selectedPatient.Address,
            Notes: this.notes,
            Confirmed: this.isConfirmed,
            Modifier: this.isAppointmentTimeManually ? 1 : 2,
            Contacts: _.map(this.selectedContacts, (item) => {
                return {
                    Type: item.Type.Id,
                    Value: item.Value,
                    PhoneExtension: item.PhoneExtension
                };
            }),
            IsCustomDuration: this.model.IsCustomDuration,
            AppointmentType: this._getAppointmentTypeModel(this.appointmentType)
        };

        this.selectedOrders = this.selectedOrders.filter((selectedOrder) => selectedOrder.patientOrder);

        if (this.selectedOrders.length) {

            this.selectedOrders.forEach((order) => {
                if (event.Relations) {
                    event.Relations.push({ OrderId: order.patientOrder.Id });
                } else {
                    event.Relations = [{ OrderId: order.patientOrder.Id }];
                }
            });
        }

        let unicDocuments = _.uniq(
            _.map( _.filter(this.model.event.Documents, (i) => i.Id > 0),
                (i) => i.Id
            )
        );

        if (unicDocuments && unicDocuments.length > 0) {
            event.DocumentIds = unicDocuments;
        }

        event.DateRange.From = this.choosenAppointment.Date.From; // moment.utc(, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY-MM-DDTHH:mm");
        event.DateRange.To = this.choosenAppointment.Date.To; // moment.utc(, "YYYY-MM-DDTHH:mm:ssZ").format("YYYY-MM-DDTHH:mm");
        event.PersonnelId = this.choosenAppointment.Personnel ? this.choosenAppointment.Personnel.Id : null;

        if (this.choosenAppointment.CenterId) {
            event.SetupCenterId = this.choosenAppointment.CenterId;
        }

        if (this.appointmentId) {
            event.AppointmentStatus = this.eventAppointmentStatusId;
        }

        this.saveEvent(event, this.$state, this.ngToast, this.calendarAppointmentService)
                .finally(() => {
                    this.isLoading = false;
                });
    }

    saveEvent(event) {
        if (this.$state.params.appointmentId) {
            return this.calendarAppointmentService.updateEvent(event, this.$state.params.appointmentId)
                    .then(() => {
                        this.$state.go('root.calendar-appointment', { appointmentId: this.$state.params.appointmentId });
                        this.ngToast.success('Appointment updated.');
                    });
        }

        return this.calendarAppointmentService.createEvent(event)
                    .then((response) => {
                        this.$state.go('root.calendar-appointment', { appointmentId: response.data.Id });
                        this.ngToast.success('Appointment created.');
                    });
    }

    isAllFieldsValid() {
        if (!(this.selectedPatient && this.selectedPatient.Id)) {
            this.ngToast.danger('Please, select patient');
            return false;
        }

        return true;
    }

    // Prepare steps for top wizard navigation
    getSteps(appointmentId, patientId) {
        let appointmentRotes;

        switch (true) {
            case appointmentId && appointmentId.length > 0:
                appointmentRotes = 'root.reschedule_appointment_wizard';
                break;
            case parseInt(patientId) > 0 && this.$state.params.orderId !== undefined:
                appointmentRotes = 'root.order_appointment_wizard';
                break;
            case parseInt(patientId) > 0:
                appointmentRotes = 'root.patient_appointment_wizard';
                break;
            default:
                appointmentRotes = 'root.appointment_wizard';
                break;
        }

        return [
            {
                'number': 1,
                'title': 'Details',
                'view': `${appointmentRotes }.step1`
            },
            {
                'number': 2,
                'title': 'Schedule',
                'view': `${appointmentRotes }.step2`
            },
            {
                'number': 3,
                'title': 'Summary',
                'view': `${appointmentRotes }.step3`
            }
        ];
    }

    // @params $state, wizard
    redirectToTheFirstStep() {

        // Redirect if not on any steps
        let currPathName = this.$state.current.name ? this.$state.current.name : undefined;

        if (currPathName && currPathName.indexOf('appointment_wizard') !== -1 && currPathName.indexOf('step') === -1) {
            let params = this.$state.params;

            currPathName = currPathName.replace('root.', '');
            this.$state.go(`root.${ currPathName }.step1`, params);
        }

        // Redirect if start loading from not step1
        if (this.$state.params && this.$state.params.appointmentId) {
            if (!this.$state.is('root.reschedule_appointment_wizard.step1')) {
                this.$state.go('root.reschedule_appointment_wizard.step1');
            }
        } else {
            if (!this.$state.is('root.appointment_wizard.step1') && this.$state.current.name.indexOf('root.appointment_wizard') !== -1) {
                this.$state.go('root.appointment_wizard.step1');
            }
            if (!this.$state.is('root.patient_appointment_wizard.step1') && this.$state.current.name.indexOf('root.patient_appointment_wizard') !== -1) {
                this.$state.go('root.patient_appointment_wizard.step1');
            }
        }
    }

    getDataAndDictionaries() {
        this.isStep1DataLoaded = false;
        this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
        // get Dictionaries
        this.calendarAppointmentService.getAllDictionaries()
            .then((rptPatterns) => {
                if (rptPatterns) {
                    this.dictionaries.partsOfDay = rptPatterns.shift();
                    this.dictionaries.locationTypes = rptPatterns.shift();
                }

                if (this.$state.params.appointmentId) {
                    return this.calendarAppointmentService.getEventById(this.$state.params.appointmentId)
                        .then((response) => {
                            this.appoitmentDate = moment(response.data.DateRange.From, 'YYYY-MM-DDTHH:mm').format('MM/DD/YYYY');
                            this.notes = response.data.Notes;
                            this.selectedPatient = {
                                Id: response.data.Patient.Id
                            };
                            this.eventAppointmentStatusId = (response.data && response.data.AppointmentStatus && response.data.AppointmentStatus.Id)
                                ? response.data.AppointmentStatus.Id
                                : '';

                            if (response.data.AppointmentStatus.Id === 1) { // Confirmed
                                this.isConfirmed = true;
                            }

                            this.mapAppointmentType(response.data);
                            this.loadRescheduleOrders(response.data.Relations);
                        });
                }
            })
            .finally(() => {
                this.isStep1DataLoaded = true;
                this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' });
            });
    }

    loadRescheduleOrders(orders) {
        this.selectedOrders = [];
        angular.forEach(orders, (order, key) => {
            this.selectedOrders.push({
                Id: order.OrderId,
                DisplayId: order.DisplayId,
                Physician: order.Physician
            });
        });
    }

    mapAppointmentType(data) {
        this.appointmentType.Id = data.AppointmentType.Id;

        this.appointmentType.PickupOptions = {};
        if (data.PickupOptions) {

            if (data.PickupOptions.ReasonPatientExpired) {
                this.appointmentType.PickupOptions.ReasonPatientExpired = moment(data.PickupOptions.ReasonPatientExpired).format('MM/DD/YYYY');
            }

            if (data.PickupOptions.Devices) {
                this.appointmentType.PickupOptions.Devices = data.PickupOptions.Devices;
                angular.forEach(this.appointmentType.PickupOptions.Devices, (item) => {
                    item.Selected = true;
                });
            }

            if (data.PickupOptions.Reason) {
                this.appointmentType.PickupOptions.Reason = data.PickupOptions.Reason.Id;
            }

            if (data.PickupOptions.ReasonOtherText) {
                this.appointmentType.PickupOptions.ReasonOtherText = data.PickupOptions.ReasonOtherText;
            }
        } else {
            this.appointmentType.PickupOptions = {};
        }

        this.appointmentType.RevisitOptions = {
            RevisitList: {
                0: { Name: 'MaskRefitType', Id: 1 },
                1: { Name: 'EquipmentChangeType', Id: 2 },
                2: { Name: 'EquipmentMaintenance', Id: 4 },
                3: { Name: 'PatientAssesment', Id: 8 }
            }
        };

        if (data.RevisitOptions) {

            for (let prop in this.appointmentType.RevisitOptions.RevisitList) {
                let listOption = this.appointmentType.RevisitOptions.RevisitList[prop];
                let option = data.RevisitOptions[listOption.Name];

                if (option && !_.isEmpty(option)) {
                    if (_.isObject(option.Value) && !_.isEmpty(option.Value)) {
                        listOption.Enabled = true;
                        listOption.Value = option.Value.Id;
                        listOption.Reason = option.Reason;
                    } else {
                        listOption.Enabled = true;
                        listOption.Value = option.Id;
                    }
                } else {
                    listOption.Enabled = false;
                }
            }
        }
    }

    _getAppointmentTypeModel(appointmentType) {
        let appointmentTypeModel = {
            Type: appointmentType.Id,
            FollowUpOptions: {}
        };

        if (+appointmentType.Id === 3) {

            appointmentTypeModel.PickupOptions = {
                'Reason': appointmentType.PickupOptions.Reason ? appointmentType.PickupOptions.Reason : undefined,
                'ReasonPatientExpired': appointmentType.PickupOptions.ReasonPatientExpired ? appointmentType.PickupOptions.ReasonPatientExpired : undefined,
                'ReasonOtherText': appointmentType.PickupOptions.ReasonOtherText ? appointmentType.PickupOptions.ReasonOtherText : undefined,
                'Devices': []
            }

            if (appointmentType.PickupOptions.Devices && appointmentType.PickupOptions.Devices.length) {
                angular.forEach(appointmentType.PickupOptions.Devices, (item) => {
                    appointmentTypeModel.PickupOptions.Devices.push(item.Id)
                });
            }

        }

        if (+appointmentType.Id === 2) {
            appointmentTypeModel.FollowUpOptions = {};

            for (let prop in appointmentType.RevisitOptions.RevisitList) {
                let option = appointmentType.RevisitOptions.RevisitList[prop];

                switch (Number(prop)) {
                    case 0:
                        // MaskRefitType
                        if (option.Enabled && option.Value) {
                            appointmentTypeModel.FollowUpOptions.MaskRefitType = option.Value;
                        }
                        break;

                    case 1:
                        // EquipmentChangeType
                        if (option.Enabled && option.Value) {
                            appointmentTypeModel.FollowUpOptions.EquipmentChangeType = option.Value;
                        }
                        break;

                    case 2:
                        // EquipmentMaintenance
                        if (option.Enabled && option.Value) {
                            appointmentTypeModel.FollowUpOptions.EquipmentMaintenance = {
                                Value: option.Value,
                                Reason: (option.Value === 2) ? option.Reason : undefined
                            };
                        }
                        break;

                    case 3:
                        // PatientAssesment
                        if (option.Enabled && option.Value) {
                            appointmentTypeModel.FollowUpOptions.PatientAssesment = {
                                Value: option.Value,
                                Reason: (option.Value === 2) ? option.Reason : undefined
                            };
                        }
                        break;
                    default:
                        break;
                }
            }

        }

        return appointmentTypeModel;
    }

    viewOrderDetails(orderInfo) {
        this.calendarAppointmentService.openOrderDetails(orderInfo.Id);
    }
}

export default CalendarWizardController;
