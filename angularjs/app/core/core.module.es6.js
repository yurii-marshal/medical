// REDUX
import ngRedux from 'ng-redux';
import reduxStore from './store/store.config.es6';

// Config
import run from './core.run.es6';
import config from './config.route.es6';

// Constants
import * as appConstants from './constants/core.constants.es6.js';

// Controllers
import loginController from './scripts/controllers/login.controller.es6';
import forgotpassController from './scripts/controllers/forgotpass.controller.es6';
import changepassController from './scripts/controllers/changepass.controller.es6';
import addReferralModalController from './scripts/controllers/modals/addReferralModal.controller.es6';
import changeReferralLocationController from './modals/change-referral-location/change-referral-location.controller.es6';
import addressesController from './scripts/controllers/modals/addressesModal.controller.es6';
import copyCalendarScheduleController from './scripts/controllers/copyCalendarSchedule.controller.es6';

// Components
import { prescriptionStatus } from './components/prescription-status/prescription-status.component.es6';
import { patientItemsList } from './components/patient-items-list/patient-items-list.component.es6';
import invoiceItemsList from './components/invoices-items-list/invoice-items-list.component.es6';
import paymentItemsList from './components/payment-items-list/payment-items-list.component.es6';
import searchServiceLines from './components/search-service-lines/search-service-lines.component.es6';
import serviceLineContainer from './components/search-service-lines/service-line-container/service-line-container.component.es6';
import financialData from './components/financial-data/financial-data.component.es6';
import contentTabs from './components/content-tabs/content-tabs.component.es6';
import resupplyProgram from './components/resupply-program/resupply-program.component.es6';
import priceOption from './components/price-option/price-option.component.es6.js';
import prescriptionItems from './components/prescription-items/prescription-items.component.es6';
import searchItems from './components/search-items/search-items.component.es6';
import searchItemsCatalog from './components/search-items-catalog/search-items-catalog.component.es6';
import productItems from './components/product-items/product-items.component.es6';
import patientContacts from './components/patient-contacts/patient-contacts.component.es6';
import organizationContacts from './components/organization-contacts/organization-contacts.component.es6';
import chatHelper from './components/chat-helper/chat-helper.component.es6';
import loadProductsStatus from './components/load-products-status/load-products-status.component.es6';
import expandableText from './components/expandable-text/expandable-text.component.es6';
import expandableTextBtn from './components/expandable-text-btn/expandable-text-btn.component.es6';
import fileUpload from './components/file-upload/file-upload.component.es6';
import inftblFilterResetBtn from './scripts/components/inftbl-filter-reset-btn.component.es6';
import patientShortInfoSidebar from './components/patient-short-info-sidebar/patient-short-info-sidebar.component.es6';
import notesComponent from './components/notes/notes.component.es6';
import noRecords from './components/no-records/noRecords.component.es6';
import toolbarStatic from './components/toolbar-static/toolbar-static.component.es6';
import drowzTabs from './components/drowz-tabs/drowz-tabs.component.es6';
import toolbar from './components/action-toolbar/toolbar.component.es6';
import attrsTags from './components/attrs-tags/attrs-tags.component.es6';
import itemDiagnosis from './components/prescription-items/item-diagnosis/item-diagnosis.component.es6';
import autocompleteMultiselectFilter from './components/autocomplete-multiselect-filter/autocomplete-multiselect-filter.component.es6';
import modifiers from './components/modifiers/modifiers.component.es6';
import HelpdescWidget from './components/helpdesk-widget/helpdesc-widget.component.es6';

// ADVANCED FILTERS COMPONENT
import advancedFilters from './components/advanced-filters/advanced-filters.component.es6';
import advancedFiltersModalCtrl from './components/advanced-filters/modal/advanced-filters-modal.controller.es6';
import radioButtonFilter from './components/advanced-filters/filter-types/radio-button-filter/radio-button-filter.component.es6';
import checkboxFilter from './components/advanced-filters/filter-types/checkbox-filter/checkbox-filter.component.es6';
import selectDateRangeFilter from './components/advanced-filters/filter-types/select-date-range-filter/select-date-range-filter.component.es6';
import selectInputRangeFilter from './components/advanced-filters/filter-types/select-input-range-filter/select-input-range-filter.component.es6';
import autocompleteChipsFilter from './components/advanced-filters/filter-types/autocomplete-chips-filter/autocomplete-chips-filter.component.es6.js';
import autocompleteFilter from './components/advanced-filters/filter-types/autocomplete-filter/autocomplete-filter.component.es6.js';
import dateRangeFilter from './components/advanced-filters/filter-types/date-range-filter/date-range-filter.component.es6';
import saveFilterAs from './components/advanced-filters/save-filter-as/save-filter-as.component.es6';
import advancedFiltersService from './components/advanced-filters/advanced-filters.service.es6';

