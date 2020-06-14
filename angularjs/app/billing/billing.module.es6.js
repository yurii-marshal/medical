// Config
import config from './billing.route.es6';

// Controllers
import billingController from './scripts/controllers/billing.controller.es6';
import paymentsController from './components/payments/payments.controller.es6.js';
import invoicesController from './components/invoices/invoices.controller.es6.js';
import invoiceController from './components/invoice/invoice.controller.es6.js';
import InvoiceAuditController from './components/invoice/components/invoice-audit/invoice-audit.controller.es6.js';
import InvoiceTasksController from './components/invoice/components/invoice-tasks/invoice-tasks.controller.es6.js';
import invoiceInsuranceController from './scripts/controllers/invoiceInsurance.controller.es6';
import ModifyInvoiceCtrl from './components/modify-invoice/modify-invoice.controller.es6.js';
import invoiceNotesController from './scripts/controllers/invoiceNotes.controller.es6';
import authorizationsController from './scripts/controllers/authorizations.controller.es6';
import cmnsController from './scripts/controllers/cmns.controller.es6';
import denialsController from './scripts/controllers/denials.controller.es6';
import eobEraController from './scripts/controllers/eobEra.controller.es6';
import InvoiceDetailsCtrl from './components/invoice/components/invoice-details/invoice-details.controller.es6.js';
import invoiceEobEraController from './scripts/controllers/invoiceEobEra.controller.es6';
import PrescriptionsCtrl from './components/prescriptions/prescriptions.controller.es6.js';
import relatedInvoicesController from './scripts/controllers/relatedInvoices.controller.es6';
import statisticsController from './scripts/controllers/statistics.controller.es6';
import statementsController from './components/statements/statements.controller.es6.js';
import PaymentCtrl from './components/payment/payment.controller.es6';

// Components
import serviceLines from './shared/components/service-lines/service-lines.component.es6.js';
import transactionsList from './shared/components/transactions-list/transactions-list.component.es6';
import paymentInfo from './components/payment/components/payment-info/payment-info.component.es6';
import invoiceItem from './components/payment/components/invoice-item/invoice-item.component.es6';
import serviceLineItem from './components/payment/components/service-line/service-line-item.component.es6';
import selectInvoiceItem from './components/payment/modals/select-invoice/components/select-invoice-item/select-invoice-item.component.es6';
import selectServiceLineItem from './components/payment/modals/select-service-line/components/service-line-item.component.es6';

// Services
import invoicesService from './shared/services/invoices.service.es6.js';
import invoiceModifyService from './shared/services/invoice-modify.service.es6.js';
import invoiceAuditService from './scripts/services/invoiceAudit.service.es6';
import InvoiceInsuranceService from './shared/modals/edit-insurance/invoice-insurance.service.es6.js';
import eobEraService from './scripts/services/eob-era.service.es6';
import paymentsService from './shared/services/payments.service.es6.js';
import authorizationsService from './scripts/services/authorizations.service.es6';
import invoiceAttrDictionaryService from './scripts/services/invoiceAttrDictionary.service.es6';
import documentUpdateService from './shared/services/documentUpdate.service.es6.js';
import billingsCommonService from './scripts/services/billingsCommon.service.es6';
import changeInProgressStatusService from './shared/services/changeInProgressStatus.service.es6.js';
import cmnsService from './scripts/services/cmns.service.es6';
import denialsService from './scripts/services/denials.service.es6';
import PrescriptionsService from './components/prescriptions/prescriptions.service.es6.js';
import statementsService from './components/statements/statements.service.es6.js';
import PaymentService from './components/payment/payment.service.es6';

// Directives
import ComparePaymentValueValidatorDirective
    from './components/payment/shared/directives/compare-payment-value-validator.directive.es6';
import setErrorToPageNum from './components/payment/set-error-to-page-num.directive.es6';

export default angular
    .module('app.billing', [])
    .config(config)

    // Controllers
    .controller('billingController', billingController)
    .controller('paymentsController', paymentsController)
    .controller('invoicesController', invoicesController)
    .controller('invoiceController', invoiceController)
    .controller('invoiceAuditController', InvoiceAuditController)
    .controller('invoiceTasksController', InvoiceTasksController)
    .controller('invoiceInsuranceController', invoiceInsuranceController)
    .controller('modifyInvoiceCtrl', ModifyInvoiceCtrl)
    .controller('invoiceNotesController', invoiceNotesController)
    .controller('authorizationsController', authorizationsController)
    .controller('cmnsController', cmnsController)
    .controller('denialsController', denialsController)
    .controller('eobEraController', eobEraController)
    .controller('invoiceDetailsCtrl', InvoiceDetailsCtrl)
    .controller('invoiceEobEraController', invoiceEobEraController)
    .controller('prescriptionsCtrl', PrescriptionsCtrl)
    .controller('relatedInvoicesController', relatedInvoicesController)
    .controller('statementsController', statementsController)
    .controller('statisticsController', statisticsController)
    .controller('paymentCtrl', PaymentCtrl)

    // Components
    .component('serviceLines', serviceLines)
    .component('transactionsList', transactionsList)
    .component('paymentInfo', paymentInfo)
    .component('invoiceItem', invoiceItem)
    .component('serviceLineItem', serviceLineItem)
    .component('selectInvoiceItem', selectInvoiceItem)
    .component('selectServiceLineItem', selectServiceLineItem)

    // Services
    .service('invoicesService', invoicesService)
    .service('invoiceModifyService', invoiceModifyService)
    .service('invoiceAuditService', invoiceAuditService)
    .service('invoiceInsuranceService', InvoiceInsuranceService)
    .service('eobEraService', eobEraService)
    .service('paymentsService', paymentsService)
    .service('authorizationsService', authorizationsService)
    .service('invoiceAttrDictionaryService', invoiceAttrDictionaryService)
    .service('documentUpdateService', documentUpdateService)
    .service('billingsCommonService', billingsCommonService)
    .service('changeInProgressStatusService', changeInProgressStatusService)
    .service('cmnsService', cmnsService)
    .service('denialsService', denialsService)
    .service('prescriptionsService', PrescriptionsService)
    .service('statementsService', statementsService)
    .service('paymentService', PaymentService)

    // Directives
    .directive('comparePaymentValidator', () => new ComparePaymentValueValidatorDirective)
    .directive('setErrorToPageNum', setErrorToPageNum)

    .name;
