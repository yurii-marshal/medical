export default class payerBillingController {
    constructor($state, bsLoadingOverlayService, ngToast, payersService) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ngToast = ngToast;
        this.payersService = payersService;

        this.model = payersService.getModel();
        this.dictionaries = {};

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'payerPage' });
        this.payersService.getPayerBillingDictionaries()
            .then(response => this.dictionaries = response)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'payerPage' }));
    }

    cancel() {
        this.payersService.setDefaultModel();
        this.$state.go('root.management.billing.payers');
    }

    save() {
        if (this.billingForm.$valid) {
            this.payersService.savePayer();
        } else {
            touchedErrorFields(this.billingForm);
        }
    }
}
