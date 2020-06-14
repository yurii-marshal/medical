import {
    patientStatusConstants,
    patientInactivityReasonConstants
} from '../../../../constants/core.constants.es6';
import { mapPatientStatusClass } from '../../../../helpers/map-patient-css-classes.helper.es6';

export default class EditPatientAttrsCtrl {
    constructor($rootScope,
                $mdDialog,
                $q,
                ngToast,
                bsLoadingOverlayService,
                corePatientService,
                patient,
                patientTags,
                patientId) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.corePatientService = corePatientService;
        this.patientStatusConstants = patientStatusConstants;

        this.patientId = patientId;
        this.patientTags = patientTags || [];
        this.patientStatus = patient.Status;
        this.patientInactivityReason = patient.InactiveStatus || null;
        this.patientInactiveStatusText = null;
        if (patient.InactiveStatus && +patient.InactiveStatus.Id === patientInactivityReasonConstants.OTHER_ID) {
            this.patientInactiveStatusText = patient.InactiveStatus.Text || null;
        }
        this.patientDcDate = patient.DcDate ?
            moment(patient.DcDate).format('MM/DD/YYYY') :
            '';
        this.statuses = [];
        this.inactivityReasons = [];

        this._activate();
    }

    _activate() {
        const promises = [
            this.corePatientService.getPatientStatuses(),
            this.corePatientService.getPatientInactiveStatuses()
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'statusEditModal' });
        this.$q.all(promises)
            .then((responses) => {
                this.statuses = responses[0].data.map((status) => {
                    status.statusClass = mapPatientStatusClass(status.Id);
                    return status;
                });

                this.inactivityReasons = responses[1].data;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'statusEditModal' }));
    }

    isInactiveStatusTextVisible() {
        return +this.patientStatus.Id === this.patientStatusConstants.INACTIVE_STATUS_ID &&
            this.patientInactivityReason &&
            +this.patientInactivityReason.Id === patientInactivityReasonConstants.OTHER_ID;
    }

    save() {
        if (!this.Form.$valid) {
            touchedErrorFields(this.Form);
            return;
        }

        let model = {
            PatientId: { Id: this.patientId },
            Status: this.patientStatus.Id,
            Tags: this.patientTags.map((tag) => tag.Id)
        };

        if (this.patientStatus.Id === patientStatusConstants.INACTIVE_STATUS_ID) {
            model.InactiveStatus = this.patientInactivityReason.Id;
            model.DcDate = this.patientDcDate
                ? moment(this.patientDcDate).format('YYYY-MM-DD')
                : null;

            if (+this.patientInactivityReason.Id === patientInactivityReasonConstants.OTHER_ID) {
                model.InactiveStatusText = this.patientInactiveStatusText;
            }
        }

        this.bsLoadingOverlayService.start({ referenceId: 'statusEditModal' });
        this.corePatientService.savePatientState(model)
            .then(() => {
                this.$rootScope.$broadcast('patientUpdated');
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'statusEditModal' }));
    }

    close() {
        this.$mdDialog.cancel();
    }
}
