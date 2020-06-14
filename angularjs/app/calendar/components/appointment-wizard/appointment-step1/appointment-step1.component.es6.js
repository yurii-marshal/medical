import template from './appointment-step1.inner.html';

class AppointmentStep1Ctrl {

    constructor(
        $state,
        $rootScope,
        bsLoadingOverlayService,
        $q,
        calendarAppointmentService,
        appConstants
    ) {
        'ngInject';

        this.$q = $q;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.calendarAppointmentService = calendarAppointmentService;

        this.model = calendarAppointmentService.getModel();

        this._selectedPatient = null; // local selection
        this.reschedule = !!this.appointmentId; // if reschedule we can't change the patient
        this.mainInfoLoaded = false;
        this.notesMaxLength = appConstants.limitConstants.NOTES_MAXLENGTH;

        this._activate();

        this.previousPatientId = this._selectedPatient ? this._selectedPatient.Id : undefined;
    }

    _activate() {
        // Exit if all data about patient is cashed (return from step 2)
        if (this.selectedPatient.Id
            && this.selectedPatient.Address
            && this.selectedPatient.Address.State
            && this.selectedPatient.Address.Zip
        ) {
            this._selectedPatient = this.selectedPatient;
            return false;
        }

        if (this.selectedPatient && this.selectedPatient.Id) {
            const patientId = this.selectedPatient.Id;

            this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
            this.calendarAppointmentService.getPatientMainInfo(this.selectedPatient.Id)
                .then((response) => {
                    this._selectedPatient = {
                        'DateOfBirthday': response.data.DateOfBirthday,
                        'FullName': response.data.Name.FullName,
                        'Name': {
                            'First': response.data.Name.First,
                            'Last': response.data.Name.Last,
                            'FullName': response.data.Name.FullName
                        },
                        'Id': patientId
                    };
                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' });
                });
        }
    }

    // Use after select new patient
    setDefaults(reschedule) {
        this.selectedContacts = [];
        this.model.selectedDuration = '0h 0m'; // todo - set defaults in service
        this.isUpdateAddress = false;
        this.mainInfoLoaded = false;

        if (!reschedule || !this._selectedPatient || !this._selectedPatient.Id
        ) {
            this.model.durationFromServer = '00:00:00';
            this.appointmentType = {};
            this.selectedOrders = [];
            this.notes = '';
        }

    }

    // Patient
    getPatients(lastName, pageIndex) {
        return this.calendarAppointmentService.getPatients(lastName, pageIndex).then((response) => {
            return response.data;
        });
    }

    getName(patient) {
        return `${patient.Name.First } ${ patient.Name.Last }, ${
                 moment(patient.DateOfBirthday, 'YYYY-MM-DDThh:mm:ssZ').utc().format('MM/DD/YYYY')}`;
    }

    patientSelected() {

        // Exit if all data about patient is cashed (return from step 2)
        if (this._selectedPatient
            && this.previousPatientId === this._selectedPatient.Id
            && this._selectedPatient.Address
            && this._selectedPatient.Address.State
            && this._selectedPatient.Address.Zip) {
            return false;
        }

        this.setDefaults(this.reschedule);

        // Exit if press on X button in the autocomplite
        if (!this._selectedPatient || !this._selectedPatient.Id) {
            this.selectedPatient = {};
            this.setDefaults(this.reschedule);
            return false;
        }

        let patientId = this._selectedPatient.Id;
        let newSelectedPatient = {};
        let arrPromises = [];

        this.bsLoadingOverlayService.start({ referenceId: 'new-appointment-wizard' });
        // Get Patient main info
        arrPromises[0] = this.calendarAppointmentService.getPatientMainInfo(patientId)
                .then((response) => {
                    newSelectedPatient = angular.extend(newSelectedPatient, response.data);

                    this.selectedContacts = angular.copy(newSelectedPatient.PatientContacts);
                    this.mainInfoLoaded = true;
                });

        // Get Patient Orders
        arrPromises[1] = this.calendarAppointmentService.isPatientHasOrders(patientId);

        // Get Patient's Documents
        arrPromises[2] = this.calendarAppointmentService.getDocuments(patientId);

        // Get Patient's Insurances
        arrPromises[3] = this.calendarAppointmentService.getInsurances(patientId).then((response) => {
            newSelectedPatient.insurances = response.data.Items;
        });

        this.$q.all(arrPromises)
                .finally(() => {
                    this.selectedPatient = newSelectedPatient;
                    this.bsLoadingOverlayService.stop({ referenceId: 'new-appointment-wizard' });
                });
    }
}

export const appointmentStep1Component = {
    template: template,
    controller: AppointmentStep1Ctrl,
    bindings: {
        appointmentId: '<',
        appointmentType: '=',
        selectedPatient: '=',
        selectedContacts: '=',
        selectedOrders: '=',
        isUpdateAddress: '=',
        dictionaries: '=',
        notes: '='
    }
};

export default appointmentStep1Component;
