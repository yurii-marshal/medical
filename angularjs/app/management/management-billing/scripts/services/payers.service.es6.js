export default class payersService {
    constructor(
        $state,
        ngToast,
        bsLoadingOverlayService,
        $q,
        $http,
        WEB_API_SERVICE_URI,
        WEB_API_BILLING_SERVICE_URI,
        infinityTableFilterService,
        geoAddressesService
    ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.geoAddressesService = geoAddressesService;

        this.callbacks = {};

        this.model = {};
    }

    registerAfterSaveCallback(key, fn) {
        this.callbacks[key] = fn;
    }

    removeAfterSaveCallback(key) {
        delete this.callbacks[key];
    }

    emitAfterSave() {
        Object.keys(this.callbacks).forEach((key) => {
            this.callbacks[key]();
        });
    }

    getModel() {
        return this.model;
    }

    setDefaultModel() {
        this.model = {
            Id: '',
            PayerId: '',
            ClaimCode: '',
            EligibilityCode: '',
            Name: undefined,
            Plans: [{ Contacts: [{}] }],
            BillingOptions: {
                AdjustmentsAutoPost: true,
                BalanceAutoTransfer: true
            },
            Archived: false,
            fieldRules: {
                payerNameDisabled: false,
                payerIdDisabled: false,
                acceptElectronicClaims: false,
                supportElectronicEligibility: false
            },
            Restrictions: {
                PrescriptionRules: [],
                RentalRules: [],
                RenderingProviderRules: [],
                AuthorizationRules: [],
                TasksRules: [],
                CombineRules: [],
                SplitRules: [],
                ResupplyModel: {
                    ResupplyRules: []
                },
                CmnRules: [],
                ComplianceRules: []
            },
            compilanceHcpcsCodes: [],
            resupplyHcpcsCodes: []
        };
    }

    setModel(data) {
        angular.extend(this.model, data);
        this.model.Id = data.Id;
        this.model.PreselectedPayerName = true;
        this.model.PreselectedClaimCode = true;
        this.model.PayerId = data.ClaimCode || data.EligibilityCode;
        this.model.ClaimCode = data.ClaimCode || data.EligibilityCode;
        this.model.Default = data.Default;
        this.model.EligibilityCode = data.EligibilityCode;
        this.model.Name = data.Name;

        this.model.Plans = data.Plans && data.Plans.length ?
            data.Plans.map((plan) => {
                if (plan.Contacts && plan.Contacts.length) {
                    plan.Contacts.forEach((item) => {
                        item.type = item.Type.Id;
                        item.value = item.Value;
                    });
                } else {
                    plan.Contacts = [{}];
                }
                if (plan.Address) {
                    delete plan.Address.FullAddress;
                }

                return plan;
            }) :
            [{ Contacts: [{}] }];

        this.model.BillingOptions = data.BillingOptions;
        this.model.Archived = data.Archived;

        this.model.Restrictions = data.Restrictions;

        angular.forEach(this.model.Restrictions.ResupplyModel.ResupplyRules, (rule) => this._mapRuleForAll(rule));
        angular.forEach(this.model.Restrictions.CmnRules, (rule) => this._mapRuleForAll(rule));

        this.model.Restrictions.TasksRules.forEach((rule) => {
            this._mapRuleForAll(rule);
            rule.Tasks.forEach((task) => {
                if (task.DuePeriod) {
                    task.DuePeriod = {
                        PeriodCount: task.DuePeriod.PeriodCount,
                        Cycle: { Id: task.DuePeriod.Cycle },
                    }
                }
            })
        });
        angular.forEach(this.model.Restrictions.CombineRules, (rule) => this._mapRuleForAll(rule));
        angular.forEach(this.model.Restrictions.SplitRules, (rule) => this._mapRuleForAll(rule));

        angular.forEach(this.model.Restrictions.AuthorizationRules, (rule) => this._mapRuleForAll(rule));
        angular.forEach(this.model.Restrictions.PrescriptionRules, (rule) => this._mapRuleForAll(rule));
        angular.forEach(this.model.Restrictions.RentalRules, (rule) => this._mapRuleForAll(rule));
        angular.forEach(this.model.Restrictions.RenderingProviderRules, (rule) => this._mapRuleForAll(rule));

        this.model.compilanceHcpcsCodes = [];
        angular.forEach(this.model.Restrictions.ComplianceRules, (rule) => {
            if (!rule.All && rule.HcpcsCodes.length) {
                this.model.compilanceHcpcsCodes = this.model.compilanceHcpcsCodes.concat(rule.HcpcsCodes);
            }

            rule.Plans = rule.PayerPlans || [];
            delete rule.PayerPlans;
        });

        this.model.resupplyHcpcsCodes = [];
        angular.forEach(this.model.Restrictions.ResupplyModel.ResupplyRules, (rule) => {
            if (!rule.All && rule.HcpcsCodes.length) {
                this.model.resupplyHcpcsCodes = this.model.resupplyHcpcsCodes.concat(rule.HcpcsCodes);
            }
        });
    }

    getPlanTypesDictionary() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/plan-type/dictionary`, { cache: true });
    }

    getPayerPlans(payerId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/${payerId}/plans`);
    }

    getInsuranceTypesCodes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/insurance-type-code/dictionary`, { cache: true });
    }

    getPayerBillingDictionaries() {
        return this.$q.all([
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/payer-method/dictionary`, { cache: true }),
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/claim-filling-indicator/dictionary`, { cache: true }),
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/cmn-box1-type/dictionary`, { cache: true })
        ])
            .then((response) => {
                return {
                    PayerMethodDictionary: response[0].data,
                    ClaimFillingIndicatorDictionary: response[1].data,
                    CmnBoxTypeDictionary: response[2].data
                };
            });
    }

    getPayerRulesDictionaries() {
        return this.$q.all([
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/resupply-programs/periods/dictionary`, { cache: true }),
            this.$http.get(`${this.WEB_API_SERVICE_URI}document-types/dictionary?filter.IsCmn=true`, { cache: true }),
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/due-date-cycle/dictionary`, { cache: true }),
        ])
            .then((response) => {
                return {
                    ResupplyPeriods: response[0].data,
                    Templates: response[1].data.Items,
                    DueDateCycles: response[2].data,
                };
            });
    }

    getList(filterObj, sortExpression, pageIndex, pageSize) {
        let params = this.infinityTableFilterService.getFilters(filterObj);

        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        if (params.claimCode) {
            params.claimCode = params.claimCode ? params.claimCode.Text : undefined;
        }

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers`, { params });
    }

    getPayersFromBilling(NameOrClaimCode, PageIndex) {
        let params = { NameOrClaimCode, PageIndex, SortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/health-care/payers`, { params });
    }

    getPayerIdList(ClaimCode, pageIndex) {
        let params = { ClaimCode, pageIndex };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/dictionary`, { params })
            .then((response) => {
                response.data.Items = _.uniqBy(response.data.Items, (item) => item.Text);
                return response;
            });
    }

    getPayersByName(payerName) {
        let params = { payerName };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/dictionary`, { params });
    }

    deletePayer(Id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/payers/${Id}`);
    }

    savePayerPromise() {
        if (this.model.isNew) {
            return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/payers`, this._getSaveModel());
        }
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/payers/${this.model.Id}`, this._getSaveModel());

    }

    savePayer() {
        // Check if billing tab filled
        if (!this.getDetailsInfoValid()) {
            this.$state.go('root.management.payer.details', { touchFormFields: true });
        } else if (!this.getBillingInfoValid()) {
            this.$state.go('root.management.payer.billing');
        } else {
            this.bsLoadingOverlayService.start({ referenceId: 'payerPage' });

            this.savePayerPromise()
                .then(() => {
                    this.ngToast.success(`Payer is ${this.model.Id ? 'updated' : 'created'}`);
                    this.emitAfterSave();
                //    this.$state.go('root.management.billing.payers');
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'payerPage' }));
        }
    }

    getPayer(Id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers/${Id}`);
    }

    getHcpcsCodes(name) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary?code=${name}`)
            .then((response) => response.data.Items);
    }

    getBillingInfoValid() {
        return this.model.BillingOptions && this.model.BillingOptions.Method;
    }

    getDetailsInfoValid() {
        let validInfo = true;

        this.model.Plans.forEach((plan) => {
            if (plan.isRequiredNameAndType && (!plan.Name || !plan.Type)) {
                validInfo = false;
            }
        });

        return validInfo && this.model.Name && (this.model.ClaimCode || this.model.PayerId);
    }

    _getSaveModel() {
        const $this = this;

        let saveModel = {
            Default: this.model.Default || false,
            EligibilityCode: this.model.EligibilityCode || '',
            ClaimCode: this.model.ClaimCode || this.model.PayerId || '',
            RemittanceCode: this.model.RemittanceCode || null,
            Name: this.model.Name,
            Plans: mapPayerPlans(this.model.Plans),
            BillingOptions: this.model.BillingOptions
        };

        if (this.model.Restrictions && !_.isEmpty(this.model.Restrictions)) {
            saveModel.Restrictions = angular.copy(this.model.Restrictions);

            for (let rule in saveModel.Restrictions) {
                if (rule === 'ResupplyModel') {
                    if (saveModel.Restrictions[rule]) {
                        mapHcpcsCodesAll(saveModel.Restrictions[rule].ResupplyRules, rule);
                    }
                    removeEmptyRule(saveModel.Restrictions, saveModel.Restrictions[rule].ResupplyRules, rule);
                } else {
                    if (saveModel.Restrictions[rule]) {
                        mapHcpcsCodesAll(saveModel.Restrictions[rule], rule);
                    }
                    removeEmptyRule(saveModel.Restrictions, saveModel.Restrictions[rule], rule);
                }
            }

        }

        return saveModel;

        function mapHcpcsCodesAll(rules, key) {
            if (Array.isArray(rules)) {
                rules.forEach((rule) => {
                    setRuleProps(rule, key);
                });
            } else {
                setRuleProps(rules, key);
            }
        }

        function setRuleProps(rule, key) {
            if (rule.selectedCode && rule.selectedCode.Id === 'All') {
                rule.HcpcsCodes = null;
                rule.All = true;
            } else {
                rule.All = false;
            }

            if (rule.Plans) {
                rule.PayerPlanIds = rule.Plans.map((plan) => plan.Id);
            }

            if (key !== 'PrescriptionRules' &&
                key !== 'RentalRules' &&
                key !== 'RenderingProviderRules' &&
                key !== 'AuthorizationRules' &&
                key !== 'TasksRules' &&
                key !== 'CombineRules' &&
                key !== 'SplitRules') {

                if (!rule.All && !rule.HcpcsCodes.length &&
                    rule.selectedCode && rule.selectedCode.Id) {
                    rule.HcpcsCodes.push(rule.selectedCode.Id);
                }
            }

            if (key === 'TasksRules') {
                rule.Tasks = rule.Tasks.map((task) => ({
                    Title: task.Title,
                    Description: task.Description,
                    DuePeriod: task.DuePeriod && task.DuePeriod.PeriodCount && task.DuePeriod.Cycle ?
                        {
                            PeriodCount: task.DuePeriod.PeriodCount,
                            Cycle: task.DuePeriod.Cycle ? task.DuePeriod.Cycle.Id : null,
                        }
                        : null,
                    AssignUsersIds: task.Assignee.map((user) => user.Id),
                }));
            }

            delete rule.Plans;
            delete rule.searchHcpcs;
            delete rule.selectedCode;
        }

        function removeEmptyRule(restrictions, rules, key) {
            if (Array.isArray(rules)) {
                if (_.isEmpty(rules)) {
                    delete restrictions[key];
                }
            } else {
                if (!rules.All && (!rules.HcpcsCodes || !rules.HcpcsCodes.length)) {
                    delete restrictions[key];
                }
            }
        }

        function mapPayerPlans(plans) {
            let plansCopy = angular.copy(plans);
            let newPlans = [];

            plansCopy.map($this.setPropRequired);
            plansCopy = plansCopy.filter((plan) => plan.isRequiredNameAndType);

            plansCopy.forEach((plan) => {
                let planObj = {
                    Id: plan.Id,
                    Name: plan.Name,
                    Type: plan.Type.Id,
                    ContactPerson: plan.ContactPerson
                };

                for (let prop in plan.Address) {
                    if (plan.Address[prop]) {
                        if (!planObj.Address) {
                            planObj.Address = {};
                        }
                        planObj.Address[prop] = plan.Address[prop];
                    }
                }

                plan.Contacts.forEach((item) => {
                    if (item.type && item.value) {
                        if (!planObj.Contacts) {
                            planObj.Contacts = [];
                        }
                        planObj.Contacts.push({
                            Value: item.value,
                            Type: item.type
                        });
                    }
                });

                newPlans.push(planObj);
            });

            return newPlans;
        }

    }

    setPropRequired(plan) {

        plan.isRequiredNameAndType = false;
        plan.hasNotFilledAddress = false;

        for (let prop in plan.Address) {
            if (plan.Address[prop]) {
                plan.hasNotFilledAddress = true;
            }
        }

        plan.isRequiredNameAndType = !!plan.Name ||
                                    !!plan.Type ||
                                    (plan.Contacts.length ? !!plan.Contacts[0].type : false) ||
                                    plan.hasNotFilledAddress ||
                                    !!plan.ContactPerson;

        return plan;
    }

    _mapRuleForAll(rule) {
        if (rule.All) {
            rule.selectedCode = {
                Description: '',
                Id: 'All',
                Text: 'All'
            };
            rule.searchHcpcs = 'All';
        }

        if (!rule.HcpcsCodes) {
            rule.HcpcsCodes = [];
        }

        rule.Plans = rule.PayerPlans || [];
        delete rule.PayerPlans;
    }
}
