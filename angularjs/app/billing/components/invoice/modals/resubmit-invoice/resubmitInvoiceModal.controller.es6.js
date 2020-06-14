export default class resubmitInvoiceModalController {
    constructor(
        $mdDialog,
        $state,
        invoicesService,
        bsLoadingOverlayService,
        resubmitCode,
        payerOriginalClaimNumber
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.invoiceId = $state.params.invoiceId;
        this.invoicesService = invoicesService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.resubmitionCodes = [];
        this.ResubmissionCode = angular.copy(resubmitCode);
        this.payerOriginalClaimNumber = payerOriginalClaimNumber;

        this.ResubmissionCodes = {
            originalClaim: '1'
        }

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'resubmit' });
        this.invoicesService.getResubmissionCodes(true)
            .then((res) => this.resubmitionCodes = res.data)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'resubmit' }));
    }

    save() {
        if (this.resubmitionForm.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'resubmit' });
            this.invoicesService.resubmitInvoice(this.invoiceId, this.ResubmissionCode, this.payerOriginalClaimNumber)
                .then((response) => {
                    this.$mdDialog.hide(response);
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'resubmit' }));

        } else {
            touchedErrorFields(this.resubmitionForm);
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
