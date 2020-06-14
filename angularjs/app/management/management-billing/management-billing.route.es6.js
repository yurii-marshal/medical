export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.management.billing', {
            url: '/billing',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function ($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.billing')) {
                        $state.go('root.management.billing.payers');
                    }
                }
                $scope.$on('$stateChangeSuccess', _ => checkState());
                checkState();
            }
        })
            .state('root.management.billing.payers', {
                url: '/payers',
                templateUrl: 'management/management-billing/views/payers.html',
                controller: 'payersController as payers',
                params: {
                    showNewPayerModal: null,
                    topMenu: 'Management',
                    pageTitle: 'Payers'
                }
            })
            .state('root.management.payer', {
                url: '/billing/payer/:id',
                template: '<ui-view/>',
                views: {
                    'payerPage': {
                        templateUrl: 'management/management-billing/views/payer.html',
                        controller: 'payerController as payer',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer'
                        }
                    }
                }
            })
                .state('root.management.payer.details', {
                    url: '/details',
                    templateUrl: 'management/management-billing/views/payerDetails.html',
                    controller: 'payerDetailsController as payerDetails',
                    params: {
                        topMenu: 'Management',
                        pageTitle: 'Payer Details',
                        touchFormFields: undefined
                    }
                })
                .state('root.management.payer.billing', {
                    url: '/billing',
                    templateUrl: 'management/management-billing/views/payerBilling.html',
                    controller: 'payerBillingController as payerBilling',
                    params: {
                        topMenu: 'Management',
                        pageTitle: 'Payer Billing'
                    }
                })
                .state('root.management.payer.rules', {
                    url: '/rules',
                    templateUrl: 'management/management-billing/views/payerRules.html',
                    controller: 'payerRulesController as payerRules',
                    params: {
                        topMenu: 'Management',
                        pageTitle: 'Payer Rules'
                    }
                })
                    .state('root.management.payer.rules.prescription', {
                        url: '/prescription',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesPrescription.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.rental', {
                        url: '/rental',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesRental.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.rendering-provider', {
                        url: '/rendering-provider',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesRenderingProvider.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.authorization', {
                        url: '/authorization',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesAuthorization.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.resupply', {
                        url: '/resupply',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesResupply.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.cmn', {
                        url: '/cmn',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesCMN.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.compilance', {
                        url: '/compilance',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesCompilance.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.tasks', {
                        url: '/tasks',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesTasks.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.combine', {
                        url: '/combine',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesCombineLineItems.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
                    .state('root.management.payer.rules.split', {
                        url: '/split',
                        templateUrl: 'management/management-billing/views/payer-rules/payerRulesSplitLineItems.html',
                        params: {
                            topMenu: 'Management',
                            pageTitle: 'Payer Rules'
                        }
                    })
            .state('root.management.billing.rendering', {
                url: '/rendering-providers',
                template: '<div class="has-infinite-table" ui-view></div>',
                controller: function ($state, $scope) {
                  function checkState() {
                    if ($state.is('root.management.billing.rendering')) {
                      $state.go('root.management.billing.rendering.list');
                    }
                  }
                  $scope.$on('$stateChangeSuccess', _ => checkState());
                  checkState();
                }
            })
            .state('root.management.billing.rendering.list', {
                templateUrl: 'management/management-billing/views/rendering-list.html',
                controller: 'renderingProvidersController as rendering',
                params: {
                    topMenu: 'Management',
                    pageTitle: 'Billing Rendering Providers',
                    leftMenu: 'Rendering Providers'
                }
            })
            .state('root.management.billing.rendering.add', {
                url: '/new',
                templateUrl: 'management/management-billing/components/rendering-provider/rendering-provider.html',
                controller: 'renderingProviderController as $ctrl',
                params: {
                  topMenu: 'Management',
                  leftMenu: 'Rendering Providers',
                  pageTitle: 'Add Rendering Provider'
                }
            })
            .state('root.management.billing.rendering.edit', {
                url: '/edit/:providerId',
                templateUrl: 'management/management-billing/components/rendering-provider/rendering-provider.html',
                controller: 'renderingProviderController as $ctrl',
                params: {
                  topMenu: 'Management',
                  leftMenu: 'Rendering Providers',
                  pageTitle: 'Edit Rendering Provider'
                }
            })
            .state('root.management.billing.providers_stripe_registration', {
                url:'/stripe?state&code&error_description',
                controller: 'providerRegistrationController',
                params: {
                    pageTitle: 'Stripe Registration'
                }
            })
            .state('root.management.billing.providers', {
                url: '/billing-providers',
                template: '<div class="has-infinite-table" ui-view></div>',
                controller: function ($state, $scope) {
                    function checkState() {
                        if ($state.is('root.management.billing.providers')) {
                            $state.go('root.management.billing.providers.list');
                        }
                    }
                    $scope.$on('$stateChangeSuccess', _ => checkState());
                    checkState();
                }
            })
                .state('root.management.billing.providers.list', {
                    templateUrl: 'management/management-billing/views/providers.html',
                    controller: 'billingProvidersController as providers',
                    params: {
                        topMenu: 'Management',
                        leftMenu: 'Billing Providers',
                        pageTitle: 'Billing Providers'
                    }
                })
                .state('root.management.billing.providers.add', {
                    url: '/new-billing-provider',
                    templateUrl: 'management/management-billing/components/billing-provider/billing-provider.html',
                    controller: 'billingProviderController as provider',
                    params: {
                        topMenu: 'Management',
                        leftMenu: 'Billing Providers',
                        pageTitle: 'Add Billing Provider'
                    }
                })
                .state('root.management.billing.providers.view', {
                    url: '/:providerId',
                    templateUrl: 'management/management-billing/components/billing-provider/billing-provider.html',
                    controller: 'billingProviderController as provider',
                    params: {
                        providerId: undefined,
                        redirectFromStripe: undefined,
                        topMenu: 'Management',
                        leftMenu: 'Billing Providers',
                        pageTitle: 'Edit Billing Provider'
                    }
                })
            .state('root.management.billing.pricing', {
                url: '/pricing',
                template: '<div class="has-infinite-table" ui-view></div>',
                controller: function ($state, $scope) {
                    function checkState() {
                        if ($state.is('root.management.billing.pricing')) {
                            $state.go('root.management.billing.pricing.list');
                        }
                    }
                    $scope.$on('$stateChangeSuccess', () => checkState());
                    checkState();
                }
            })
                .state('root.management.billing.pricing.list', {
                    templateUrl: 'management/management-billing/components/pricing/pricing-list/pricing.html',
                    controller: 'pricingListController as pricingList',
                    params: {
                        topMenu: 'Management',
                        leftMenu: 'Pricing',
                        pageTitle: 'Pricing'
                    }
                })
                .state('root.management.billing.pricing.add', {
                    url: '/new',
                    templateUrl: 'management/management-billing/components/pricing/manage-pricing/pricing-page.html',
                    controller: 'pricingController as pricing',
                    params: {
                        topMenu: 'Management',
                        leftMenu: 'Pricing',
                        pageTitle: 'Add Pricing'
                    }
                })
                .state('root.management.billing.pricing.edit', {
                    url: '/:pricingId',
                    templateUrl: 'management/management-billing/components/pricing/manage-pricing/pricing-page.html',
                    controller: 'pricingController as pricing',
                    params: {
                        pricingId: undefined,
                        topMenu: 'Management',
                        leftMenu: 'Pricing',
                        pageTitle: 'Edit Add Pricing'
                    }
                })
            .state('root.management.billing.hcpcs', {
                url: '/hcpcs',
                templateUrl: 'management/management-billing/views/hcpcs.html',
                controller: 'hcpcsController as hcpcs',
                params: {
                    topMenu: 'Management',
                    pageTitle: 'HCPCS/CPT'
                }
            })
            .state('root.management.billing.adjustment_reasons', {
                url: '/adjustment-reasons',
                templateUrl: 'management/management-billing/components/adjustment-reasons/adjustment-reasons.html',
                controller: 'adjustmentReasonsController',
                controllerAs: '$ctrl',
                params: {
                    topMenu: 'Management',
                    pageTitle: 'Adjustment Reasons'
                }
            });
}
