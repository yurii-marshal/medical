import { selectInvoiceModalType } from './select-invoice.constants.es6';

import { paymentTypeConstants } from '../../../../../core/constants/billing.constants.es6';

export default class SelectInvoiceModalCtrl {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        invoicesService,
        coreHcpcsCodesService,
        corePatientService,
        billingInvoiceService,
        infinityTableFilterService,
        billingsCommonService,
        selectedIds,
        controlType,
        filters
    ) {
        'ngInject';

        this.selectInvoiceModalType = selectInvoiceModalType;

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.coreHcpcsCodesService = coreHcpcsCodesService;
        this.corePatientService = corePatientService;
        this.billingInvoiceService = billingInvoiceService;
        this.infinityTableFilterService = infinityTableFilterService;
        this.billingsCommonService = billingsCommonService;
        this.paymentTypeConstants = paymentTypeConstants;

        this.selectedIds = selectedIds || [];
        this.controlType = controlType || this.selectInvoiceModalType.CHECKBOX;

        this.invoicesListParams = {
            items: [],
            pageSize: 10,
            pageIndex: 0,
            showMoreButton: false
        };
        this.selectedItems = [];

        this.currentSourceType = null;

        this.predefinedFilters = filters || {};

        if (this.predefinedFilters.SourceType) {
            this.currentSourceType = this.predefinedFilters.SourceType;
        }

        this.filtersObj = Object.assign({}, this.predefinedFilters);

        this.getHcpcsCodes = (code, pageIndex) => this.getHcpcs(code, pageIndex);

        this.getInvoices();
    }

    search() {
        this.getInvoices();
    }

    getHcpcs(code, pageIndex) {
        return this.coreHcpcsCodesService.getHcpcsCodes({ code, pageIndex })
            .then((response) => response.data);
    }

    getPayers(nameOrClaimCode, pageIndex) {
        return this.billingsCommonService.searchBillingPayers(nameOrClaimCode, pageIndex)
            .then((response) => response.data);
    }

    getPatients(name) {
        const params = {
            sortExpression: 'Name.FullName ASC',
            fullName: name
        };

        return this.corePatientService.getPatientsDictionary(params)
            .then((response) => response.data.Items);
    }

    showMore() {
        this.invoicesListParams.pageIndex++;
        this.invoicesListParams.showMoreButton = false;
        this.getInvoices(this.invoicesListParams.pageIndex);
    }

    clearFilters() {

        if (!this.predefinedFilters.Payer) {
            this.selectedPayer = null;
        }

        this.searchHcpcsCode = null;
        this.filtersObj = Object.assign({}, this.predefinedFilters);
    }

    toggleItem(item) {
        const pos = this.selectedItems.findIndex((i) => i.InvoiceId === item.InvoiceId);

        if (pos > -1) {
            this.selectedItems.splice(pos, 1);
        } else {
            this.selectedItems.push(item);
        }
    }

    getInvoices(pageIndex) {
        if (!pageIndex) {
            this.invoicesListParams.items = [];
            this.invoicesListParams.pageIndex = 0;
        }

        let params = this.infinityTableFilterService.getFilters(this.filtersObj);

        delete params['SourceType'];

        if (params.To) {
            params.To = moment.utc(params.To, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        if (params.From) {
            params.From = moment.utc(params.From, 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        if (params.Patient) {
            params.CustomerId = params.Patient.Id;
            delete params['Patient'];
        }

        if (params.Payer) {
            params.PayerId = params.Payer.Id;
            delete params['Payer'];
        }

        if (params.Hcpcs) {
            params.Hcpcs = params.Hcpcs.Id;
        }

        params.PageIndex = pageIndex || this.invoicesListParams.pageIndex;
        params.PageSize = this.invoicesListParams.pageSize || 10;
        params.SortExpression = 'CreatedOn DESC';
        params.selectCount = true; // flag for backend to return "Count" property

        this.bsLoadingOverlayService.start({ referenceId: 'invoicesList' });
        return this.billingInvoiceService.searchInvoices(params)
            .then((response) => {

                response.data.Items = response.data.Items.map((item) => {

                    item.typeClass = this.invoicesService.getStatusClass(item.Status.Id);
                    item.isChecked = !!this.selectedItems.find((i) => i.InvoiceId === item.InvoiceId);

                    return item;
                });

                this.invoicesListParams.items = Array.from(new Set(
                    [...this.invoicesListParams.items, ...response.data.Items]
                ));

                this.invoicesListParams.showMoreButton = response.data.Count ?
                    response.data.Count > (+this.invoicesListParams.pageIndex + 1) * this.invoicesListParams.pageSize :
                    false;

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'invoicesList' }));
    }

    select() {
        this.$mdDialog.hide(this.selectedItems);
    }

    cancel() {
        this.filtersObj = {};
        this.selectedItems = [];
        this.$mdDialog.cancel();
    }
}
