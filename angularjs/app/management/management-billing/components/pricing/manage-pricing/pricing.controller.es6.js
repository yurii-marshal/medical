import { priceHoldReasonConstants } from '../../../../../core/constants/core.constants.es6.js';
import {
    pricingTypeConstants,
    pricingCyclesConstants
} from '../../../../../core/constants/billing.constants.es6.js';

export default class pricingController {
    constructor(
        $state,
        ngToast,
        bsLoadingOverlayService,
        $q,
        pricingService,
        payerPlansService,
        organizationLocationsService
    ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;
        this.pricingService = pricingService;
        this.payerPlansService = payerPlansService;
        this.organizationLocationsService = organizationLocationsService;

        this.getHcpcsCodes = pricingService.getHcpcsCodes.bind(pricingService);
        this.getModels = pricingService.getModels.bind(pricingService);

        this.holdReasonConstants = priceHoldReasonConstants;
        this.pricingTypeConstants = pricingTypeConstants;
        this.pricingCyclesConstants = pricingCyclesConstants;

        this.model = {};
        this.pricingId = $state.params.pricingId;
        this.isPurchase = false;
        this.isDefaultType = false;
        this.hasCappedRentals = false;
        this.pricingTypes = [];
        this.payerPlans = [];
        this.pricingCycles = [];
        this.holdReasons = [];
        this.dailyBillingCycles = null;
        this.dailyBillingWeekDays = null;

        this._activate();
    }

    _activate() {
        // clear and attach model
        this.pricingService.setDefaultModel();
        this.model = this.pricingService.getModel();

        let promises = [];

        promises.push(this.pricingService.getPricingTypes());
        promises.push(this.pricingService.getPricingCycles());
        promises.push(this.pricingService.getHoldReasons());
        promises.push(this.pricingService.getDailyBillingCycles());
        promises.push(this.pricingService.getDailyBillingWeekDays());
        promises.push(this.loadPayerPlans());

        // load model if edit inside service
        if (this.pricingId) {
            promises.push(this.pricingService.getAndSetModel(this.pricingId));
        }

        this.bsLoadingOverlayService.start({ referenceId: 'pricingPage' });
        this.$q.all(promises)
            .then((responses) => {
                // check if default pricing
                if (this.pricingId && this.model.PricingConfiguration.Common) {
                    this.isDefaultType = true;
                }

                // fill dictionaries only
                if (responses[0]) { this.pricingTypes = responses[0].data; }
                if (responses[1]) { this.pricingCycles = responses[1].data; }
                if (responses[2]) { this.holdReasons = responses[2].data; }
                if (responses[3]) { this.dailyBillingCycles = responses[3].data; }
                if (responses[4]) { this.dailyBillingWeekDays = responses[4].data; }

                const rentalConfiguration = this.model.RentalConfigurationModel;
                const dailyBilling = rentalConfiguration && rentalConfiguration.DailyBilling;

                if (dailyBilling && dailyBilling.WeekDays && dailyBilling.WeekDays.length) {
                  dailyBilling.WeekDays = dailyBilling.WeekDays.map((v) => v.Id);
                  this.dailyBillingWeekDays.forEach((item) =>
                    item.checked = !!dailyBilling.WeekDays.find((v) => v === item.Id));
                }

                if (this.pricingId) {
                    this.isPurchase = this.model.PricingType.Name === 'Purchase';
                }

                // if payer was deleted after creating pricing
                if (this.model.PricingConfiguration.PayerArchived) {
                    this.model.PricingConfiguration.Payer = undefined;
                    this.ngToast.danger("Please select another payer, previous one is not available any more.");
                }
                if (rentalConfiguration && rentalConfiguration.CappedInterval) {
                    this.hasCappedRentals = true;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'pricingPage' }));
    }

    getPayers(Name, PageIndex) {
        const params = { Name, PageIndex };

        return this.pricingService.getPayersDictionary(params)
            .then((response) => response.data);
    }

    onChangePurchaseAfter() {
        if (!this.model.RentalConfigurationModel.PurchaseAfter) {
            this.model.RentalConfigurationModel.GeneratePurchaseInvoice = false;
        } else {
            this.hasCappedRentals = false;
            this.onChangeCappedRentals();
        }
        this.updateInvoiceOptions();
    }

    onChangeCappedRentals() {
        if (!this.hasCappedRentals) {
            this.model.RentalConfigurationModel.CappedInterval = null;
            this.form['cappedInterval'].$setValidity('endRange', true);
        } else {
            this.model.RentalConfigurationModel.PurchaseAfter = false;
        }
    }

    isIntervalToMaxAchieved() {
        return this.model.RentalConfigurationModel &&
            this.model.RentalConfigurationModel.Interval &&
            this.model.RentalConfigurationModel.Interval.To === 99;
    }

    isPurchaseAfterDisabled() {
        return this.isIntervalToMaxAchieved() || this.hasCappedRentals;
    }

