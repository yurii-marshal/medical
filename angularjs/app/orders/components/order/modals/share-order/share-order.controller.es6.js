// TODO delete later, if not used anymore. Related to portal
export default class ShareOrderModalCtrl {
    constructor($rootScope, $mdDialog, bsLoadingOverlayService, ordersService, orderId) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ordersService = ordersService;
        this.orderId = orderId;

        this.referralCard = undefined;
    }

    getExtReferralCards(name) {
        return this.ordersService.getExtReferralCards(name)
            .then((response) => response.data.Items);
    }

    close() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.Form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            this.ordersService.share(this.orderId, this.referralCard.Id)
                .then(() => {
                    this.$rootScope.$broadcast('orderUpdated');
                    this.$mdDialog.hide();
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        } else {
            touchedErrorFields(this.Form);
        }
    }
}
