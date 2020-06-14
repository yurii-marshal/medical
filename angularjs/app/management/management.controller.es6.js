export default class managementController {
    constructor($scope, $state) {
        'ngInject';

        this.$state = $state;

        this.isMainView = true;

        this._checkState();
        $scope.$on('$stateChangeSuccess', () => this._checkState());

        this.menuItems = [
            {
                name: 'Settings',
                icon: 'assets/images/default/management-sidebar/settings.svg',
                iconSize: {
                    width: 21,
                    height: 21
                },
                active: false,
                items: [
                    {
                        name: 'Orders',
                        state: 'root.management.settings.orders',
                        icon: 'assets/images/default/management-sidebar/settings-orders.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Statements',
                        state: 'root.management.settings.statements',
                        icon: 'assets/images/default/management-sidebar/settings-statements.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    }
                ]
            },
            {
                name: 'Team',
                icon: 'assets/images/default/user-square.svg',
                iconSize: {
                    width: 18,
                    height: 18
                },
                active: false,
                items: [
                    {
                        name: 'Setup',
                        state: 'root.management.personnel',
                        icon: 'assets/images/default/management-sidebar/personnel-setup.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Schedule',
                        state: 'root.management.personnel_calendar.index',
                        icon: 'assets/images/default/management-sidebar/personnel-schedule.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    }
                ]
            },
            {
                name: 'Patient Service Centers',
                icon: 'assets/images/default/user-calendar.svg',
                iconSize: {
                    width: 18,
                    height: 21
                },
                active: false,
                items: [
                    {
                        name: 'Setup',
                        state: 'root.management.service_centers',
                        icon: 'assets/images/default/management-sidebar/patient-sc-setup.svg',
                        iconSize: {
                            width: 21,
                            height: 23
                        }
                    },
                    {
                        name: 'Schedule',
                        state: 'root.management.setup_center',
                        icon: 'assets/images/default/management-sidebar/patient-sc-schedule.svg',
                        iconSize: {
                            width: 21,
                            height: 23
                        }
                    }
                ]
            },
            {
                name: 'Organization',
                icon: 'assets/images/default/organization.svg',
                iconSize: {
                    width: 20,
                    height: 18
                },
                active: false,
                items: [
                    {
                        name: 'Setup',
                        state: 'root.management.organization.setup',
                        icon: 'assets/images/default/management-sidebar/organization-setup.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Locations',
                        state: 'root.management.organization.locations',
                        icon: 'assets/images/default/management-sidebar/organization-locations.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Facilities',
                        state: 'root.management.organization.facilities',
                        icon: 'assets/images/default/management-sidebar/organization-facilities.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Referring Providers',
                        state: 'root.management.organization.referral',
                        icon: 'assets/images/default/management-sidebar/organization-referrals.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    }
                ]
            },
            {
                name: 'Billing',
                icon: 'assets/images/default/management-sidebar/management-billing.svg',
                iconSize: {
                    width: 18,
                    height: 18
                },
                active: false,
                items: [
                    {
                        name: 'Payers',
                        state: 'root.management.billing.payers',
                        icon: 'assets/images/default/management-sidebar/payers.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Rendering Providers',
                        state: 'root.management.billing.rendering',
                        icon: 'assets/images/default/management-sidebar/rendering-providers.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Billing Providers',
                        state: 'root.management.billing.providers',
                        icon: 'assets/images/default/management-sidebar/billing-provider.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Pricing',
                        state: 'root.management.billing.pricing',
                        icon: 'assets/images/default/management-sidebar/pricing.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'HCPCS/CPT',
                        state: 'root.management.billing.hcpcs',
                        icon: 'assets/images/default/management-sidebar/hcpcs.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    },
                    {
                        name: 'Adjustment Reasons',
                        state: 'root.management.billing.adjustment_reasons',
                        icon: 'assets/images/default/management-sidebar/ic-manag-bill-adj.svg',
                        iconSize: {
                            width: 21,
                            height: 21
                        }
                    }
                ]
            },
            {
                name: 'Inventory',
                icon: 'assets/images/default/inventory.svg',
                iconSize: {
                    width: 20,
                    height: 22
                },
                active: false,
                items: [
                    {
                        name: 'Manufacturers',
                        state: 'root.management.inventory.manufacturers',
                        icon: 'assets/images/default/management-sidebar/inv-manufacturers.svg',
                        iconSize: {
                            width: 22,
                            height: 22
                        }
                    },
                    {
                        name: 'Categories',
                        state: 'root.management.inventory.categories',
                        icon: 'assets/images/default/management-sidebar/inv-categories.svg',
                        iconSize: {
                            width: 22,
                            height: 22
                        }
                    },
                    {
                        name: 'Groups',
                        state: 'root.management.inventory.groups',
                        icon: 'assets/images/default/management-sidebar/inv-groups.svg',
                        iconSize: {
                            width: 22,
                            height: 22
                        }
                    },
                    {
                        name: 'Locations',
                        state: 'root.management.inventory.locations',
                        icon: 'assets/images/default/management-sidebar/inv-locations.svg',
                        iconSize: {
                            width: 22,
                            height: 22
                        }
                    },
                    {
                        name: 'Catalog',
                        state: 'root.management.inventory.products.list',
                        menu_state: 'root.management.inventory.product',    // overrides real state at menu to avoid extra inheritance in state tree
                        icon: 'assets/images/default/management-sidebar/inv-products.svg',
                        iconSize: {
                            width: 22,
                            height: 22
                        }
                    },
                    {
                        name: 'Vendors',
                        state: 'root.management.inventory.vendors',
                        icon: 'assets/images/default/management-sidebar/ic-manag-inv-vendor.svg',
                        iconSize: {
                            width: 22,
                            height: 22
                        }
                    }
                ]
            }
        ];
    }

    _checkState() {
        if (this.$state.is('root.management')) {
            this.$state.go('root.management.personnel');
        }

        if (this.$state.is('root.management.payer') || this.$state.includes('root.management.payer')) {
            this.isMainView = false;
        } else {
            this.isMainView = true;
        }
    }
}
