import {
    inventoryPermissionsConstants,
    permissionsCategoriesConstants
} from '../core/constants/permissions.constants.es6';

export default function appConfig($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.inventory', {
            url: '/inventory',
            templateUrl: 'inventory/inventory-root.html',
            controller: 'inventoryRootCtrl as inventoryRoot',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Inventory'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.INVENTORY, inventoryPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.inventory.list', {
            url: '/list',
            templateUrl: 'inventory/components/inventory/inventory-list/inventory-list.html',
            controller: 'inventoryListController as invList',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Inventory'
            }
        })
        .state('root.inventory.purchase-orders', {
            url: '/purchase-orders',
            templateUrl: 'inventory/components/purchase-orders/purchase-orders-list/purchase-orders-list.html',
            controller: 'purchaseOrdersListController as purchaseListCtrl',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Purchase Orders'
            }
        })
        .state('root.purchase-order-add-items', {
            url: '/purchase-order/items/:purchaseOrderId',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/components/purchase-order-items/purchase-order-items.html',
            controller: 'purchaseOrderItemsController as purchaseOrderItems',
            params: {
                topMenu: 'Inventory',
                isFromManagePage: false,
                pageTitle: 'Purchase Order'
            }
        })
        .state('root.purchase-order-create', {
            url: '/purchase-order/new',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/components/purchase-order-manage/purchase-order-manage.html',
            controller: 'purchaseOrderManageController as purchaseOrderManage',
            params: {
                topMenu: 'Inventory',
                isFromItemsPage: false,
                pageTitle: 'Purchase Order'
            }
        })
        .state('root.purchase-order-modify', {
            url: '/purchase-order/:purchaseOrderId/modify',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/components/purchase-order-manage/purchase-order-manage.html',
            controller: 'purchaseOrderManageController as purchaseOrderManage',
            params: {
                topMenu: 'Inventory',
                isFromItemsPage: false,
                pageTitle: 'Purchase Order'
            }
        })
        .state('root.purchase-order', {
            url: '/purchase-order/:purchaseOrderId',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/purchase-order.html',
            controller: 'purchaseOrderController as purchaseOrder',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Purchase Order'
            }
        })
        .state('root.purchase-order.details', {
            url: '/details',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/components/purchase-order-details/purchase-order-details.html',
            controller: 'purchaseOrderDetailsController as purchaseOrderDetails',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Purchase Order'
            }
        })
        .state('root.purchase-order.audit', {
            url: '/audit',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/components/purchase-order-audit/purchase-order-audit.html',
            controller: 'purchaseOrderAuditController as purchaseOrderAudit',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Purchase Order'
            }
        })
        .state('root.purchase-order.audit-details', {
            url: '/audit/:purchaseOrderAuditId',
            templateUrl: 'inventory/components/purchase-orders/purchase-order/components/purchase-order-audit-details/purchase-order-audit-details.html',
            controller: 'purchaseOrderAuditDetailsController as purchaseOrderAuditDetails',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Purchase Order Audit'
            }
        })

        .state('root.inventory_item', {
            url: '/inventory/:equipmentId',
            templateUrl: 'inventory/views/inventory-page.html',
            controller: 'inventoryPageController as invPage',
            params: {
                topMenu: 'Inventory',
                equipmentId: undefined,
                pageTitle: 'Inventory Product'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.INVENTORY, inventoryPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.inventory_item.details', {
            url: '/details',
            templateUrl: 'inventory/views/inventory-details.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Product Details'
            }
        })
        .state('root.inventory_item.history', {
            url: '/history',
            templateUrl: 'inventory/views/inventory-history.html',
            controller: 'inventoryHistoryController as history',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Product History'
            }
        })
        .state('root.inventory_item.notes', {
            url: '/notes',
            templateUrl: 'inventory/views/inventory-notes.html',
            controller: 'equipmentNotesController as notes',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Product Notes'
            }
        })
        .state('root.receive_equipment', {
            url: '/receive-equipment',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment.html',
            controller: 'receiveEquipmentController as rec',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.INVENTORY, inventoryPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.receive_equipment.add', {
            url: '/add',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/receive-equipment-wizard.html',
            controller: 'receiveEquipmentWizardController as recWiz',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step1', {
            url: '/step1',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step1.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step1PurchaseOrder', {
            url: '/step1PurchaseOrder',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step1PurchaseOrder.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step2', {
            url: '/step2',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step2.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step3Serialized', {
            url: '/step3Serialized',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step3Serialized.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step4Serialized', {
            url: '/step4Serialized',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step4Serialized.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step3NonSerialized', {
            url: '/step3NonSerialized',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step3NonSerialized.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step5DeviceNumber', {
            url: '/step5DeviceNumber',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step5DeviceNumber.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step3BundleSerialNumber', {
            url: '/step3BundleSerialNumber',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step3BundleSerialNumber.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.receive_equipment.add.step3BundleLotNumber', {
            url: '/step3BundleLotNumber',
            templateUrl: 'inventory/components/receive-equipment/receive-equipment-wizard/step3BundleLotNumber.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Receive Items'
            }
        })
        .state('root.transfer_equipment', {
            url: '/transfer-equipment',
            templateUrl: 'inventory/views/transfer-equipment.html',
            controller: 'transferEquipmentController as trans',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Transfer Items'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.INVENTORY, inventoryPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        })
        .state('root.transfer_equipment.add', {
            url: '/add',
            templateUrl: 'inventory/views/transfer-equipment-wizard/transfer-equipment-wizard.html',
            controller: 'transferEquipmentWizardController as wiz',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Transfer Items'
            }
        })
        .state('root.transfer_equipment.add.step1', {
            url: '/step1',
            templateUrl: 'inventory/views/transfer-equipment-wizard/step1-from-location.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Transfer Items'
            }
        })
        .state('root.transfer_equipment.add.step2', {
            url: '/step2',
            templateUrl: 'inventory/views/transfer-equipment-wizard/step2-to-location.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Transfer Items'
            }
        })
        .state('root.transfer_equipment.add.step3', {
            url: '/step3',
            templateUrl: 'inventory/views/transfer-equipment-wizard/step3-product.html',
            params: {
                topMenu: 'Inventory',
                pageTitle: 'Transfer Items'
            }
        });

}

