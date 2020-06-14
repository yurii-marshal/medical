import {
    ordersPermissionsConstants,
    permissionsCategoriesConstants
} from '../core/constants/permissions.constants.es6';

export default function config($stateProvider) {
    'ngInject';
    $stateProvider
        .state('root.orders', {
            url: '/orders',
            abstract: true,
            template: '<ui-view/>',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Orders'
            }
        })
        .state('root.orders.list', {
            url: '',
            templateUrl: 'orders/components/orders/orders.html',
            controller: 'ordersController as orders',
            params: {
                filterByStatus: undefined,
                filterByTagName: null,
                filterByPatientName: undefined,
                resupplyProgramId: null,
                orderTypes: 0,
                orderName: null,
                topMenu: 'Orders',
                pageTitle: 'Orders'
            }
        })
        .state('root.orders.list_new', {
            url: '/new',
            templateUrl: 'orders/components/orders/orders.html',
            controller: 'ordersController as orders',
            params: {
                filterByStatus: [ 2 ],     // API: 2 - New
                topMenu: 'Orders',
                pageTitle: 'Orders'
            }
        })
        .state('root.orders.order', {
            url: '/order/:orderId',
            templateUrl: 'orders/components/order/order.html',
            controller: 'orderController as order',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Order'
            }
        })
        .state('root.orders.order.details', {
            url: '/details',
            templateUrl: 'orders/components/order/components/order-details/order-details.html',
            controller: 'orderDetailsCtrl as details',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Order Details'
            }
        })
        .state('root.orders.order.items', {
            url: '/items',
            templateUrl: 'orders/views/order-items.html',
            controller: 'orderItemsController as ordItems',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Order Items'
            }
        })
        .state('root.orders.order.documents', {
            url: '/documents',
            templateUrl: 'orders/views/documents.html',
            controller: 'orderDocumentsController as documents',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Order Documents'
            }
        })
        .state('root.orders.order.notes', {
            url: '/notes',
            templateUrl: 'orders/views/orderNotes.html',
            controller: 'orderNotesController as notes',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Order Notes'
            }
        })
        .state('root.orders.order.financial', {
            url: '/financial',
            templateUrl: 'orders/views/order-financial.html',
            controller: 'orderFinancialController as financial',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Order Financial'
            }
        })
        .state('root.orders.order.expense', {
            url: '/expense',
            templateUrl: 'orders/components/order/components/expense-estimates/expense-estimates.html',
            controller: 'expenseEstimatesCtrl as expense',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Cost Sharing'
            }
        })
        .state('root.orders.appendTrackingItems', {
            url: '/orderId/:orderId/patientId/:patientId/append-tracking-items',
            templateUrl: 'orders/views/append-tracking-items.html',
            controller: 'appendTrackingItemsController as appendItems',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Append Tracking Items'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.ORDERS, ordersPermissionsConstants.ORDER_MODIFY)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })

        .state('root.orders.quick_ship', {
            url: '/:orderId/quick-ship-details/:itemId/:patientId',
            templateUrl: 'orders/components/quick-ship/quick-ship.html',
            controller: 'quickShipCtrl as quickShip',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Shipment Details',
                itemId: 'update'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.ORDERS, ordersPermissionsConstants.ORDER_MODIFY)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.orders.quick_ship.items', {
            url: '/items',
            templateUrl: 'orders/components/quick-ship/components/quick-ship-items/quick-ship-items.html',
            controller: 'quickShipItemsCtrl as shipItems',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Shipment Details'
            }
        })
        .state('root.orders.quick_ship.add_items', {
            url: '/add_items',
            templateUrl: 'orders/components/quick-ship/components/quick-ship-add-model/quick-ship-add-model.html',
            controller: 'quickShipAddModelCtrl as shipAddModel',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Shipment Details'
            }
        })
        .state('root.orders.quick_ship.inventory_pick', {
            url: '/inventory-pick',
            templateUrl: 'orders/components/quick-ship/components/quick-ship-inventory-pick/quick-ship-inventory-pick.html',
            controller: 'quickShipInventoryPickCtrl as pick',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Shipment Details',
                ExcludeLocationId: true
            }
        })
        .state('root.orders.edit', {
            url: '/:orderId/edit',
            templateUrl: 'orders/components/orders/components/manage-order/order-wizard.html',
            controller: 'orderWizardController as orderWizard',
            params: {
                topMenu: 'Orders',
                isFromPhys: false,
                orderId: null,
                pageTitle: 'Edit Order'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.ORDERS, ordersPermissionsConstants.ORDER_MODIFY)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.orders.edit.step1', {
            url: '/step1',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step1/order-wizard-step1.html',
            controller: 'orderWizardStep1Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.edit.step2', {
            url: '/step2',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step2/order-wizard-step2.html',
            controller: 'orderWizardStep2Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.edit.step3', {
            url: '/step3',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step3/order-wizard-step3.html',
            controller: 'orderWizardStep3Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.edit.step4', {
            url: '/step4',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step4/order-wizard-step4.html',
            controller: 'orderWizardReviewItemsController as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.edit.step5', {
            url: '/step5',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step5/order-wizard-step5.html',
            controller: 'orderWizardStep5Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.edit.step6', {
            url: '/step6',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step6/order-wizard-step6.html',
            controller: 'orderWizardStep6Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.edit.step7', {
            url: '/step7',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step7/order-wizard-step7.html',
            controller: 'orderWizardStep7Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Edit Order'
            }
        })
        .state('root.orders.add', {
            url: '/add',
            templateUrl: 'orders/components/orders/components/manage-order/order-wizard.html',
            controller: 'orderWizardController as orderWizard',
            params: {
                topMenu: 'Orders',
                patient: undefined,
                pageTitle: 'Add New Order'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.ORDERS, ordersPermissionsConstants.ORDER_MODIFY)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.orders.add.step1', {
            url: '/step1',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step1/order-wizard-step1.html',
            controller: 'orderWizardStep1Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })
        .state('root.orders.add.step2', {
            url: '/step2',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step2/order-wizard-step2.html',
            controller: 'orderWizardStep2Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })
        .state('root.orders.add.step3', {
            url: '/step3',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step3/order-wizard-step3.html',
            controller: 'orderWizardStep3Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })
        .state('root.orders.add.step4', {
            url: '/step4',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step4/order-wizard-step4.html',
            controller: 'orderWizardReviewItemsController as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })
        .state('root.orders.add.step5', {
            url: '/step5',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step5/order-wizard-step5.html',
            controller: 'orderWizardStep5Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })
        .state('root.orders.add.step6', {
            url: '/step6',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step6/order-wizard-step6.html',
            controller: 'orderWizardStep6Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })
        .state('root.orders.add.step7', {
            url: '/step7',
            templateUrl: 'orders/components/orders/components/manage-order/manage-wizard/order-wizard-step7/order-wizard-step7.html',
            controller: 'orderWizardStep7Controller as step',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Add New Order'
            }
        })

        // COMPLETE ORDER WIZARD
        .state('root.completeOrder', {
            url: '/orders/:orderId/patientId/:patientId/complete',
            templateUrl: 'calendar/components/complete-wizard/complete-wizard.html',
            controller: 'completeWizardController',
            controllerAs: 'complete',
            data: {
                showPopupBeforeLeave: true
            },
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.ORDERS, ordersPermissionsConstants.ORDER_MODIFY)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.completeOrder.step1', {
            url: '/step1',
            template: '<ui-view/>',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })
        .state('root.completeOrder.step1.equipments', {
            url: '/equipments',
            templateUrl: 'calendar/components/complete-wizard/equipment/equipment.html',
            controller: 'completeWizardEquipmentController',
            controllerAs: 'equipment',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })
        .state('root.completeOrder.step1.add', {
            url: '/add',
            templateUrl: 'calendar/components/complete-wizard/equipment/search-items.html',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })

        .state('root.completeOrder.step2', {
            url: '/step2',
            template: '<ui-view/>',
            controller: 'completeWizardResupplyController',
            controllerAs: 'resupply',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })
        .state('root.completeOrder.step2.resupply', {
            url: '/resupply-program',
            templateUrl: 'calendar/components/complete-wizard/resupply/resupply-program.html',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })
        .state('root.completeOrder.step2.add', {
            url: '/add',
            templateUrl: 'calendar/components/complete-wizard/resupply/search-items.html',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })
        .state('root.completeOrder.step3', {
            url: '/step3',
            templateUrl: 'calendar/components/complete-wizard/note/note.html',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        })
        .state('root.completeOrder.step4', {
            url: '/step4',
            templateUrl: 'calendar/components/complete-wizard/summary/summary.html',
            controller: 'completeWizardSummaryController',
            controllerAs: 'summary',
            params: {
                topMenu: 'Orders',
                pageTitle: 'Complete Order'
            }
        });
}
