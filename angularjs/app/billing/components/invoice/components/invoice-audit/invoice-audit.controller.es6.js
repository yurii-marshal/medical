import {
    auditDetailsTypeConstants,
    auditDetailsStatusConstants
} from '../../../../../core/constants/billing.constants.es6.js';

export default class InvoiceAuditController {
    constructor(
        $state,
        $scope,
        invoicesService,
        invoiceAuditService,
        bsLoadingOverlayService,
        paymentsService
    ) {
        'ngInject';

        this.paymentsService = paymentsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.invoiceAuditService = invoiceAuditService;
        this.$state = $state;
        this.$scope = $scope;
        this.invoiceId = $state.params.invoiceId;
        this.auditList = [];
        this.auditDetails = {};
        this.auditListLoaded = false;

        this.auditDetailsTypeConstants = auditDetailsTypeConstants;
        this.auditDetailsStatusConstants = auditDetailsStatusConstants;

        this.auditListParams = {
            pageSize: 100,
            pageIndex: 0,
            stopLoading: false,
            SortExpression: 'Date DESC'
        };

        $scope.$on('$stateChangeSuccess', () => this._checkState());
    }

    _checkState() {
        if (this.$state.is('root.invoice.audit')) {
            this.$state.go('root.invoice.audit.list');
        }
        if (this.$state.is('root.invoice.audit.list')) {
            this.getAuditList();
        }
        if (this.$state.is('root.invoice.audit.details')) {
            this._getOperationDetails(this.$state.params.operationId);
        }
    }

    downloadEDI(transactionId) {
        this.paymentsService.getTransactionRawX12(transactionId, 'Operation');
    }

    getAuditList() {
        if (this.auditListParams.stopLoading) {
            return;
        }
        const params = {
            pageSize: this.auditListParams.pageSize,
            pageIndex: this.auditListParams.pageIndex,
            SortExpression: this.auditListParams.SortExpression
        };

        this.auditListParams.stopLoading = true;
        this.bsLoadingOverlayService.start('auditList');
        this.invoiceAuditService.getAuditList(this.invoiceId, params)
            .then((response) => {
                response.data.Items.forEach((item) => this.auditList.push(item));
                this.auditListParams.pageIndex++;
                this.auditListParams.stopLoading = response.data.Items.length < this.auditListParams.pageSize;
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop('auditList');
                this.auditListLoaded = true;
            });
    }

    _getOperationDetails(operationId) {
        this.bsLoadingOverlayService.start('auditDetails');
        this.invoiceAuditService.getInvoiceAuditDetails(this.invoiceId, operationId)
            .then((response) => {
                this.auditDetailsType = response.data.Type.Id;
                this.auditDetails = this.auditDetailsType === auditDetailsTypeConstants.INVOICE_ACKNOWLEDGMENT_ID
                    ? response.data.ClaimAcknowledgment
                    : response.data.ImplementationAcknowledgment;
            })
            .finally(() => this.bsLoadingOverlayService.stop('auditDetails'));
    }

    backToAuditList() {
        this.$state.go('root.invoice.audit.list');
        this.auditDetails = {};
    }
}

