export default class PatientFinancialInvoicesController {

    constructor(
        invoiceModifyService,
        coreHcpcsCodesService,
        invoicesService,
        billingClaimsService,
        bsLoadingOverlayService,
        $scope,
        $state
    ) {
        'ngInject';

        this.filters = this._getEmptyFiltesObj();
        this.$scope = $scope;
        this.$state = $state;

        this.coreHcpcsCodesService = coreHcpcsCodesService;
        this.getProducts = invoiceModifyService.getProducts.bind(invoiceModifyService);
        this.invoicesService = invoicesService;
        this.billingClaimsService = billingClaimsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.financialData = {};

        $scope.$watch(() => this.$scope.financial.isShowingHistory, () => {
            this.getItems();
        }, true);

        this.paginationParams = {
            pageIndex: 1,
            pageSize: 10
        };

        this.billToTypes = {
            PATIENT_ID: 'Patient',
            PAYER_TYPE_ID: 'Payer'
        };
    }

    _getEmptyFiltesObj() {
        return {
            Invoice: null,
            BillRecipient: null,
            Hcpcs: null,
            Service: null,
            Item: null,
            Charge: null,
            Balance: null,
            From: null,
            To: null
        };
    }

    changedFilters() {
        this.paginationParams.pageIndex = 1;
        this.getItems();
    }

    getItems() {
        const params = {
            PageSize: this.paginationParams.pageSize,
            PageIndex: this.paginationParams.pageIndex - 1,
            CustomerId: this.$state.params.patientId,
            sortExpression: 'InvoiceCreatedOn DESC'
        };

        if (this.filters.BillRecipient) {
            params.BillRecipient = this.filters.BillRecipient;
        }

        if (this.filters.Invoice) {
            params.InvoiceId = this.filters.Invoice.Id;
        }

        if (this.filters.Hcpcs) {
            params.Hcpcs = this.filters.Hcpcs.Id;
        }

        if (this.filters.Service) {
            params.Name = this.filters.Service;
        }

        if (this.filters.Item) {
            params.Item = this.filters.Item.Name;
        }

        if (this.filters.Charge) {
            params.Charge = this.filters.Charge;
        }

        if (this.filters.Balance) {
            params.Balance = this.filters.Balance;
        }

        if (this.filters.From) {
            params['Dos.From'] = this.filters.From;
        }

        if (this.filters.To) {
            params['Dos.To'] = this.filters.To;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'patientInvoicesWrap' });

        const servicesPromise = this.$scope.financial.isShowingHistory ? this.billingClaimsService.getHistoryServiceLines(params) :
                                                                         this.billingClaimsService.getActiveServiceLines(params);

        servicesPromise
            .then((response) => {
                this.financialData = response.data;

                this.financialData.Items = this.financialData.Items.map((item) => {
                    item.invoiceStatusClassName = this.invoicesService.getStatusClass(item.Status.Id);
                    return item;
                });

            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'patientInvoicesWrap' });
            });
    }

    getHcpcsCodes(code) {
        return this.coreHcpcsCodesService.getHcpcsCodes({ code })
                   .then((response) => response.data.Items);
    }

    getInvoicesDictionary(name) {
        const patientId = this.$state.params.patientId;

        return this.invoicesService.getInvoicesDictionary({
            DisplayId: name,
            PatientId: patientId
        }).then((response) => response.data.Items);
    }

    onClearFilter() {
        this.filters = this._getEmptyFiltesObj();
        this.selectedItemName = null;
        this.changedFilters();
    }
}
