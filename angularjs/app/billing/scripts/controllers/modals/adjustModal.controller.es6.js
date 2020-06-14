export default class adjustModalController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        invoicesService,
        isEdit,
        adjustment,
        isSourcePatient
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.invoicesService = invoicesService;
        this.isEdit = isEdit;

        this.isSourcePatient = isSourcePatient;

        this.groups = [];
        this.adjustments = [
            adjustment
            ? angular.copy(adjustment)
            : this.getAdjustmentMock(this.isSourcePatient)
        ];

        bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        invoicesService.adjustmentGroupsDictionary()
            .then((response) => this.groups = response.data)
            .finally(() => bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    addAdjustment() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        this.adjustments.push(this.getAdjustmentMock(this.isSourcePatient));
    }

    removeAdjustment(index) {
        this.adjustments.splice(index, 1);
    }

    getReasons(name) {
        return this.invoicesService.adjustmentReasonsDictionary(name)
            .then((response) => response.data);
    }

    save() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        this.$mdDialog.hide(this.adjustments);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    getAdjustmentMock(isSourcePatient) {

        if (isSourcePatient) {
            return {
                Amount: undefined,
                Currency: '$',
                Note: undefined
            };
        }

        return {
            Amount: undefined,
            Currency: '$',
            Group: undefined,
            Reason: undefined,
            Description: undefined
        };
    }
}
