export default class pricingDetailsModalController {
    constructor($rootScope,
                ngToast,
                $mdDialog,
                bsLoadingOverlayService,
                invoicesService,
                serviceLine,
                invoiceId) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.model = {};

        this.invId = invoiceId || serviceLine.ClaimId;
        this.lineId = serviceLine.Id || serviceLine.ServiceLineId || serviceLine.ServiceId;
        this.pricingId = serviceLine.PriceOptionId || serviceLine.PriceOption.Id;
        this.serviceLine = serviceLine;

        if (this.invId && this.lineId) {
            bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            invoicesService.getPriceDetails(this.pricingId)
                .then((response) => this.model = response.data)
                .finally(() => bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        } else {
            this.model = serviceLine.PriceOption;
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