    loadPayerPlans() {
        if (_.has(this.model, 'PricingConfiguration.Payer.Id')) {
            return this.payerPlansService.getPayerPlans(this.model.PricingConfiguration.Payer.Id)
                .then((res) => {
                    this.payerPlans = res.data.Items;
                });
        } else {
            this.model.PricingConfiguration.PayerPlan = null;
            this.payerPlans = [];
        }
    }

    isTypeRental() {
        return this.model.PricingType && this.model.PricingType.Id === this.pricingTypeConstants.RENTAL_TYPE_ID;
    }

    isCycleDaily() {
        return this.model.RentalConfigurationModel &&
            this.model.RentalConfigurationModel.Cycle &&
            this.model.RentalConfigurationModel.Cycle.Id === this.pricingCyclesConstants.DAY_ID;
    }

    onRentalCycleChange() {
        this.updateSpanDate();
        this.model.RentalConfigurationModel.DailyBilling = {};
        this.dailyBillingWeekDays.forEach((v) => v.checked = false);
    }

    updateSpanDate() {
        if (this.model.RentalConfigurationModel &&
            (!this.model.RentalConfigurationModel.Cycle || this.isCycleDaily())
        ) {
            this.model.RentalConfigurationModel.SpanDate = false;
        }
    }

    onDailyBillingCycleChange() {
        if (this.model.RentalConfigurationModel.DailyBilling.Cycle.Id === this.pricingCyclesConstants.DAY_ID) {
            this.model.RentalConfigurationModel.DailyBilling.EveryDays = 1;
        } else {
            this.model.RentalConfigurationModel.DailyBilling.EveryDays = null;
        }
        this.model.RentalConfigurationModel.DailyBilling.MonthDay = null;
        this.model.RentalConfigurationModel.DailyBilling.WeekDays = [];
        this.dailyBillingWeekDays.forEach((v) => v.checked = false);
    }

    isDailyBillingWeekDayChecked(item) {
        return this.model.RentalConfigurationModel.DailyBilling.WeekDays &&
          this.model.RentalConfigurationModel.DailyBilling.WeekDays.find((v) => v.Id === item.Id);
    }

    onDailyBillingWeekDayChange(item) {
        if (!this.model.RentalConfigurationModel.DailyBilling.WeekDays) {
            this.model.RentalConfigurationModel.DailyBilling.WeekDays = [];
        }
        if (item.checked) {
            this.model.RentalConfigurationModel.DailyBilling.WeekDays.push(item.Id);
        } else {
          const index = this.model.RentalConfigurationModel.DailyBilling.WeekDays.findIndex((v) => v === item.Id);

          if (index !== -1) {
            this.model.RentalConfigurationModel.DailyBilling.WeekDays.splice(index, 1);
          }
        }
    }

    updateInvoiceOptions() {
        if (!this.model.RentalConfigurationModel.GeneratePurchaseInvoice) {
            this.model.RentalConfigurationModel.Modifiers = {
                Level1: null,
                Level2: null,
                Level3: null,
                Level4: null
            };
            if (this.model.RentalConfigurationModel.Charge) {
                this.model.RentalConfigurationModel.Charge.Amount = null;
                this.form.chargePurchase.$setUntouched();
            }
            if (this.model.RentalConfigurationModel.Allowed) {
                this.model.RentalConfigurationModel.Allowed.Amount = null;
                this.form.rentalAllowed.$setUntouched();
            }
        }
    }

    isRentalChargeRequired() {
        return !this.isPurchase &&
            this.model.RentalConfigurationModel.GeneratePurchaseInvoice;
    }

    save() {
        if (this.form.$invalid) {
            touchedErrorFields(this.form);
        } else {
            this.bsLoadingOverlayService.start({ referenceId: 'pricingPage' });
            this.pricingService.savePricing(this.isDefaultType)
                .then(() => {
                    if (this.model.Id) {
                        this.ngToast.success('Pricing record is updated');
                    } else {
                        this.ngToast.success('Pricing record is created');
                    }
                    this.$state.go('root.management.billing.pricing.list');
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'pricingPage' }));
        }
    }

    intervalToChanged() {
        if (this.isIntervalToMaxAchieved()) {
            this.model.RentalConfigurationModel.PurchaseAfter = false;
        }
    }

    isHoldChanged() {
        if (this.model.isHold === 'No') {
            this.model.HoldReason = undefined;
            this.model.OtherHoldReason = undefined;
        }
    }

    holdReasonChanged() {
        if (this.model.HoldReason && this.model.HoldReason.Id !== priceHoldReasonConstants.OTHER_ID) {
            this.model.OtherHoldReason = undefined;
        }
    }

    typeChanged() {
        this.isPurchase = this.model.PricingType.Id === pricingTypeConstants.PURCHASE_TYPE_ID;

        if (this.isPurchase) {
            this.model.RentalConfigurationModel = undefined;
        }
    }

    getOrganizationLocations(name, pageIndex) {

        return this.organizationLocationsService.getLocations(name, pageIndex)
            .then((response) => {
                response.data.Items.map((item) => {
                    item.FullName = `${item.Text} (${item.Npi})`;
                    return item;
                });

                return response.data;
            });
    }
}
