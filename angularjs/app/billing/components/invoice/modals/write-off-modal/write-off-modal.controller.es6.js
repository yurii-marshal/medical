export default class writeOffModalController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        invoicesService,
        billingClaimsService,
        billingDictionariesService,
        invoiceId,
        invoiceBalance
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.billingClaimsService = billingClaimsService;
        this.billingDictionariesService = billingDictionariesService;
        this.invoiceId = invoiceId;
        this.invoiceBalance = invoiceBalance;

        this.model = {
            Date: null,
            AdjustmentReason: null,
            Note: ''
        };
    }

    getReasons(Name) {
        return this.billingDictionariesService.getProviderAdjustmentReasons({ Text: Name })
            .then((response) => response.data.Items);
    }

    save() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        const model = {
            Date: this.model.Date ? moment(this.model.Date).format('YYYY-MM-DDTHH:mm:ss') : null,
            ReasonId: this.model.AdjustmentReason.Id,
            Note: this.model.Note
        };

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.billingClaimsService.postWriteOff(this.invoiceId, model)
            .then(() => this.invoicesService.closeInvoiceModal(this.invoiceId))
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
