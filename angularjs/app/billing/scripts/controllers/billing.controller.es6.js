export default class billingController {
    constructor($state, $scope, paymentsService, billingsCommonService) {
        'ngInject';

        this.$state = $state;
        this.$scope = $scope;
        this.paymentsService = paymentsService;
        this.billingsCommonService = billingsCommonService;

        this.activeTabName = 'Invoices';
        this.paymentsCount = 0;

        this.toolbarItems = [
            {
                text: 'New Invoice',
                icon: {
                    url: 'assets/images/default/plus-circle-thin.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: () => this.billingsCommonService.addInvoice(this.$state.params.predefinedPatient)
            },
            {
                text: 'Add Payment',
                icon: {
                    url: 'assets/images/default/card-plus.svg',
                    w: 24,
                    h: 20
                },
                clickFunction: this.billingsCommonService.addPayment.bind(this)
            },
            {
                text: 'Statements',
                icon: {
                    url: 'assets/images/default/list.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this.billingsCommonService.goStatements.bind(this)
            },
            {
                text: 'Import ERA',
                icon: {
                    url: 'assets/images/default/upload-v2.svg',
                    w: 14,
                    h: 17
                },
                clickFunction: () => {
                    this.billingsCommonService.billingImport(this.$state.current.name);
                }
            }
        ];

        this.tabs = [
            {
                'title': 'Invoices',
                'view': 'root.billing.invoices'
            },
            {
                'title': 'Payments',
                'view': 'root.billing.payments'
            },
            {
                'title': 'Denials',
                'view': 'root.billing.denials'
            }, /*
             {
             'title' : 'Statistics',
             'view' : 'root.billing.statistics'
             },*/
            {
                'title': 'EOB/ERA',
                'view': 'root.billing.eob_era'
            },
            {
                'title': 'Prescriptions',
                'view': 'root.billing.prescriptions'
            },
            {
                'title': 'Authorizations',
                'view': 'root.billing.authorizations'
            },
            {
                'title': 'CMNs',
                'view': 'root.billing.cmns',
                'className': 'no-uppercase'
            }
        ];

        $scope.$on('$stateChangeSuccess', () => {
            this.checkState();
        });

        $scope.$on('reloadPaymentsCount', () => {
            this.getPaymentsCount();
        });

        this.activate();
    }

    activate() {
        this.checkState();
        this.getPaymentsCount();
    }

    getPaymentsCount() {
        // this.paymentsService.getPaymentsTotalCount()
        //     .then((response) => {
        //         this.paymentsCount = response.data.Count;
        //         angular.forEach(this.toolbarItems, (item, key) => {
        //             if (item.toggleElementVisibility) {
        //                 this.toolbarItems[key].isHidden = !this.paymentsCount;
        //             }
        //         });
        //     });
    }

    checkState() {
        if (this.$state.is('root.billing')) {
            this.$state.go('root.billing.invoices');
        }

        switch (this.$state.current.name) {
            case 'root.billing.invoices':
                this.activeTabName = 'Invoices';
                break;

            case 'root.billing.payments':
                this.activeTabName = 'Payments';
                break;

            case 'root.billing.denials':
                this.activeTabName = 'Denials';
                break;

            case 'root.billing.eob_era':
                this.activeTabName = 'EOB/ERA';
                break;

            case 'root.billing.statistics':
                this.activeTabName = 'Statistics';
                break;

            case 'root.billing.prescriptions':
                this.activeTabName = 'Prescriptions';
                break;

            case 'root.billing.authorizations':
                this.activeTabName = 'Authorizations';
                break;

            case 'root.billing.cmns':
                this.activeTabName = 'CMNs';
                break;

            default:
                this.activeTabName = 'Invoices';
                break;
        }
    }

}

