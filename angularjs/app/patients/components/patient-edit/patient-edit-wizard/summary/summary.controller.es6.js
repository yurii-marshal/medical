import { mapPatientStatusClass } from '../../../../../core/helpers/map-patient-css-classes.helper.es6';

export default class PatientEditSummaryController {
    constructor(patientEditService, $state) {
        this.patientId = $state.params.patientId;
        this.$state = $state;

        this.patientEditService = patientEditService;
        this.patientInfo = this.patientEditService.getModel();

        if (this.patientInfo.Status) {
            this.patientInfo.Status.StatusClass = mapPatientStatusClass(this.patientInfo.Status.Id);
        }
    }

    goToStep(stepNumber) {
        if (this.patientId) {
            this.$state.go(`root.patients.edit.step${stepNumber}`, { patientId: this.patientId });
        } else {
            this.$state.go(`root.patients.add.step${stepNumber}`);
        }
    }
}
