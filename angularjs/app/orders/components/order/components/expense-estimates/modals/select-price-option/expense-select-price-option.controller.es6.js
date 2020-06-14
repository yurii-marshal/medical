export default class pricingOptionsModalCtrl {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        billingPriceOptionService,
        options
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.options = options;
        this.billingPriceOptionService = billingPriceOptionService;

        this.items = [];

        bsLoadingOverlayService.start({ referenceId: 'priceOptions' });

        this.billingPriceOptionService.findPricings(
            {
                Ids: this.options.pricings.map((pricing) => pricing.Id )
            }
        )
            .then((response) => {
                this.items = response.data;

                const defPricings = this.options.pricings.filter((item) => item.Default);

                if (defPricings.length === 1) {
                    this.selectedPriceOption = this.items.find((item) => item.Id === defPricings[0].Id);
                }

            })
            .finally(() => bsLoadingOverlayService.stop({ referenceId: 'priceOptions' }));

    }

    selectPriceOption(item) {
        this.selectedPriceOption = item;
    }

    save() {
        this.$mdDialog.hide(this.selectedPriceOption);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
