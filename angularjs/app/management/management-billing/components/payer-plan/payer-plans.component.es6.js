import template from './payer-plans.html';

import removePlanConfirmationTemplate from './modals/remove-plan-confirmation/remove-plan-confirmation.html';
import removePlanConfirmationController from './modals/remove-plan-confirmation/remove-plan-confirmation.controller.es6';

class payerPlansCtrl {
    constructor(
        $scope,
        payersService,
        $timeout,
        $mdDialog) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.objKeyToTabNameMap = {
            'AuthorizationRules': 'Authorization',
            'CmnRules': 'CMN',
            'TasksRules': 'Tasks',
            'CombineRules': 'Combine line items',
            'ComplianceRules': 'Compliance',
            'PrescriptionRules': 'Prescription',
            'RentalRules': 'Rental',
            'RenderingProviderRules': 'Rendering Provider',
            'ResupplyModel': 'Resupply',
            'SplitRules': 'Split line items'
        };

        this.planTypesDictionary = [];

        payersService.getPlanTypesDictionary()
            .then((response) => this.planTypesDictionary = response.data);

        $scope.$watch(() => this.plans, (newVal) => {
            if (!newVal) {
                return;
            }

            newVal.map(payersService.setPropRequired);
            $timeout(() => {
                this.plansForm.$setUntouched();
                touchedErrorFields(this.plansForm);
            });

        }, true);
    }

    _isPresentPlanOnRestrictions(removedPlan, restrictions) {
        const tabs = [];

        function isPresentOnTab(removedPlan, rules) {
            let isHasRemovedPlan = false;

            rules.forEach((rule) => {
                if (rule.Plans.find((plan) => plan.Id === removedPlan.Id)) {
                    isHasRemovedPlan = true;
                }
            });

            return isHasRemovedPlan;
        }

        Object.keys(restrictions).forEach((restriction) => {
            if (restriction === 'ResupplyModel') {
                if (isPresentOnTab(removedPlan, restrictions[restriction].ResupplyRules)) {
                    tabs.push(restriction);
                }
            } else {
                if (isPresentOnTab(removedPlan, restrictions[restriction])) {
                    tabs.push(restriction);
                }
            }
        });

        return tabs;
    }

    removePlanFromRestrictions(removedPlan, restrictions) {
        function removePlanFromRules(removedPlan, rules) {
            rules.forEach((rule) => {
                rule.Plans = rule.Plans.filter((plan) => plan.Id !== removedPlan.Id);
            });
        }

        Object.keys(restrictions).forEach((restriction) => {
            if (restriction === 'ResupplyModel') {
                removePlanFromRules(removedPlan, restrictions[restriction].ResupplyRules);
            } else {
                removePlanFromRules(removedPlan, restrictions[restriction]);
            }
        });
    }

    removePayerPlan(index) {
        const removedPlan = this.plans[index],
            removedPlanIsPresentOnTabs = this._isPresentPlanOnRestrictions(removedPlan, this.restrictions);

        if (removedPlanIsPresentOnTabs.length) {
            this.$mdDialog.show({
                template: removePlanConfirmationTemplate,
                controller: removePlanConfirmationController,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {
                    tabs: removedPlanIsPresentOnTabs.map((key) => this.objKeyToTabNameMap[key]).join(', '),
                    planName: removedPlan.Name
                }
            }).then((isRemove) => {
                if (isRemove) {
                    this.removePlanFromRestrictions(removedPlan, this.restrictions);
                    this.plans.splice(index, 1);
                }
            });
        } else {
            this.plans.splice(index, 1);
        }
    }
}

const payerPlans = {
    bindings: {
        plans: '=',
        restrictions: '='
    },
    template,
    controller: payerPlansCtrl
};

export default payerPlans;
