import { limitConstants } from '../../../../../../../core/constants/core.constants.es6.js';

export default class orderWizardStep1Controller {
    constructor($state, $filter, $mdDialog, orderWizardService, coreReferralCardsService) {
        'ngInject';

        this.$state = $state;
        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.orderWizardService = orderWizardService;
        this.coreReferralCardsService = coreReferralCardsService;

        this.model = orderWizardService.getModel();
        this.isNew = angular.isUndefined($state.params.orderId);

        this.priorityLevels = [];
        this.referringProviderNotes = [];
        this.notesMaxLength = limitConstants.NOTES_MAXLENGTH;

        if ($state.params.patient) {
            this.patientChanged($state.params.patient);
        }

        orderWizardService.getPriorityLevels()
            .then((response) => this.priorityLevels = response.data);
    }

    dateChanged(date) {
        if (date && !this.model.effectiveDate) {
            this.model.effectiveDate = moment(date).format('MM/DD/YYYY');
        }
    }

    toggleReferringProvider(form) {
        if (!this.model.hasReferringProvider) {
            this.model.referralDate = '';
            this.model.referral = null;
            this.searchReferral = null;

            this.model.newItems.forEach((item) => {
                item.Diagnosis = [];
            });

            form.referral.$setValidity('md-require-match', false);
        }

        form.referral.$setValidity('md-require-match', true);
    }

    getHospitals(name) {
        return this.orderWizardService.getHospitals(name)
            .then((response) => response.data.Items);
    }

    hospitalDischargeChanged() {
        if (this.model.hospitalDischarge.hospital && this.model.hospitalDischarge.hospital.Id) {
            this.model.hospitalDischarge.hospitalAddress = this.model.hospitalDischarge.hospital.Address.FullAddress;
            this.model.hospitalDischarge.hospitalContact = this.model.hospitalDischarge.hospital.Contact.Phone;
        } else {
            this.model.hospitalDischarge.hospitalAddress = '';
            this.model.hospitalDischarge.hospitalContact = '';
        }
    }

    isDisabledReferringProviderBlock() {
        return !(this.model.patient && this.model.patient.Id && this.model.hasReferringProvider);
    }

    getPatients(fullName) {
        return this.orderWizardService.getPatients(fullName)
            .then((response) => response.data.Items);
    }

    patientChanged(patient) {
        this._setMedicationDiagnosesData(patient);

        if (!patient) {
            this.orderWizardService.clearModel(patient);
        }
    }

    referralChanged(referral) {
        this.setReferringProviderNotes();

        if (!referral) {
            return;
        }
        const isEmpty = _.isEmpty(this.model.prescriptionReferral);
        const isChanged = isEmpty || referral.Id !== this.model.prescriptionReferral.Id;

        if (isChanged) {
            // set prescriptionReferral on edit
            if (isEmpty && !this.isNew) {
                this.setPrescriptionReferral();
            } else {
                this.coreReferralCardsService.getLocations(referral.Id)
                    .then((response) => {
                        this.model.referral.Location = null;
                        this.model.referral.Locations = response.data;
                        if (this.model.referral.Locations.length === 1) {
                            this.model.referral.Location = this.model.referral.Locations[0];
                        }
                        this.setPrescriptionReferral();
                    });
            }
        }
    }

    setPrescriptionReferral() {
        angular.copy(this.model.referral, this.model.prescriptionReferral);
    }

    setReferringProviderNotes() {
        this.referringProviderNotes = [];
        if (this.model.referral) {
            if (this.model.referral.ReferringProviderNote) {
                this.referringProviderNotes.push({
                    label: 'Ref provider', labelClass: 'dark-gray', note: this.model.referral.ReferringProviderNote
                });
            }
            if (this.model.referral.SalesAgentNote) {
                this.referringProviderNotes.push({
                    label: 'Sales', labelClass: 'blue', note: this.model.referral.SalesAgentNote
                });
            }
        }
    }

    changeReferralLocation() {
        this.$mdDialog.show({
            templateUrl: 'core/modals/change-referral-location/change-referral-location.html',
            controller: 'changeReferralLocationController as modal',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                referralId: this.model.referral.Id,
                locationsList: this.model.referral.Locations
            }
        })
        .then((location) => {
            this.model.referral.Location = location;
            this.setPrescriptionReferral();
        });
    }

    _setMedicationDiagnosesData(patient) {
        if (this.isNew && patient) {
            this.getPatientDiagnoses(patient.Id);
            this.getPatientMedications(patient.Id);
        }
    }
    getPatientDiagnoses(patientId) {
        this.orderWizardService.getPatientDiagnoses(patientId)
            .then((response) => this.model.diagnosis = response);
    }

    getPatientMedications(patientId) {
        this.orderWizardService.getPatientMedications(patientId)
            .then((response) => this.model.medications = response);
    }

    getReferrals(name) {
        return this.orderWizardService.getReferrals(name)
            .then((response) => response.data.Items);
    }

    addReferral($event) {
        let addReferralModal = function(referral) {
            this.$mdDialog.show({
                controller: 'addReferralModalController as $ctrl',
                templateUrl: 'core/views/templates/modals/addReferral.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                locals: {
                    referral,
                    reopenModal: (response) => addReferralModal.apply(this, [response]),
                    updateReferral: (response) => {
                        if (!response) {
                            return;
                        }

                        this.model.referral = response;
                        this.referralChanged(response);
                        this.model.referral.displayName = this.$filter('referralDisplayName')(response);
                        if (this.isNew) {
                            angular.copy(this.model.referral, this.model.prescriptionReferral);
                        }
                    }
                }
            });
        };

        addReferralModal.apply(this);
    }
}
