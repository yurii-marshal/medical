export default class reAssignBillingProviderModalController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        billingProvidersService,
        providerId,
        providerName) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.billingProvidersService = billingProvidersService;
        this.providerId = providerId;
        this.providerName = providerName;

        this.reAssignedBillingProvider = undefined;

        this.isHaveReassignProviders = true;

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });

        this.checkingProviders = true;

        this.getBillingProviders()
            .then((response) => {
                if (response.Items.length === 0) {
                    this.isHaveReassignProviders = false;
                }
            })
            .finally(() => {
                this.checkingProviders = false;
                this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' });
            });
    }

    getBillingProviders(Name, pageIndex) {
        let params = { Name, pageIndex, sortExpression: 'Name ASC' };

        return this.billingProvidersService.getBillingProvidersDictionary(params)
            .then((response) => {
                response.data.Items = response.data.Items.filter((item) => item.Id !== this.providerId);
                return response.data;
            });
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    confirm() {
        if (this.modalForm.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            let model = {
                OldBillingProviderId: this.providerId,
                NewBillingProviderId: this.reAssignedBillingProvider.Id,
                NewBillingProviderName: this.reAssignedBillingProvider.Name
            };
            this.billingProvidersService.reAssignBillingProvider(model)
                .then(() => this.$mdDialog.hide())
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        } else {
            touchedErrorFields(this.modalForm);
        }
    }
}
