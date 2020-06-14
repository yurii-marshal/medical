export default class addPayerModalController {
    constructor($state, $mdDialog, ngToast, payersService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.payersService = payersService;

        this.selectedPayer = undefined;
        this.model = {};
        this.btnNextDisabled = false;

        payersService.setDefaultModel();
        this.model = payersService.getModel();
    }

    payerChanged() {
        if (this.selectedPayer) {
            this.model.EligibilityCode = this.selectedPayer.EligibilityCode || '';
            this.model.ClaimCode = this.selectedPayer.ClaimCode || '';
            this.model.RemittanceCode = this.selectedPayer.RemittanceCode || null;
            this.model.Default = true;
            this.model.PreselectedPayerName = true;
            this.model.PreselectedClaimCode = !!this.model.ClaimCode;
        } else {
            this.model.EligibilityCode = '';
            this.model.ClaimCode = '';
            this.model.RemittanceCode = null;
            this.model.Default = false;
            this.model.PreselectedPayerName = false;
            this.model.PreselectedClaimCode = false;
        }
    }

    next() {
        this.btnNextDisabled = true;

        if (this.selectedPayer) {
            this.payersService.getPayersByName(this.selectedPayer.Name)
                .then((response) => {
                    const existedPayer = _.find(response.data.Items, (item) => this.selectedPayer.Name === item.Description);
                    if (existedPayer) {
                        this.ngToast.danger(`Selected payer already exists. Please choose another one.`);
                    } else {
                        openPayerDetails.apply(this);
                    }
                })
                .finally(() => this.btnNextDisabled = false);
        } else {
            openPayerDetails.apply(this);
        }

        function openPayerDetails() {
            this.btnNextDisabled = false;
            this.$mdDialog.hide();
            this.$state.go('root.management.payer.details', { id: 'new' });
        }
    }

    getPayers(nameOrClaimCode, pageIndex) {
        return this.payersService.getPayersFromBilling(nameOrClaimCode, pageIndex)
            .then(response => response.data);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
