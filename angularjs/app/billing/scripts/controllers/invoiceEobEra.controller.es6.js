export default class invoiceEobEraController {
    constructor($state, ngToast, paymentsService, bsLoadingOverlayService) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.paymentsService = paymentsService;

        this.invoiceId = $state.params.invoiceId;
        this.eobEraList = [];
        this.perPage = 10;
        this.currPage = 1;
        this.TotalCount = 0;

        this.loadItems(0);

    }

    loadItems(pageIndex) {
        this.bsLoadingOverlayService.start({ referenceId: 'eobEraTab' });

        this.paymentsService.getEobEraByInvoice(pageIndex, this.perPage, this.invoiceId)
            .then((response) => {
                this.eobEraList = response.data.Items;
                this.TotalCount = response.data.Count;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'eobEraTab' }));
    }

    openEob(item) {
        if (!item.DocumentId) {
            this._documentGenerationErrorMsg();
        } else {
            this.paymentsService.openEobDocument(item.DocumentId);
        }
    }

    openEra(item) {
        if (!item.DocumentId) {
            this._documentGenerationErrorMsg();
        } else {
            item.isEraLoading = true;
            return this.paymentsService.getTransactionRawX12(item.TransactionId, item.Payer)
                .finally(() => item.isEraLoading = false);
        }
    }

    _documentGenerationErrorMsg() {
        this.ngToast.danger('Failed to generate a document!');
    }

}
