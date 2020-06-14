export default class patientFinancialController {
    constructor($scope, $state, bsLoadingOverlayService, invoicesService) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;

        this.patientId = $state.params.patientId;
        this.isShowingHistory = false;
        this.firstLoad = true;
        this.amountObject = {};
        this.contentTabs = [
            {
                Text: 'Invoices',
                State: 'root.patient.financial.invoices'
            },
            {
                Text: 'Payments',
                State: 'root.patient.financial.payments'
            }
        ];

        this.paginationParams = {
            pageIndex: 1,
            pageSize: 100
        };

        $scope.$on('$stateChangeSuccess', () => this._checkState());

        this._activate();
    }

    _checkState() {
        if (this.$state.is('root.patient.financial')) {
            this.$state.go('root.patient.financial.invoices');
        }
        this._clearDefaults(true);
    }

    _activate() {
        this._clearDefaults(true);

        this.invoicesService.getAmountsByPatientId(this.patientId)
            .then((response) => this.amountObject = response.data)
            .finally(() => this._loadData());
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

        if (showActive) {
            this.isShowingHistory = false;
        }

        if (this.firstLoad) {
            this.firstLoad = false;
        } else {
            this._loadData();
        }
    }

    _loadData() {
        if (this.$state.is('root.patient.financial.payments')) {
            this.loadPayments();
        }
    }

    loadPayments(PageIndex = 0) {
        this.bsLoadingOverlayService.start({ referenceId: 'financialTab' });
        let promise = this.isShowingHistory ?
            this.invoicesService.getPayments(this.patientId, { Recent: false, PageIndex, PageSize: this.paginationParams.pageSize }) :
            this.invoicesService.getPayments(this.patientId, { Recent: true, PageIndex, PageSize: this.paginationParams.pageSize });

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

    invoicesState() {
        return this.$state.is('root.patient.financial.invoices');
    }

    paymentsState() {
        return this.$state.is('root.patient.financial.payments');
    }
}