// Directives
import scrollTo from './directives/scrollTo.directive.es6';
import drowzDropdown from './directives/drowzDropdown.directive.es6';
import closeOnScroll from './directives/closeOnScroll.directive.es6';
import customSearchAutocomplete from './components/custom-search-autocomplete/custom-search-autocomplete.directive.es6';
import patientRef from './directives/patientRef.directive.es6.js';
import bindHtmlCompile from './directives/bind-html-compile.directive.es6.js';
import maxLengthValue from './directives/max-length.directive.es6';
import decimals from './directives/decimals.directive.es6';
import datetimepicker from './directives/datetimepicker.directive.es6';
import simpleTooltipDirective from './directives/simpleTooltip.directive.es6';
import chipsAutocompleteRequired from './directives/chipsAutocompleteRequired.es6';
import formatStringByParagraphs from './directives/formatStringByParagraphs.directive.es6';
import inftblSortList from './components/inftbl-sort-list/inftbl-sort-list.component.es6';
import maxCountValue from './directives/max-count.directive.es6';
import setWidthForLogin from './directives/set-width-for-loign.directive.es6';
import onAutocompletePanelVisibility from './directives/on-autocomplete-panel-visibility.directive.es6';
import priceValidator from './directives/price.directive.es6';

// Services
import ShippoService from './services/http/shippo/shippo.service.es6';
import authService from './services/auth.service.es6';
import CurrentUser from './services/currentUser.service.es6';
import customSearchAutocompleteService from './components/custom-search-autocomplete/custom-search-autocomplete.service.es6';
import autocompleteMultiselectFilterService from './components/autocomplete-multiselect-filter/autocomplete-multiselect-filter.service.es6';
import npiLookupService from './services/npiLookup.service.es6';
import patientContactsService from './components/patient-contacts/patient-contacts.service.es6';
import chatHelperService from './components/chat-helper/chat-helper.service.es6';
import patientShortInfoService from './components/patient-short-info-sidebar/patient-short-info-sidebar.service.es6';
import CoreDictionariesService from './services/http/core/core-dictionaries.service.es6.js';
import CoreCatalogImportService from './services/http/core/core-catalog-import.service.es6';
import popupMenuService from './services/popupMenu.service.es6';
import MapProductsService from './services/map-model/map-products.service.es6';
import RentalOptionsService from './services/rental-options.service.es6.js';
import InventoryProductService from './services/http/inventory/inventory-product/inventory-product.service.es6.js';
import InventoryEquipmentHttpService from './services/http/inventory/inventory-equipment/inventory-equipment.service.es6';
import InventoryEquipmentDictionaryHttpService from './services/http/inventory/inventory-equipment-dictionary/inventory-equipment-dictionary.service.es6';
import InventoryLocationsHttpService from './services/http/inventory/inventory-locations/inventory-locations.service.es6';
import InventoryVendorsHttpService from './services/http/inventory/inventory-vendors/inventory-vendors.service.es6';
import InventoryNotesImportHttpService from './services/http/inventory/inventory-import/inventory-notes-import.service.es6';
import PurchaseOrdersHttpService from './services/http/inventory/inventory-purchase-orders/purchase-orders.service.es6';
import BillingProviderService from './services/http/billing/billing-providers.service.es6.js';
import BillingClaimsService from './services/http/billing/billing-claims.service.es6';
import BillingAdjustmentReasonsHttpService from './services/http/billing/billing-adjustment-reason.service.es6';
import ClaimsStatementsService from './services/http/billing/billing-claims-statements.es6';
import PatientStatementsService from './services/http/core/core-patient-statements.es6';
import BillingDictionariesService from './services/http/billing/billing-dictionaries.service.es6';
import PayerPlansService from './services/http/billing/payer-plans.service.es6.js';
import SettingsService from './services/http/organization/settings.service.es6';
import OrganizationsFacilityService from './services/http/organization/organizations-facility.service.es6';
import ReportsService from './services/http/reports/reports.service.es6';
import CorePersonnelService from './services/http/core/core-personnel/core-personnel.service.es6';
import CorePatientService from './services/http/core/core-patient/core-patient.service.es6.js';
import CoreOrderService from './services/http/core/core-order/core-order.service.es6.js';
import UpsService from './services/http/ups/ups.service.es6';
import BillingInvoiceTransactionService from './services/http/billing/billing-invoice-transaction.service.es6';
import BillingPaymentService from './services/http/billing/billing-payment.service.es6';
import BillingInvoiceService from './services/http/billing/billing-invoice.service.es6';
import CoreReferralCardsService from './services/http/core/core-referral-cards.service.es6';
import CoreHcpcsCodesService from './services/http/core/core-hcpcs-codes.service.es6';
import NgToast from './services/ng-toast.service.es6';
import ScrollToService from './services/scroll-to.service.es6';
import CoreUsersService from './services/http/core/core-users/core-users.service.es6';
import CorePayersService from './services/http/core/core-payers.service.es6';

