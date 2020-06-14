export default class ReportsContainerController {
    constructor($scope, $state, $window) {
        'ngInject';

        this.$state = $state;

        // Start tabs config

        this.config = {};

        this.config['accounts_receivable'] = {
            tabs: [
                {
                    title: 'A/R Aging Summary',
                    view: 'root.reports-v2.container.report({ reportsType: \'accounts_receivable\', sourceId: \'ARAgingSummary\' })',
                    isActive: false
                },
                {
                    title: 'A/R Aging By Insurance',
                    view: 'root.reports-v2.container.report({ reportsType: \'accounts_receivable\', sourceId: \'ARAgingByInsurance\' })',
                    isActive: false
                },
                {
                    title: 'A/R Aging By Patient',
                    view: 'root.reports-v2.container.report({ reportsType: \'accounts_receivable\', sourceId: \'ARAgingByPatient\' })',
                    isActive: false
                }
            ],
            title: 'Accounts Receivable'
        };

        this.config['payments'] = {
            tabs: [
                {
                    title: 'Payment Detail',
                    view: 'root.reports-v2.container.report({ reportsType: \'payments\', sourceId: \'PaymentDetails\' })',
                    isActive: false,
                    canCustomizeFilters: true
                }
            ],
            title: 'Payment report'
        };

        this.config['active_rentals'] = {
            tabs: [
                {
                    title: 'Active Rentals',
                    view: 'root.reports-v2.container.report({ reportsType: \'active_rentals\', sourceId: \'ActiveRentals\' })',
                    isActive: false,
                    canCustomizeFilters: true
                }
            ],
            title: 'Active rentals'
        };

        this.config['inventory'] = {
            tabs: [
                {
                    title: 'Inventory Audit',
                    view: 'root.reports-v2.container.report({ reportsType: \'inventory\', sourceId: \'InventoryAudit\' })',
                    isActive: false,
                    canCustomizeFilters: true
                },
                {
                    title: 'Costs of Goods Sold',
                    view: 'root.reports-v2.container.report({ reportsType: \'inventory\', sourceId: \'CostOfGoodsSold\' })',
                    isActive: false
                }
            ],
            title: 'Inventory'
        };

        this.setActiveTab(this.config);
        // End tabs Config

        this.title = this.config[$state.params.reportsType].title || '';
        this.tabs = this.config[$state.params.reportsType].tabs || [];

        $window.document.title = this.title;

        $scope.$on('$stateChangeSuccess', () => {
            this.setActiveTab(this.config);
            this.checkState();
        });

        this._activate();
    }

    _activate() {
        this.checkState();
    }

    setActiveTab(config) {

        Object.keys(config).forEach((tabKey) => {

            config[tabKey].tabs.forEach((tab) => {
                const paramsPart = tab.view.match(/\{([\S|\s]+)\}/)[1];

                if (paramsPart.match(this.$state.params.sourceId) && paramsPart.match(this.$state.params.reportsType)) {
                    tab.isActive = true;
                } else {
                    tab.isActive = false;
                }
            });

        });
    }

    checkState() {
        if (this.$state.is('root.reports-v2.container') || !this.$state.params.sourceId) {
            this.$state.go('root.reports-dashboard');
        }
    }
}
