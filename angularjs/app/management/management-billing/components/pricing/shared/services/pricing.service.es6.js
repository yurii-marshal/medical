import { priceHoldReasonConstants } from '../../../../../../core/constants/core.constants.es6.js';
import { pricingCyclesConstants } from '../../../../../../core/constants/billing.constants.es6';

export default class pricingService {
    constructor($http, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI, WEB_API_INVENTORY_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;

        this.model = {};
    }

    getAndSetModel(id) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/${id}`)
            .then((response) => {
                this._setModel(id, response.data);
                if (response.data.PricingConfiguration.Payer) {
                    return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/${response.data.PricingConfiguration.Payer.Id}`)
                        .then((payerResponse) => {
                            if (!payerResponse || payerResponse.data.Archived) {
                                this.model.PricingConfiguration.PayerArchived = true;
                            }
                        });
                }
            });
    }

    _setModel(id, data) {

        this.model.SalesTax = data.SalesTax;
        this.model.Name = data.Name;
        this.model.Id = id;
        this.model.Units = data.Units;
        this.model.Charge = data.Charge;
        this.model.Allowed = data.Allowed;
        this.model.isHold = !data.HoldReason ? 'No' : 'Yes';
        this.model.HoldReason = data.HoldReason;
        this.model.OtherHoldReason = data.OtherHoldReason;
        this.model.PricingType = data.PricingType;
        this.model.PricingConfiguration = {
            Modifiers: {}
        };
        this.model.PricingConfiguration = data.PricingConfiguration;
        this.model.PricingConfiguration.Location = data.Location;
        this.model.PricingConfiguration.Product = data.PricingConfiguration.ProductId ? {
            Id: data.PricingConfiguration.ProductId,
            Text: data.PricingConfiguration.Product
        } : undefined;
        this.model.PricingConfiguration.EffectivePeriod.From = moment.utc(this.model.PricingConfiguration.EffectivePeriod.From).format('MM/DD/YYYY');
        this.model.PricingConfiguration.EffectivePeriod.To = !this.model.PricingConfiguration.EffectivePeriod.To
            ? undefined
            : moment.utc(this.model.PricingConfiguration.EffectivePeriod.To).format('MM/DD/YYYY');
        this.model.RentalConfigurationModel = data.RentalConfigurationModel;
        this.model.PricingConfiguration.Default = this.model.PricingConfiguration.Default ? 'Yes' : 'No';
        this.model.PricingConfiguration.HcpcsCode = {
            Id: this.model.PricingConfiguration.HcpcsCode,
            Text: this.model.PricingConfiguration.HcpcsCode,
            Description: this.model.PricingConfiguration.HcpcsCode
        };
    }

    getModel() {
        return this.model;
    }

    setDefaultModel() {
        this.model = {
            Id: undefined,
            Units: 1,
            Charge: 0,
            Allowed: 0,
            isHold: 'No',
            Location: null,
            HoldReason: undefined,
            OtherHoldReason: '',
            PricingType: undefined,
            PricingConfiguration: {
                Default: 'No'
            },
            RentalConfigurationModel: undefined
        };
    }

    getList(filterObj, sortExp, pageIndex, pageSize) {
        let sortExpression = this.infinityTableFilterService.getSortExpressions(sortExp),
            params = this.infinityTableFilterService.getFilters(filterObj);

        if (params.PayerId) {
            params.PayerId = params.PayerId ? params.PayerId.Id : undefined;
        }

        params = angular.merge(params, {sortExpression, pageIndex, pageSize});

        params['sortExpression'] = `Common DESC,${params['sortExpression']}`;

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings`, {params});
    }

    getPricingTypes() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/types/dictionary`, {cache: true});
    }

    getPricingCycles() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/cycle/dictionary`, {cache: true});
    }

    getDailyBillingCycles() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/daily-billing-cycle/dictionary`, { cache: true });
    }

    getDailyBillingWeekDays() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/daily-billing-week-days/dictionary`, { cache: true });
    }

    getHoldReasons() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/hold-reason/dictionary`, {cache: true});
    }

    getHcpcsCodes(code, pageIndex) {
        let params = {code, pageIndex};

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, {params})
            .then((response) => response.data);
    }

    getPayers(Name) {
        let params = {
            Name,
            sortExpression: 'Name ASC'
        };

        return this.getPayersDictionary(params)
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    return {
                        Id: item.Id,
                        Name: `${item.Name}${item.ClaimCode ? ` - ${item.ClaimCode}` : ''}`
                    };
                });
                return response.data.Items;
            });
    }

    getPayersDictionary(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payers/dictionary`, {params});
    }

    getModels(Name, pageIndex) {
        let params = {
            Name,
            pageIndex,
            sortExpression: 'Name ASC'
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/dictionary`, {params})
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    return {
                        Id: item.Id,
                        Text: item.Name
                    };
                });
                return response.data;
            });
    }

    deletePricing(id) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/${id}`);
    }

    savePricing(isDefaultType) {
        if (this.model.Id) {
            return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/${this.model.Id}`, this._getSaveModel(isDefaultType));
        }

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings`, this._getSaveModel(isDefaultType));

    }

    _getSaveModel(isDefaultType) {
        let saveModel = {
            Name: this.model.Name,
            Units: !this.model.Units ? undefined : this.model.Units,
            Charge: this.model.Charge.Amount,
            Allowed: this.model.Allowed ? this.model.Allowed.Amount : undefined,
            HoldStatus: {
                Hold: this.model.isHold === 'Yes',
                HoldReason: this.model.isHold === 'Yes' ? this.model.HoldReason.Id : undefined,
                OtherHoldReason: (this.model.isHold === 'Yes' && this.model.HoldReason.Id === priceHoldReasonConstants.OTHER_ID) ?
                    this.model.OtherHoldReason :
                    undefined
            },
            PricingType: this.model.PricingType.Name,
            PricingConfiguration: {
                Location: !(this.model.PricingConfiguration && this.model.PricingConfiguration.Location) ?
                    undefined :
                    {
                        Id: this.model.PricingConfiguration.Location.Id,
                        Name: this.model.PricingConfiguration.Location.Name
                    },
                Common: isDefaultType,
                HcpcsCode: isDefaultType ?
                    undefined :
                    this.model.PricingConfiguration.HcpcsCode.Text,
                PayerId: (!isDefaultType && this.model.PricingConfiguration.Payer) ?
                    this.model.PricingConfiguration.Payer.Id :
                    undefined,
                PayerName: (!isDefaultType && this.model.PricingConfiguration.Payer) ?
                    this.model.PricingConfiguration.Payer.Name :
                    undefined,
                PayerPlanId: this.model.PricingConfiguration && this.model.PricingConfiguration.PayerPlan ?
                    this.model.PricingConfiguration.PayerPlan.Id :
                    null,
                Product: this.model.PricingConfiguration.Product ? this.model.PricingConfiguration.Product.Text : undefined,
                ProductId: this.model.PricingConfiguration.Product ? this.model.PricingConfiguration.Product.Id : undefined,
                EffectivePeriod: isDefaultType ? undefined : {
                    From: moment.utc(this.model.PricingConfiguration.EffectivePeriod.From, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                    To: !this.model.PricingConfiguration.EffectivePeriod.To ?
                        undefined :
                        moment.utc(this.model.PricingConfiguration.EffectivePeriod.To, 'MM/DD/YYYY').format('YYYY-MM-DD')
                },
                Modifiers: {},
                Default: this.model.PricingConfiguration.Default === 'Yes'
            },
            SalesTax: this.model.SalesTax
        };

        if (this.model.PricingType.Name !== 'Purchase') {
            saveModel.RentalConfigurationModel = {
                Interval: this.model.RentalConfigurationModel.Interval,
                CappedInterval: this.model.RentalConfigurationModel.CappedInterval,
                Cycle: this.model.RentalConfigurationModel.Cycle.Id,
                BillInArrears: this.model.RentalConfigurationModel.BillInArrears,
                PurchaseAfter: this.model.RentalConfigurationModel.PurchaseAfter,
                Purchase: undefined
            };

            if (this.model.RentalConfigurationModel.Cycle) {
                if (this.model.RentalConfigurationModel.Cycle.Id === pricingCyclesConstants.DAY_ID) {
                    const dailyBilling = this.model.RentalConfigurationModel.DailyBilling;

                    saveModel.RentalConfigurationModel.DailyBilling = {
                        Cycle: dailyBilling.Cycle.Id,
                        EveryDays: dailyBilling.EveryDays,
                        MonthDay: dailyBilling.MonthDay,
                        WeekDays: dailyBilling.WeekDays
                    };
                } else {
                    saveModel.RentalConfigurationModel.SpanDate = this.model.RentalConfigurationModel.SpanDate;
                }
            }

            if (saveModel.RentalConfigurationModel.PurchaseAfter &&
                this.model.RentalConfigurationModel.GeneratePurchaseInvoice) {
                saveModel.RentalConfigurationModel.GenerateInvoiceOptions = {};
                saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Charge = this.model.RentalConfigurationModel.Charge
                    ? this.model.RentalConfigurationModel.Charge.Amount
                    : undefined;
                saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Allowed = this.model.RentalConfigurationModel.Allowed
                    ? this.model.RentalConfigurationModel.Allowed.Amount
                    : undefined;

                if (this.model.RentalConfigurationModel.Modifiers.Level1) {
                    saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Modifiers = {};
                    saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Modifiers.Level1 = this.model.RentalConfigurationModel.Modifiers.Level1.Id;
                    if (this.model.RentalConfigurationModel.Modifiers.Level2) {
                        saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Modifiers.Level2 = this.model.RentalConfigurationModel.Modifiers.Level2.Id;
                    }
                    if (this.model.RentalConfigurationModel.Modifiers.Level3) {
                        saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Modifiers.Level3 = this.model.RentalConfigurationModel.Modifiers.Level3.Id;
                    }
                    if (this.model.RentalConfigurationModel.Modifiers.Level4) {
                        saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Modifiers.Level4 = this.model.RentalConfigurationModel.Modifiers.Level4.Id;
                    }
                } else {
                    saveModel.RentalConfigurationModel.GenerateInvoiceOptions.Modifiers = undefined;
                }
            }
        }

        if (saveModel.PricingConfiguration &&
            this.model.PricingConfiguration.Modifiers &&
            this.model.PricingConfiguration.Modifiers.Level1) {
            saveModel.PricingConfiguration.Modifiers = {};
            saveModel.PricingConfiguration.Modifiers.Level1 = this.model.PricingConfiguration.Modifiers.Level1.Id;
            if (this.model.PricingConfiguration.Modifiers.Level2) {
                saveModel.PricingConfiguration.Modifiers.Level2 = this.model.PricingConfiguration.Modifiers.Level2.Id;
            }
            if (this.model.PricingConfiguration.Modifiers.Level3) {
                saveModel.PricingConfiguration.Modifiers.Level3 = this.model.PricingConfiguration.Modifiers.Level3.Id;
            }
            if (this.model.PricingConfiguration.Modifiers.Level4) {
                saveModel.PricingConfiguration.Modifiers.Level4 = this.model.PricingConfiguration.Modifiers.Level4.Id;
            }
        } else {
            saveModel.PricingConfiguration.Modifiers = undefined;
        }

        return saveModel;
    }
}
