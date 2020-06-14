export default class editAdjustmentReasonController {
    constructor(
        $scope,
        $mdDialog,
        ngToast,
        bsLoadingOverlayService,
        billingAdjustmentReasonsHttpService,
        model
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.billingAdjustmentReasonsHttpService = billingAdjustmentReasonsHttpService;
        this.model = model;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.editAdjustmentReasonForm.$invalid) {
            touchedErrorFields(this.editAdjustmentReasonForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'editAdjustmentReasonModal' });

        const saveFn = !this.model.Id ?
            this.billingAdjustmentReasonsHttpService.createAdjustmentReason(this.model) :
            this.billingAdjustmentReasonsHttpService.updateAdjustmentReason(this.model);

        saveFn
            .then(() => {
                this.ngToast.success(`Adjustment Reason is ${ !this.model.Id ? 'created' : 'updated' }`);
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editAdjustmentReasonModal' }));
    }
}
