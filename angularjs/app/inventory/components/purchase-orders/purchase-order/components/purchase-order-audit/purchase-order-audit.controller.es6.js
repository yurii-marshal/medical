export default class PurchaseOrderAuditController {
    constructor(
        $state,
        $scope,
        bsLoadingOverlayService,
        purchaseOrdersHttpService
    ) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.purchaseOrdersHttpService = purchaseOrdersHttpService;

        this.purchaseOrderId = $state.params.purchaseOrderId;
        this.auditList = [];
        this.auditDetails = {};
        this.auditListLoaded = false;
        this.auditListParams = {
            pageSize: 100,
            pageIndex: 0,
            stopLoading: false,
            SortExpression: 'Date DESC'
        };
    }

    getPurchaseOrderAudit() {
        if (this.auditListParams.stopLoading) {
            return;
        }
        const params = {
            pageSize: this.auditListParams.pageSize,
            pageIndex: this.auditListParams.pageIndex,
            SortExpression: this.auditListParams.SortExpression
        };

        this.auditListParams.stopLoading = true;
        this.bsLoadingOverlayService.start('purchaseOrderAudit');
        this.purchaseOrdersHttpService.getPurchaseOrderAudit(this.purchaseOrderId, params)
            .then((response) => {
                response.data.Items.forEach((item) => this.auditList.push(item));
                this.auditListParams.pageIndex++;
                this.auditListParams.stopLoading = response.data.Items.length < this.auditListParams.pageSize;
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop('purchaseOrderAudit');
                this.auditListLoaded = true;
            });
    }
}
