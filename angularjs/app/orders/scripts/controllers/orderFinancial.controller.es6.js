export default class orderFinancialController {
    constructor($state, bsLoadingOverlayService, invoicesService) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;

        this.orderId = $state.params.orderId;
        this.isShowingHistory = false;
        this.firstLoad = true;
        this.amountObject = {};
        this.contentTabs = [
            {
                Text: 'Invoices',
                State: 'root.orders.order.financial',
                Readonly: true
            }
        ];

        this.paginationParams = {
            pageIndex: 1,
            pageSize: 10
        };

        this._activate();
    }

    _activate() {
        this._clearDefaults(true);
        this.bsLoadingOverlayService.start({ referenceId: 'financialTab' });
        this.invoicesService.getAmountsByOrderId(this.orderId)
            .then((response) => this.amountObject = response.data)
            .finally(() => this.loadInvoices());
    }

    showHistory() {
        this.isShowingHistory = !this.isShowingHistory;
        this._clearDefaults();
    }

    _clearDefaults(showActive) {
        this.itemsLoaded = false;
        this.itemsCount = undefined;
        this.itemsList = [];
        this.paginationParams.pageIndex = 1;

        if (showActive) { this.isShowingHistory = false; }

        if (this.firstLoad) {
            this.firstLoad = false;
        } else {
            this.loadInvoices();
        }
    }

    loadInvoices(pageIndex = 0) {
        this.bsLoadingOverlayService.start({ referenceId: 'financialTab' });
        let promise = this.isShowingHistory
            ? this.invoicesService.getClosedInvoices({ OrderId: this.orderId }, '', pageIndex, this.paginationParams.pageSize)
            : this.invoicesService.getActiveInvoices({ OrderId: this.orderId }, '', pageIndex, this.paginationParams.pageSize);

        this._processingPromise(promise);
    }

    _processingPromise(promise) {
        promise
            .then((response) => {
                this.itemsList = response.data.Items;
                this.itemsCount = response.data.Count;
            })
            .finally(() => {
                this.itemsLoaded = true;
                $('body').scrollTop(0);
                this.bsLoadingOverlayService.stop({ referenceId: 'financialTab' });
            });
    }
}
