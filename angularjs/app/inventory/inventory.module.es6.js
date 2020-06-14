// Config
import config from './inventory.route.es6';

// Controllers
import inventoryController from './scripts/controllers/inventory.controller.es6';
import inventoryListController from './components/inventory/inventory-list/inventory-list.controller.es6.js';
import inventoryPageController from './scripts/controllers/inventoryPage.controller.es6';
import receiveEquipmentController from './components/receive-equipment/receive-equipment.controller.es6.js';
import receiveEquipmentWizardController from './components/receive-equipment/receive-equipment-wizard/receiveEquipmentWizard.controller.es6.js';
import transferEquipmentController from './scripts/controllers/transferEquipment.controller.es6';
import transferEquipmentWizardController from './scripts/controllers/transferEquipmentWizard.controller.es6';
import inventoryHistoryController from './scripts/controllers/inventoryHistory.controller.es6';
import equipmentNotesController from './scripts/controllers/equipmentNotes.controller.es6';
import locationDialogController from './components/receive-equipment/modals/location-dialog/location-dialog.controller.es6.js';
import locationComplexDialogController from './scripts/controllers/modals/locationComplexDialog.controller.es6';
import selectProductDialogController from './scripts/controllers/modals/selectProductDialog.controller.es6';
import qtyDialogController from './scripts/controllers/modals/qtyDialog.controller.es6';
import productsDialogController from './scripts/controllers/modals/productsDialog.controller.es6';
import notesDialogController from './scripts/controllers/modals/notesDialog.controller.es6';
import modifyPurchasePriceController from './components/receive-equipment/modals/modify-purchase-price/modify.purchase.price.controller.es6.js';
import InventoryRootCtrl from './inventory-root.controller.es6';
import PurchaseOrdersListController
    from './components/purchase-orders/purchase-orders-list/purchase-orders-list.controller.es6';
import PurchaseOrderController from './components/purchase-orders/purchase-order/purchase-order.controller.es6';
import PurchaseOrderAuditController
    from './components/purchase-orders/purchase-order/components/purchase-order-audit/purchase-order-audit.controller.es6';
import PurchaseOrderAuditDetailsController
    from './components/purchase-orders/purchase-order/components/purchase-order-audit-details/purchase-order-audit-details.controller.es6';
import PurchaseOrderDetailsController
    from './components/purchase-orders/purchase-order/components/purchase-order-details/purchase-order-details.controller.es6';
import PurchaseOrderManageController
    from './components/purchase-orders/purchase-order/components/purchase-order-manage/purchase-order-manage.controller.es6';
import PurchaseOrderItemsController
    from './components/purchase-orders/purchase-order/components/purchase-order-items/purchase-order-items.controller.es6';

// Services
import inventoryEquipmentService from './scripts/services/inventoryEquipment.service.es6';
import receiveEquipmentService from './scripts/services/receiveEquipment.service.es6';
import transferEquipmentService from './scripts/services/transferEquipment.service.es6';
import inventoryImportService from './scripts/services/inventory.import.service.es6';
import PurchaseOrderManageService from './components/purchase-orders/purchase-order/shared/services/purchase-order-manage.service.es6';

export default angular
    .module('app.inventory', [])
    .config(config)

    // Controllers
    .controller('inventoryController', inventoryController)
    .controller('inventoryListController', inventoryListController)
    .controller('inventoryPageController', inventoryPageController)
    .controller('receiveEquipmentController', receiveEquipmentController)
    .controller('receiveEquipmentWizardController', receiveEquipmentWizardController)
    .controller('transferEquipmentController', transferEquipmentController)
    .controller('transferEquipmentWizardController', transferEquipmentWizardController)
    .controller('inventoryHistoryController', inventoryHistoryController)
    .controller('equipmentNotesController', equipmentNotesController)
    .controller('locationDialogController', locationDialogController)
    .controller('locationComplexDialogController', locationComplexDialogController)
    .controller('selectProductDialogController', selectProductDialogController)
    .controller('qtyDialogController', qtyDialogController)
    .controller('productsDialogController', productsDialogController)
    .controller('notesDialogController', notesDialogController)
    .controller('modifyPurchasePriceController', modifyPurchasePriceController)
    .controller('inventoryRootCtrl', InventoryRootCtrl)
    .controller('purchaseOrdersListController', PurchaseOrdersListController)
    .controller('purchaseOrderController', PurchaseOrderController)
    .controller('purchaseOrderAuditController', PurchaseOrderAuditController)
    .controller('purchaseOrderAuditDetailsController', PurchaseOrderAuditDetailsController)
    .controller('purchaseOrderDetailsController', PurchaseOrderDetailsController)
    .controller('purchaseOrderManageController', PurchaseOrderManageController)
    .controller('purchaseOrderItemsController', PurchaseOrderItemsController)

    // Services
    .service('inventoryEquipmentService', inventoryEquipmentService)
    .service('receiveEquipmentService', receiveEquipmentService)
    .service('transferEquipmentService', transferEquipmentService)
    .service('inventoryImportService', inventoryImportService)
    .service('purchaseOrderManageService', PurchaseOrderManageService)
    .name;