// Filters
import absNumber from './filters/absNumber.filter.es6';
import fullTimeFormat from './filters/full-time-format.filter.es6.js';
import hcpcsCodesToArr from './filters/hcpcsCodesToArr.filter.es6';
import referralDisplayName from './filters/referralDisplayName.filter.es6';
import markDownToHtml from './filters/markdownToHtml.filter.es6';
import localDateTimeFilter from './filters/localDateTime.filter.es6';
import fullnameFilter from './filters/fullname.filter.es6';
import idToDisplayName from './filters/id-to-display-name.filter.es6';
import orderIdToDisplayIdFilter from './filters/order-id-to-display-id.filter.es6';
import unique from './filters/unique.filter.es6';
import UserPermissions from './services/user-permissions.service.es6';
import mainMenu from './components/main-menu/main-menu.component.es6';
import PatientPayerService from './services/http/core/core-patient-payer.service.es6';
import UserPicture from './services/user-picture.service.es6';
import BillingPriceOptionService from './services/http/billing/billing-price-option.es6';
import IframeUtils from './services/iframe-utils.es6';
import alphanumericsValidator from './directives/alphanumerics.directive.es6';

export default angular
    .module('app.core', [
        'ui.mask',
        'ngRoute',
        'as.sortable',
        'ui.router',
        'ui.bootstrap',
        'bsLoadingOverlay',
        'vAccordion',
        'material.components.autocomplete_infinite_scroll',
        'angularMoment',
        'infinite-scroll',
        'ngIdle',
        'timer',
        'ngFileUpload',
        'ui.select',
        'ngAnimate',
        'ngMaterial',
        'ngSanitize',
        'ngMessages',
        'angularFileUpload',
        'angularSideBySideSelect',
        'reportSelect',
        'highcharts-ng',
        'ngRedux',
        'ngCookies'
    ])
    // Constants
    .constant('appConstants', appConstants)

    // Controllers
    .controller('loginController', loginController)
    .controller('forgotpassController', forgotpassController)
    .controller('changepassController', changepassController)
    .controller('addReferralModalController', addReferralModalController)
    .controller('changeReferralLocationController', changeReferralLocationController)
    .controller('addressesController', addressesController)
    .controller('copyCalendarScheduleController', copyCalendarScheduleController)

    // Components
    .component('prescriptionStatus', prescriptionStatus)
    .component('patientItemsList', patientItemsList)
    .component('invoiceItemsList', invoiceItemsList)
    .component('paymentItemsList', paymentItemsList)
    .component('searchServiceLines', searchServiceLines)
    .component('serviceLineContainer', serviceLineContainer)
    .component('financialData', financialData)
    .component('contentTabs', contentTabs)
    .component('resupplyProgram', resupplyProgram)
    .component('priceOption', priceOption)
    .component('prescriptionItems', prescriptionItems)
    .component('searchItems', searchItems)
    .component('searchItemsCatalog', searchItemsCatalog)
    .component('productItems', productItems)
    .component('patientContacts', patientContacts)
    .component('organizationContacts', organizationContacts)
    .component('chatHelper', chatHelper)
    .component('inftblFilterResetBtn', inftblFilterResetBtn)
    .component('patientShortInfoSidebar', patientShortInfoSidebar)
    .component('notes', notesComponent)
    .component('noRecords', noRecords)
    .component('toolbarStatic', toolbarStatic)
    .component('drowzTabs', drowzTabs)
    .component('toolbar', toolbar)
    .component('attrsTags', attrsTags)
    .component('itemDiagnosis', itemDiagnosis)
    .component('autocompleteMultiselectFilter', autocompleteMultiselectFilter)
    .component('modifiers', modifiers)

    // ADVANCED FILTERS COMPONENT
    .component('advancedFilters', advancedFilters)
    .controller('advancedFiltersModalCtrl', advancedFiltersModalCtrl)
    .component('radioButtonFilter', radioButtonFilter)
    .component('checkboxFilter', checkboxFilter)
    .component('selectDateRangeFilter', selectDateRangeFilter)
    .component('selectInputRangeFilter', selectInputRangeFilter)
    .component('autocompleteChipsFilter', autocompleteChipsFilter)
    .component('autocompleteFilter', autocompleteFilter)
    .component('dateRangeFilter', dateRangeFilter)
    .component('saveFilterAs', saveFilterAs)
    .component('loadProductsStatus', loadProductsStatus)
    .component('expandableText', expandableText)
    .component('expandableTextBtn', expandableTextBtn)
    .component('fileUpload', fileUpload)
    .component('mainMenu', mainMenu)
    .component('helpdescWidget', HelpdescWidget)
    .service('advancedFiltersService', advancedFiltersService)

    // Directives
    .directive('priceValidator', priceValidator)
    .directive('alphanumericsValidator', alphanumericsValidator)
    .directive('setWidthForLogin', setWidthForLogin)
    .directive('scrollTo', scrollTo)
    .directive('drowzDropdown', drowzDropdown)
    .directive('closeOnScroll', closeOnScroll)
    .directive('customSearchAutocomplete', customSearchAutocomplete)
    .directive('patientRef', patientRef)
    .directive('bindHtmlCompile', bindHtmlCompile)
    .directive('maxLengthValue', maxLengthValue)
    .directive('decimals', decimals)
    .directive('datetimepicker', datetimepicker)
    .directive('simpleTooltip', simpleTooltipDirective)
    .directive('chipsAutocompleteRequired', chipsAutocompleteRequired)
    .directive('formatStringByParagraphs', formatStringByParagraphs)
    .directive('inftblSortList', inftblSortList)
    .directive('maxCountValue', maxCountValue)
    .directive('onAutocompletePanelVisibility', onAutocompletePanelVisibility)

    // Services
    .service('authService', authService)
    .service('currentUser', CurrentUser)
    .service('userPermissions', UserPermissions)
    .service('customSearchAutocompleteService', customSearchAutocompleteService)
    .service('autocompleteMultiselectFilterService', autocompleteMultiselectFilterService)
    .service('npiLookupService', npiLookupService)
    .service('patientContactsService', patientContactsService)
    .service('chatHelperService', chatHelperService)
    .service('patientShortInfoService', patientShortInfoService)
    .service('coreDictionariesService', CoreDictionariesService)
    .service('coreCatalogImportService', CoreCatalogImportService)
    .service('popupMenuCalendar', popupMenuService)
    .service('iframeUtils', IframeUtils)
    .service('mapProductsService', MapProductsService)
    .service('rentalOptionsService', RentalOptionsService)
    .service('inventoryProductService', InventoryProductService)
    .service('inventoryEquipmentHttpService', InventoryEquipmentHttpService)
    .service('inventoryEquipmentDictionaryHttpService', InventoryEquipmentDictionaryHttpService)
    .service('inventoryLocationsHttpService', InventoryLocationsHttpService)
    .service('inventoryVendorsHttpService', InventoryVendorsHttpService)
    .service('inventoryNotesImportHttpService', InventoryNotesImportHttpService)
    .service('purchaseOrdersHttpService', PurchaseOrdersHttpService)
    .service('billingProviderService', BillingProviderService)
    .service('billingClaimsService', BillingClaimsService)
    .service('billingAdjustmentReasonsHttpService', BillingAdjustmentReasonsHttpService)
    .service('claimsStatementsService', ClaimsStatementsService)
    .service('billingDictionariesService', BillingDictionariesService)
    .service('payerPlansService', PayerPlansService)
    .service('settingsService', SettingsService)
    .service('organizationsFacilityService', OrganizationsFacilityService)
    .service('reportsService', ReportsService)
    .service('corePersonnelService', CorePersonnelService)
    .service('corePatientService', CorePatientService)
    .service('patientStatementsService', PatientStatementsService)
    .service('coreOrderService', CoreOrderService)
    .service('upsService', UpsService)
    .service('shippoService', ShippoService)
    .service('billingInvoiceTransactionService', BillingInvoiceTransactionService)
    .service('billingPaymentService', BillingPaymentService)
    .service('billingInvoiceService', BillingInvoiceService)
    .service('coreReferralCardsService', CoreReferralCardsService)
    .service('coreHcpcsCodesService', CoreHcpcsCodesService)
    .service('coreUsersService', CoreUsersService)
    .service('scrollToService', ScrollToService)
    .service('corePayersService', CorePayersService)
    .service('ngToast', NgToast)

    // .provider('crosstabNotifierProvider', CrosstabNotifierProvider)
    .service('patientPayerService', PatientPayerService)
    .service('userPicture', UserPicture)
    .service('billingPriceOptionService', BillingPriceOptionService)

    // Filters
    .filter('absNumber', absNumber)
    .filter('fullTimeFormat', fullTimeFormat)
    .filter('hcpcsCodesToArr', hcpcsCodesToArr)
    .filter('referralDisplayName', referralDisplayName)
    .filter('markDownToHtml', markDownToHtml)
    .filter('localDateTime', localDateTimeFilter)
    .filter('fullname', fullnameFilter)
    .filter('idToDisplayName', idToDisplayName)
    .filter('orderIdToDisplayIdFilter', orderIdToDisplayIdFilter)
    .filter('unique', unique)

    .run(run)
    .config(config)
    .config(reduxStore)
    .name;
