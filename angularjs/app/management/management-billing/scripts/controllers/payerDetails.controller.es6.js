export default class payerDetailsController {
    constructor($state, ngToast, $timeout, payersService) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.payersService = payersService;

        this.selectedPayer = {};

        this.model = payersService.getModel();

        this.selectedPayer.EligibilityCode = this.model.modelEligibilityCode;
        this.selectedPayer.ClaimCode = this.model.ClaimCode;
        this.selectedPayer.PayerId = this.model.PayerId;
        this.selectedPayer.Name = this.model.Name;

        if ($state.params.touchFormFields) { $timeout(() => touchedErrorFields(this.detailsForm)); }
    }

    getPayers(name, pageIndex) {
        return this.payersService.getPayersFromBilling(name, pageIndex)
            .then((response) => response.data);
    }

    addNewPlan() {
        if (this.detailsForm.$invalid) {
            touchedErrorFields(this.detailsForm);
            return;
        }

        this.model.Plans.unshift({ Contacts: [{}] });
    }

    save() {
        if (this.detailsForm.$valid) {
            this.payersService.savePayer();
        } else {
            touchedErrorFields(this.detailsForm);
        }
    }

    cancel() {
        this.payersService.setDefaultModel();
        this.$state.go('root.management.billing.payers');
    }
}
