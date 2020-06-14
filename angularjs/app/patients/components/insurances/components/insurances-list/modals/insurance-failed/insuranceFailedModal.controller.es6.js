export default class insuranceFailedModalController {
    constructor($mdDialog, bsLoadingOverlayService, patientInsurancesService, FailureInfo) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientInsurancesService = patientInsurancesService;
        this.FailureInfo = FailureInfo;
        this.patientInfo = undefined;
        this.errors = [];

        this._activate();
    }

    _activate() {
        if (!this.FailureInfo.TransactionId) {
            this.errors = [{ Text: 'Verification failed' }];
            return;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.patientInsurancesService.getBenefits(this.FailureInfo.TransactionId)
            .then((response) => {
                if (response.data.Errors) {
                    this.errors = response.data.Errors;
                } else {
                    this.errors = response.data.RequestValidation;
                    this.patientInfo = response.data.Details.General;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
