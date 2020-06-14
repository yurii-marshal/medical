import {
    permissionsCategoriesConstants,
    billingPermissionsConstants
} from '../core/constants/permissions.constants.es6';

export default function config($stateProvider, $urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.when('/billing/invoices/invoice/:invoiceId', '/billing/invoices/invoice/:invoiceId/details');

    $stateProvider
        .state('root.billing', {
            url: '/billing',
            templateUrl: 'billing/views/billing.html',
            controller: 'billingController as billing',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Billing'
            }
        })
        .state('root.billing.payments', {
            url: '/payments',
            templateUrl: 'billing/components/payments/payments.html',
            controller: 'paymentsController as payments',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Payments'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.billing.denials', {
            url: '/denials',
            templateUrl: 'billing/views/denials.html',
            controller: 'denialsController as denials',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Denials'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.billing.eob_era', {
            url: '/eob-era',
            templateUrl: 'billing/views/eob-era.html',
            controller: 'eobEraController as eob_era',
            params: {
                topMenu: 'Billing',
                pageTitle: 'EOB/ERA'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.billing.statistics', {
            url: '/statistics',
            templateUrl: 'billing/views/statistics.html',
            controller: 'statisticsController as stat',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Statistics'
            }
        })
        .state('root.billing.invoices', {
            url: '/invoices',
            templateUrl: 'billing/components/invoices/invoices.html',
            controller: 'invoicesController as invoices',
            params: {
                topMenu: 'Billing',
                filterByStatus: undefined,
                showNewInvoiceModal: null,
                predefinedPatient: null,
                pageTitle: 'Invoices'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {

                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => {
                                $state.go('root.no_access');
                            });
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.invoice', {
            url: '/billing/invoices/invoice/:invoiceId',
            templateUrl: 'billing/components/invoice/invoice.html',
            controller: 'invoiceController as invoice',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Invoice'
            }
        })
        .state('root.invoice.details', {
            url: '/details',
            templateUrl: 'billing/components/invoice/components/invoice-details/invoice-details.html',
            controller: 'invoiceDetailsCtrl as invoiceDetails',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Invoice Details',
                serviceLineId: undefined
            }
        })
        .state('root.invoice.eob_era', {
            url: '/eob-era',
            templateUrl: 'billing/views/invoice-eob-era.html',
            controller: 'invoiceEobEraController as eob_era',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Invoice EOB/ERA'
            }
        })
        .state('root.invoice.insurance', {
            url: '/insurance',
            templateUrl: 'billing/views/invoice-insurance.html',
            controller: 'invoiceInsuranceController as insurance',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Invoice Insurance'
            }
        })
        .state('root.invoice.audit', {
            url: '/audit',
            template: '<div ui-view></div>',
            controller: 'invoiceAuditController as audit',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Invoice Audit'
            }
        })
            .state('root.invoice.audit.list', {
                url: '/list',
                templateUrl: 'billing/components/invoice/components/invoice-audit/invoice-audit.html',
                params: {
                    topMenu: 'Billing',
                    pageTitle: 'Invoice Audit'
                }
            })
            .state('root.invoice.audit.details', {
                url: '/details/:operationId',
                templateUrl: 'billing/components/invoice/components/invoice-audit/audit-details.html',
                params: {
                    operationId: undefined,
                    topMenu: 'Billing',
                    pageTitle: 'Invoice Audit'
                }
            })
        .state('root.invoice.notes', {
            url: '/notes',
            templateUrl: 'billing/views/invoice-notes.html',
            controller: 'invoiceNotesController as notes',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Invoice Notes'
            }
        })
        .state('root.invoice.related', {
            url: '/related',
            templateUrl: 'billing/views/invoice-related.html',
            controller: 'relatedInvoicesController as related',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Related Invoices'
            }
        })
        .state('root.invoice.tasks', {
            url: '/tasks',
            templateUrl: 'billing/components/invoice/components/invoice-tasks/invoice-tasks.html',
            controller: 'invoiceTasksController as invoiceTasks',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Tasks'
            }
        })
        .state('root.newPayment', {
            url: '/billing/payment/new',
            templateUrl: 'billing/components/payment/payment.html',
            controller: 'paymentCtrl as paymentCtrl',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Add Payment'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })

        .state('root.newInvoicePayment', {
            url: '/billing/invoices/invoice/:invoiceId/payment/new',
            templateUrl: 'billing/components/payment/payment.html',
            controller: 'paymentCtrl as paymentCtrl',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Add Payment'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })

        .state('root.paymentDetails', {
            url: '/billing/payment/:paymentId/details',
            templateUrl: 'billing/components/payment/payment.html',
            controller: 'paymentCtrl as paymentCtrl',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Payment Details',
                scrollToInvoiceId: null
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    'paymentService',
                    function(userPermissions, $state) {

                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })

        .state('root.paymentEdit', {
            url: '/billing/payment/:paymentId/edit',
            templateUrl: 'billing/components/payment/payment.html',
            controller: 'paymentCtrl as paymentCtrl',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Edit Payment'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    'paymentService',
                    function(userPermissions, $state) {

                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })

        .state('root.modify', {
            url: '/billing/invoices/invoice/:invoiceId/modify',
            templateUrl: 'billing/components/modify-invoice/modify-invoice.html',
            controller: 'modifyInvoiceCtrl as modify',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Modify Invoice'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {

                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.newInvoice', {
            url: '/billing/invoices/create',
            templateUrl: 'billing/components/modify-invoice/modify-invoice.html',
            controller: 'modifyInvoiceCtrl as modify',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Create Invoice'
            }
        })
        .state('root.statements', {
            url: '/billing/statements',
            templateUrl: 'billing/components/statements/statements.html',
            controller: 'statementsController as statements',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Statements',
                filterByName: null
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.billing.prescriptions', {
            url: '/prescriptions',
            templateUrl: 'billing/components/prescriptions/prescriptions.html',
            controller: 'prescriptionsCtrl as prescriptions',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Prescriptions'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.billing.authorizations', {
            url: '/authorizations',
            templateUrl: 'billing/views/authorizations.html',
            controller: 'authorizationsController as authorizations',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Authorizations'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        })
        .state('root.billing.cmns', {
            url: '/cmns',
            templateUrl: 'billing/views/cmns.html',
            controller: 'cmnsController as cmns',
            params: {
                topMenu: 'Billing',
                pageTitle: 'Cmns'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.BILLING, billingPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }
                        return true;
                    }
                ]
            }
        });
}

