export default class transactionModalCtrl {
    constructor(
        $mdDialog,
        invoicesService,
        billingInvoiceTransactionService,
        billingDictionariesService,
        bsLoadingOverlayService,
        invoiceId,
        lineId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.invoicesService = invoicesService;
        this.billingInvoiceTransactionService = billingInvoiceTransactionService;
        this.billingDictionariesService = billingDictionariesService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoiceId = invoiceId;
        this.lineId = lineId;

        this.searchReason = undefined;
        this.transaction = {
            Amount: undefined
        };

    }

    getReasons(Text, PageIndex) {
        const params = { Text, PageIndex, selectCount: true };

        return this.billingDictionariesService.getProviderAdjustmentReasons(params)
            .then((response) => response.data);
    }

    save() {
        if (this.transactionForm.$invalid) {
            touchedErrorFields(this.transactionForm);
            return;
        }

        const model = {
            Amount: this.transaction.Amount,
            Date: this.transaction.Date,
            ReasonId: this.transaction.AdjustmentReason.Id,
            Note: this.transaction.Notes
        };

        const promise = this.lineId ?
            () => this.billingInvoiceTransactionService.saveSLAdjustment(this.invoiceId, this.lineId, model) :
            () => this.billingInvoiceTransactionService.saveInvoiceAdjustment(this.invoiceId, model);

        this.bsLoadingOverlayService.start({ referenceId: 'transactionModal' });
        promise().then(() => this.$mdDialog.hide(this.lineId))
               .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'transactionModal' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}

