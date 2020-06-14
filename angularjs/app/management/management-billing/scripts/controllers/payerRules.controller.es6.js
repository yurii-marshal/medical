export default class payerRulesController {
    constructor(
        $scope,
        $state,
        $timeout,
        ngToast,
        bsLoadingOverlayService,
        coreUsersService,
        payersService
    ) {
        'ngInject';

        this.$state = $state;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.coreUsersService = coreUsersService;
        this.payersService = payersService;

        this.model = payersService.getModel();
        this.payerId = $state.params.id;

        this.showRuleView = false;

        this.dictionaries = [];
        this.searchRulesHcpcs = undefined;

        bsLoadingOverlayService.start({ referenceId: 'payerPage' });
        payersService.getPayerRulesDictionaries()
            .then((response) => {
                this.dictionaries = response;
                this.refetchTemplates();
            })
            .finally(() => bsLoadingOverlayService.stop({ referenceId: 'payerPage' }));

        $scope.$on('$stateChangeSuccess', () => this._checkState());
        $scope.$on('$viewContentLoading', () => this.showRuleView = false);
        $scope.$on('$viewContentLoaded', () => this.showRuleView = true);

        this.plansChips = [];

        this._checkState();
    }

    getPlaceholderForPlanChips(plansChips) {
        return plansChips && plansChips.length ? '' : 'No plan selected (Rule applied for all patients)';
    }

    _checkState() {
        this.searchRulesHcpcs = undefined;
        if (this.$state.is('root.management.payer.rules')) {
            this.$state.go('root.management.payer.rules.prescription');
        }
    }

    isActive(view) {
        return this.$state.current.name.indexOf(view) !== -1;
    }

    getUsersDictionary(name, selected) {
        const params = {
            'filter.fullName': name,
            pageIndex: 0,
            pageSize: 24
        };

        return this.coreUsersService.getUsersDictionary(params)
            .then((response) => {
                return response.data.filter((user) => !selected.find((item) => item.Id.toString() === user.Id.toString()));
            });
    }

    getHcpcsCodes(name) {
        return this.payersService.getHcpcsCodes(name);
    }

    getResupplyHcpcsCodes(name) {
        return this.payersService.getHcpcsCodes(name)
            .then((response) => {
                if (!this.isAtLeastOneRuleHasAllHcpcsCodes()) {
                    response.unshift({
                        Description: '',
                        Id: 'All',
                        Text: 'All'
                    });
                }
                return response;
            });
    }

    isAtLeastOneRuleHasAllHcpcsCodes() {
        return !!this.model.Restrictions.ResupplyModel.ResupplyRules.find((rule) => rule.selectedCode && rule.selectedCode.Id === 'All');
    }

    getHcpcsCodesWithAllParam(name) {
        return this.payersService.getHcpcsCodes(name)
            .then((response) => {
                response.unshift({
                    Description: '',
                    Id: 'All',
                    Text: 'All'
                });
                return response;
            });
    }

    addHcpcsCode(rule) {
        if (rule.selectedCode.Id === 'All') {
            rule.HcpcsCodes = [];
            rule.All = true;
            return;
        }

        let index = _.findIndex(rule.HcpcsCodes,
                (code) => code.Id ? rule.selectedCode.Id === code.Id : rule.selectedCode.Id === code);

        if (index === -1) {
            if (!rule.HcpcsCodes) {
                rule.HcpcsCodes = [];
            }

            if (rule.All) {
                rule.All = false;
            }
            rule.HcpcsCodes.push(rule.selectedCode.Id);

            this.$timeout((_) => {
                rule.selectedCode = undefined;
                rule.searchHcpcs = '';
            });
        }
    }

    deleteRule(arr, index, ruleType) {
        const codeList = angular.copy(arr[index].HcpcsCodes);

        arr.splice(index, 1);
        this.refetchTemplates();

        if (!ruleType) {
            return;
        } // don't touch uniqueCodesList in this case

        const removeCodeFromUniqueList = ruleType === 'compliance' ?
            this.removeComplianceCode :
            this.removeResupplyCode;

        const uniqueCodesList = ruleType === 'compliance' ?
            this.model.compilanceHcpcsCodes :
            this.model.resupplyHcpcsCodes;

        codeList.forEach((code) => {
            removeCodeFromUniqueList.call(this, uniqueCodesList, code);
        });
    }

    removeCode(arr, code) {
        let index = _.findIndex(arr, (item) => code === item);

        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    removeResupplyCode(arr, code) {
        this._removeUniqueCode(arr, code, this.model.resupplyHcpcsCodes);
    }

    removeComplianceCode(arr, code) {
        this._removeUniqueCode(arr, code, this.model.compilanceHcpcsCodes);
    }

    _removeUniqueCode(arr, code, uniqueArr) {
        let index = arr.indexOf(code),
            indexGlobal = uniqueArr.indexOf(code);

        if (index !== -1) {
            arr.splice(index, 1);
        }
        if (indexGlobal !== -1) {
            uniqueArr.splice(index, 1);
        }
    }

    clearSelectedHcpcs(arr) {
        arr.HcpcsCodes = [];
    }

    //* *** ResupplyRule has collection
    addResupplyRule() {
        this.model.Restrictions.ResupplyModel.ResupplyRules.push({
            HcpcsCodes: [],
            All: undefined,
            Frequency: undefined,
            Period: undefined,
            PeriodType: undefined,
            Plans: []
        });
    }

    //* *** CmnRule has collection
    addCmnRule() {
        this.model.Restrictions.CmnRules.push({
            HcpcsCodes: [],
            Plans: [],
            All: undefined,
            TemplateId: undefined
        });
        this.refetchTemplates();
    }

    //* *** CompilanceRule has collection
    addCompilanceRule() {
        this.model.Restrictions.ComplianceRules.push({
            HcpcsCodes: [],
            Plans: [],
            EvaluationPeriod: undefined,
            BestUsagePeriod: undefined,
            MinUsagePerDay: undefined,
            Percentage: undefined
        });
    }

    addPrescriptionRule() {
        this.model.Restrictions.PrescriptionRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: []
        });
    }

    addRentalRule() {
        this.model.Restrictions.RentalRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: []
        });
    }

    addRenderingProviderRule() {
        this.model.Restrictions.RenderingProviderRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: []
        });
    }

    addAuthorizationRule() {
        this.model.Restrictions.AuthorizationRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: []
        });
    }

    addTasksRule() {
        this.model.Restrictions.TasksRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: [],
            Tasks: [],
        });
    }

    addRuleTask(rule) {
        rule.Tasks.push({
            Title: null,
            Description: null,
            DuePeriod: {
                PeriodCount: null,
                Cycle: null,
            },
            Assignee: [],
        });
    }

    removeRuleTask(rule, index) {
        rule.Tasks.splice(index, 1);
    }

    addCombineRule() {
        this.model.Restrictions.CombineRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: []
        });
    }

    addSplitRule() {
        this.model.Restrictions.SplitRules.push({
            HcpcsCodes: [],
            All: undefined,
            Plans: []
        });
    }

    removeRule(key, index) {
        this.model.Restrictions[key].splice(index, 1);
    }

    getPlans(query, selectedPlans) {
        return new Promise((resolve) => {

            const items = this.model.Plans.filter((plan) => {
                const planIsSelected = selectedPlans.find((selectedPlan) => selectedPlan.Id === plan.Id);

                return plan.Id && plan.Name.toLowerCase().indexOf(query.toLowerCase()) > -1 && !planIsSelected;
            });

            resolve(items);
        });

    }

    searchChanged() {
        if (!this.searchRulesHcpcs.HcpcsCodes) {
            this.searchRulesHcpcs = undefined;
        }
    }

    refetchTemplates() {
        this.dictionaries.Templates.forEach((t) => {
            if (this.model.Restrictions) {
                t.alreadySelected = _.find( this.model.Restrictions.CmnRules,
                        (r) => r.TemplateId === t.Id ) !== undefined;
            }
        });
    }

    ruleChanged() {
        this.refetchTemplates();
    }

    cancel() {
        this.payersService.setDefaultModel();
        this.$state.go('root.management.billing.payers');
    }

    save() {
        if (this.RulesForm.$valid) {
            this.payersService.savePayer();
        } else {
            touchedErrorFields(this.RulesForm);
        }
    }
}
