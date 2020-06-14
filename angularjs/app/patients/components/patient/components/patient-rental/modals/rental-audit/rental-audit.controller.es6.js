export default class auditRentalCtrl {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        rentalOptionsService,
        rentId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.rentalOptionsService = rentalOptionsService;

        this.rentId = rentId;
        this.firstPageLoaded = false;

        this.auditHistoryParams = {
            items: [],
            pageSize: 10,
            pageIndex: 0,
            stopLoading: false
        };

        this.onTotalScroll = this.getAuditHistory.bind(this);
        this._activate();
    }

    _activate() {
        this.getAuditHistory();
    }

    getAuditHistory() {
        if (this.auditHistoryParams.stopLoading) {
            return;
        }

        const params = {
            pageSize: this.auditHistoryParams.pageSize,
            pageIndex: this.auditHistoryParams.pageIndex ?
                this.auditHistoryParams.pageIndex :
                0,
            SortExpression: 'CreatedOn DESC',
            selectCount: true
        };

        this.auditHistoryParams.stopLoading = true;
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.rentalOptionsService.getAuditData(this.rentId, params)
            .then((res) => {
                if (res && res.length) {
                    const mappedItems = res.map((item) => {
                        item.CreatedOn = moment(item.CreatedOn).format('MM/DD/YYYY');
                        return item;
                    });

                    this.auditHistoryParams.items = this.auditHistoryParams.items.concat(mappedItems);
                    this.auditHistoryParams.pageIndex++;
                    this.auditHistoryParams.stopLoading = res.length < this.auditHistoryParams.pageSize;
                }

                if (!this.firstPageLoaded) {
                    this.firstPageLoaded = true;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }


}
