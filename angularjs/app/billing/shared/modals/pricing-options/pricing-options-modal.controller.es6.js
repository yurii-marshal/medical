import { pricingTypeConstants } from '../../../../core/constants/billing.constants.es6';

export default class pricingOptionsModalController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        invoiceModifyService,
        serviceLine,
        BillRecipient,
        isMultiplePriceOptions,
        location
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.serviceLine = serviceLine;
        this.BillRecipient = BillRecipient;
        this.selectedPriceOption = serviceLine.PriceOption;
        this.items = [];

        bsLoadingOverlayService.start({ referenceId: 'priceOptions' });

        invoiceModifyService.getPriceOptions({
            Hcpcs: serviceLine.HcpcsCode.Id,
            'EffectivePeriod.From': moment.utc(serviceLine.ServicePeriod.From).format('YYYY-MM-DD'),
            'EffectivePeriod.To': moment.utc(serviceLine.ServicePeriod.To).format('YYYY-MM-DD'),
            PayerId: BillRecipient.PayerId || undefined,
            PayerPlanId: BillRecipient.PayerPlan && BillRecipient.PayerPlan.Id || null,
            ProductId: _.has(serviceLine, 'ServiceProduct.Id') ?
                serviceLine.ServiceProduct.Id :
                undefined,
            RentalInterval: serviceLine.Period || 1,
            LocationId: (location && location.Id) || null,
            PriceRentCycle: serviceLine.Cycle ? serviceLine.Cycle.Id : null
        })
            .then((response) => {
                this.items = response.data;

                this.items = _.filter(this.items, (item) => {

                    if (serviceLine.RentProgramId &&
                        _.has(serviceLine, 'PriceOption.Id')) {

                        return item.PricingType.Id === serviceLine.PriceType.Id;
                    } else if (serviceLine.RentProgramId &&
                               !_.has(serviceLine, 'PriceOption.Id')) {

                        return item.PricingType.Id === pricingTypeConstants.RENTAL_TYPE_ID;
                    }

                    return item;
                });

                if (!this.selectedPriceOption) {
                    this.selectedPriceOption = _.find(this.items, (i) => {
                        return serviceLine.PriceOption && serviceLine.PriceOption.Id === i.Id;
                    });
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
