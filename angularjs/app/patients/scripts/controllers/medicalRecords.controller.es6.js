export default class medicalRecordsController {
    constructor($state, $mdDialog, ngToast, bsLoadingOverlayService, medicalRecordsService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.medicalRecordsService = medicalRecordsService;

        this.patientId = $state.params.patientId;

        this.model = this.medicalRecordsService.getModel();
        this.hideDiagnoseHistoryOverlay = false;
        this.showDiagnoseHistory = false;
        this.hideMedicationHistoryOverlay = false;
        this.showMedicationHistory = false;

        this.diagnose = undefined;
        this.medication = undefined;

        this.selectedDiagnoses = [];
        this.selectedMedications = [];
        this.selectedHospitalAdmissions = [];

        this.diagnosesHistory = [];
        this.medicationsHistory = [];

        this.bsLoadingOverlayService.start({ referenceId: 'loading-medical-records' });
        this.medicalRecordsService.getPatientMedicarRecords(this.patientId)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-medical-records' }));
    }

    getAllDiagnoses(description) {
        return this.medicalRecordsService.getAllDiagnoses(description)
            .then((response) => response.data.Items);
    }

    getAllMedications(description) {
        return this.medicalRecordsService.getAllMedications(description)
            .then((response) => response.data.Items);
    }

    removeDiagnose(diagnoseCode) {
        this.model.diagnoses = this.model.diagnoses.filter((diagnose) => diagnose.Code !== diagnoseCode);
    }

    addSelectedDiagnose(diagnose) {
        let haveDiagnose = this.model.diagnoses.some((o) => o.Id === diagnose.id);

        if (!haveDiagnose) {
            this.model.diagnoses.unshift({
                Code: diagnose.text,
                Description: diagnose.description.replace(`${diagnose.text} - `, ''),
                Id: diagnose.id
            });
            this.searchDiagnose = '';
        } else {
            this.ngToast.danger('Selected diagnosis has already been added.');
        }
    }

    addSelectedMedication(medication) {
        let haveMedication = this.model.medications.some((o) => o.MedicationId === medication.Id);

        if (!haveMedication) {
            this.model.medications.unshift({
                AdditionDate: moment().format('MM/DD/YYYY'),
                MedicationId: medication.Id,
                Medication: medication.Description
            });
            this.searchMedication = '';
        } else {
            this.ngToast.danger('Selected medication has already been added.');
        }
    }

    getDiagnosesHistory() {
        this.showDiagnoseHistory = !this.showDiagnoseHistory;
        this.hideDiagnoseHistoryOverlay = !this.hideDiagnoseHistoryOverlay;

        if (this.showDiagnoseHistory) { this._loadDiagnosesHistory(); }
    }

    getMedicationsHistory() {
        this.showMedicationHistory = !this.showMedicationHistory;
        this.hideMedicationHistoryOverlay = !this.hideMedicationHistoryOverlay;

        if (this.showMedicationHistory) { this._loadMedicationsHistory(); }
    }

    addHospitalAdmission(hospitalAdmission) {
        this.model.hospitals.unshift(hospitalAdmission);
    }

    showModal(event, admission) {
        event.stopPropagation();
        this.$mdDialog.show({
            controller: 'hospitalAdmissionModalController as modal',
            templateUrl: 'core/views/templates/addHospitalAdmission.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            locals: {
                addHospitalAdmission: this.addHospitalAdmission.bind(this),
                admission
            }
        });
    }

    removeHospital(index) {
        this.model.hospitals.splice(index, 1);
    }

    save() {
        this.bsLoadingOverlayService.start({ referenceId: 'loading-medical-records' });
        this.medicalRecordsService.save(this.model, this.patientId)
            .then(() => {
                this.ngToast.success('Medical records saved');
                if (this.showDiagnoseHistory) { this._loadDiagnosesHistory(); }
                if (this.showMedicationHistory) { this._loadMedicationsHistory(); }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-medical-records' }));
    }

    _loadDiagnosesHistory() {
        this.bsLoadingOverlayService.start({ referenceId: 'loading-diagnose-history' });
        this.medicalRecordsService.getDiagnosesHistory(this.patientId)
            .then((response) => this.diagnosesHistory = response.data.Items)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-diagnose-history' }));
    }

    _loadMedicationsHistory() {
        this.bsLoadingOverlayService.start({ referenceId: 'loading-medication-history' });
        this.medicalRecordsService.getMedicationsHistory(this.patientId)
            .then((response) => this.medicationsHistory = response.data.Items)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-medication-history' }));
    }
}
