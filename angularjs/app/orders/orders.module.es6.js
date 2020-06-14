// Config
import config from './orders.route.es6';

// Controllers
import ordersController from './components/orders/orders.controller.es6.js';
import orderController from './components/order/order.controller.es6.js';
import OrderDetailsCtrl from './components/order/components/order-details/order-details.controller.es6';
import orderItemsController from './scripts/controllers/orderItems.controller.es6';
import appendTrackingItemsController from './scripts/controllers/appendTrackingItems.controller.es6';
import orderDocumentsController from './scripts/controllers/orderDocuments.controller.es6';
import orderNotesController from './scripts/controllers/orderNotes.controller.es6';
import orderFinancialController from './scripts/controllers/orderFinancial.controller.es6';
import ExpenseEstimatesCtrl from './components/order/components/expense-estimates/expense-estimates.controller.es6';

// NEW QUICK SHIP
import QuickShipCtrl from './components/quick-ship/quick-ship.controller.es6';
import QuickShipItemsCtrl from './components/quick-ship/components/quick-ship-items/quick-ship-items.controller.es6';
import QuickShipInventoryPickCtrl from './components/quick-ship/components/quick-ship-inventory-pick/quick-ship-inventory-pick.controller.es6';

import orderWizardController from './components/orders/components/manage-order/order-wizard.controller.es6.js';
import orderWizardStep1Controller from './components/orders/components/manage-order/manage-wizard/order-wizard-step1/order-wizard-step1.controller.es6.js';
import orderWizardStep2Controller from './components/orders/components/manage-order/manage-wizard/order-wizard-step2/order-wizard-step2.controller.es6.js';
import orderWizardStep3Controller from './components/orders/components/manage-order/manage-wizard/order-wizard-step3/order-wizard-step3.controller.es6';
import orderWizardReviewItemsController from './components/orders/components/manage-order/manage-wizard/order-wizard-step4/order-wizard-review-items.controller.es6.js';
import orderWizardStep5Controller from './components/orders/components/manage-order/manage-wizard/order-wizard-step5/orderWizardStep5.controller.es6.js';
import orderWizardStep6Controller from './components/orders/components/manage-order/manage-wizard/order-wizard-step6/orderWizardStep6.controller.es6.js';
import orderWizardStep7Controller from './components/orders/components/manage-order/manage-wizard/order-wizard-step7/orderWizardStep7.controller.es6.js';

import OrderConfirmationModalController from './components/orders/components/manage-order/modals/order-confirmation-contacts/orderConfirmationContacts.controller.es6';
import attachPatientController from './scripts/controllers/modals/attachPatient.controller.es6';
import itemTrackingStatusModalController from './scripts/controllers/modals/itemTrackingStatusModal.controller.es6';

// Components
// NEW QUICK SHIP
import shipmentSummary from './components/quick-ship/components/quick-ship-items/components/shipment-summary/shipment-summary.component.es6.js';
import shipmentItems from './components/quick-ship/components/quick-ship-items/components/shipment-items/shipment-items.component.es6';
import linkedItemComponents from './components/quick-ship/components/quick-ship-items/components/linked-item-components/linked-item-components.component.es6';

import shipmentProduct from './components/quick-ship/components/quick-ship-items/components/shipment-product/shipment-product.component.es6';
import productComponents from './components/quick-ship/components/quick-ship-items/components/product-components/product-components.component.es';
import pickedItems from './components/quick-ship/components/quick-ship-inventory-pick/components/picked-items/picked-items.component.es6';
import currentItem from './components/quick-ship/components/quick-ship-inventory-pick/components/current-item/current-item.component.es6';

import resupplyHistoryOrders from './components/resupply-history-orders/resupply-history-orders.component.es6';
import detailedWrittenOrder from './components/detailed-written-order/detailed-written-order.component.es6';

// Services
import ordersService from './shared/services/orders.service.es6.js';
import OrderDetailsService from './components/order/components/order-details/order-details.service.es6';
import orderDocumentsService from './scripts/services/orderDocuments.service.es6';
import orderNotesService from './scripts/services/orderNotes.service.es6';
import orderWizardService from './components/orders/components/manage-order/order-wizard.service.es6.js';
import QuickShipService from './components/quick-ship/quick-ship.service.es6';
import QuickShipAddModelCtrl from './components/quick-ship/components/quick-ship-add-model/quick-ship-add-model.controller.es6';
import linkedItem from './components/quick-ship/components/quick-ship-items/components/linked-item/linked-item.component.es6';
import ExpenseEstimatesService from './components/order/components/expense-estimates/expense-estimates.service.es6';

export default angular
    .module('app.orders', [])
    .config(config)

    // Controllers
    .controller('ordersController', ordersController)
    .controller('orderController', orderController)
    .controller('orderDetailsCtrl', OrderDetailsCtrl)
    .controller('orderItemsController', orderItemsController)
    .controller('appendTrackingItemsController', appendTrackingItemsController)
    .controller('orderDocumentsController', orderDocumentsController)
    .controller('orderNotesController', orderNotesController)
    .controller('orderFinancialController', orderFinancialController)

    .controller('quickShipCtrl', QuickShipCtrl)
    .controller('quickShipItemsCtrl', QuickShipItemsCtrl)
    .controller('quickShipAddModelCtrl', QuickShipAddModelCtrl)
    .controller('quickShipInventoryPickCtrl', QuickShipInventoryPickCtrl)

    .controller('orderWizardController', orderWizardController)
    .controller('orderWizardStep1Controller', orderWizardStep1Controller)
    .controller('orderWizardStep2Controller', orderWizardStep2Controller)
    .controller('orderWizardStep3Controller', orderWizardStep3Controller)
    .controller('orderWizardReviewItemsController', orderWizardReviewItemsController)
    .controller('orderWizardStep5Controller', orderWizardStep5Controller)
    .controller('orderWizardStep6Controller', orderWizardStep6Controller)
    .controller('orderWizardStep7Controller', orderWizardStep7Controller)

    .controller('orderConfirmationModalController', OrderConfirmationModalController)
    .controller('attachPatientController', attachPatientController)
    .controller('itemTrackingStatusModalController', itemTrackingStatusModalController)
    .controller('expenseEstimatesCtrl', ExpenseEstimatesCtrl)

    // Components
    .component('shipmentSummary', shipmentSummary)
    .component('shipmentItems', shipmentItems)
    .component('linkedItemComponents', linkedItemComponents)
    .component('shipmentProduct', shipmentProduct)
    .component('productComponents', productComponents)
    .component('linkedItem', linkedItem)
    .component('pickedItems', pickedItems)
    .component('currentItem', currentItem)

    .component('resupplyHistoryOrders', resupplyHistoryOrders)
    .component('detailedWrittenOrder', detailedWrittenOrder)

    // Services
    .service('ordersService', ordersService)
    .service('orderDetailsService', OrderDetailsService)
    .service('orderDocumentsService', orderDocumentsService)
    .service('orderNotesService', orderNotesService)
    .service('orderWizardService', orderWizardService)
    .service('quickShipService', QuickShipService)
    .service('expenseEstimatesService', ExpenseEstimatesService)
    .name;
