export default class relatedInvoicesController {
    constructor($state, bsLoadingOverlayService, invoicesService) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;

        this.invoiceId = $state.params.invoiceId;
        this.firstPageLoaded = false;

        this.invoicesListParams = {
            items: [],
            pageSize: 10,
            pageIndex: 0,
            stopLoading: false
        };
    }

    getRelatedInvoices() {
        if (this.invoicesListParams.stopLoading) {
            return;
        }

        const params = {
            pageSize: this.invoicesListParams.pageSize,
            pageIndex: this.invoicesListParams.pageIndex
                ? this.invoicesListParams.pageIndex
                : 0
        };

        this.invoicesListParams.stopLoading = true;
        this.bsLoadingOverlayService.start({ referenceId: 'relatedInvoices' });
        this.invoicesService.getRelatedInvoices(this.invoiceId, params)
            .then((response) => {
                if (response.data.Items && response.data.Items.length) {

                    const mappedItems = response.data.Items.map(this._mapRelatedInvoices.bind(this));

                    this.invoicesListParams.items = this.invoicesListParams.items.concat(mappedItems);
                    this.invoicesListParams.pageIndex++;
                    this.invoicesListParams.stopLoading = response.data.Items.length < this.invoicesListParams.pageSize;
                }

                if (!this.firstPageLoaded) {
                    this.firstPageLoaded = true;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'relatedInvoices' }));
    }

    _mapRelatedInvoices(item) {
        item.statusClass = this.invoicesService.getStatusClass(item.Status.Id);
        return item;
    }
}
