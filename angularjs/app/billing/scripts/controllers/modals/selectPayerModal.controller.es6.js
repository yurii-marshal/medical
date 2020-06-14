export default class selectPayerModalController {
    constructor(
        $mdDialog,
        $state,
        bsLoadingOverlayService,
        eobEraService,
        billingsCommonService,
        importPaymentId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.eobEraService = eobEraService;
        this.billingsCommonService = billingsCommonService;

        this.importPaymentId = importPaymentId;
    }

    payerChanged() {
        this.ClaimCode = this.selectedPayer && this.selectedPayer.ClaimCode || '';
    }

    getPayers(nameOrClaimCode, pageIndex) {
        return this.billingsCommonService.searchBillingPayers(nameOrClaimCode, pageIndex)
            .then((response) => response.data);
    }

    connectPayer() {
        if (this.selectPayerForm.$invalid) {
            touchedErrorFields(this.selectPayerForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'selectPayerModalOverlay' });
        this.eobEraService.connectSelectedPayer(this.importPaymentId, this.selectedPayer.Id)
            .then(() => this.$state.go('root.billing.payments'))
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'selectPayerModalOverlay' });
                this.$mdDialog.hide();
            });
    };

    cancel() {
        this.$mdDialog.cancel();
    }
}
