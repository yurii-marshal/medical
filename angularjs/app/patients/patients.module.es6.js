// Config
import config from './patients.route.es6';

// Components
import patientMessageItem from './components/messages/components/patient-message/patient-message.component.es6.js';
import sendMessage from './components/messages/components/send-message/sendMessage.component.es6';
import cmnForm from './components/patient-cmn/components/cmn-form/cmn-form.component.es6.js';
import diagnoseCodes from './components/patient-cmn/components/diagnose-codes/diagnose-codes.component.es6.js';

// Controllers

import PatientEditSummaryController from './components/patient-edit/patient-edit-wizard/summary/summary.controller.es6';
import patientsController from './components/patients/patients.controller.es6';
import PatientCtrl from './components/patient/patient.controller.es6';
import patientEditController from './components/patient-edit/patient-edit.controller.es6.js';
import patientItemsController from './components/patient/components/items/patient-items.controller.es6.js';
import medicalRecordsController from './scripts/controllers/medicalRecords.controller.es6';
import patientFormsController from './scripts/controllers/patientForms.controller.es6';
import PatientOrdersCtrl from './components/patient/components/patient-orders/patient-orders.controller.es6.js';
import patientResupplyController from './components/patient/components/resupply/patient-resupply.controller.es6.js';
import insurancesListController from './components/insurances/components/insurances-list/insurances-list.controller.es6.js';
import editInsuranceController from './components/insurances/components/edit-insurance/edit-insurance.controller.es6';
import AuthorizationsListCtrl from './components/insurances/components/authorizations-list/authorizations-list.controller.es6.js';
import insurancesController from './components/insurances/insurances.controller.es6.js';
import patientRentalController from './components/patient/components/patient-rental/patient-rental.controller.es6.js';
import patientCollectPaymentController from './scripts/controllers/patientCollectPayment.controller.es6';
import patientFinancialController from './components/financial/patient-financial.controller.es6';
import patientFillSignFormController from './scripts/controllers/patient.fill.sign.form.controller.es6';
import documentsController from './scripts/controllers/documents.controller.es6';
import demographicsController from './components/demographics/demographics.controller.es6.js';
import notesController from './scripts/controllers/notes.controller.es6';
import BenefitsController from './components/insurances/components/benefits/benefits.controller.es6.js';
import messagesController from './components/messages/messages.controller.es6.js';
import patientCmnCtrl from './components/patient-cmn/patient-cmn.controller.es6.js';
import PatientPrescriptionCtrl from './components/patient/components/prescription/prescription.controller.es6.js';
import PrescriptionDetailsCtrl from './components/patient/components/prescription-details/prescription-details.controller.es6';
import PrescriptionUpdateCtrl from './components/patient/components/prescription-update/prescription-update.controller.es6';
import TherapyDataCtrl from './components/patient/components/therapy-data/therapy-data.controller.es6';

import confirmPaymentModalController from './scripts/controllers/modals/confirmPaymentModal.controller.es6';
import addMedicalInfoRecordModalController from './scripts/controllers/modals/addMedicalInfoRecordModal.controller.es6';
import deleteInsuranceModalController from './scripts/controllers/modals/deleteInsuranceModal.controller.es6';
import hospitalAdmissionModalController from './scripts/controllers/modals/hospitalAdmission.modal.controller.es6';
import editDocumentModalController from './scripts/controllers/modals/editDocumentModal.controller.es6';
import resupplyProgramController from './components/patient/components/manage-resupply/manage-resupply.controller.es6.js';

import PatientFinancialInvoicesController from './components/financial/components/invoices/patient-invoices.controller.es6';

// Services
import patientsService from './shared/services/patients.service.es6.js';
import patientService from './shared/services/patient.service.es6.js';
import demographicsService from './scripts/services/demographics.service.es6';
import medicalRecordsService from './scripts/services/medicalRecords.service.es6';
import patientFormsService from './scripts/services/patientForms.service.es6';
import documentsService from './scripts/services/documents.service.es6';
import patientAuthorizationService from './shared/services/patient-authorization.service.es6.js';
import patientInsurancesService from './shared/services/patient-insurances.service.es6.js';
import patientResupplyProgramsService from './scripts/services/patientResupplyProgram.service.es6';
import patientFillSignService from './scripts/services/patien.fill.sign.service.es6';
import notesService from './scripts/services/notes.service.es6';
import patientEditService from './shared/services/patient-edit.service.es6.js';
import messagesService from './components/messages/messages.service.es6.js';
import cmnFormService from './components/patient-cmn/components/cmn-form/cmn-form.service.es6.js';
import PrescriptionService from './components/patient/shared/services/prescription.service.es6';
import PatientResupplyService from './components/patient/shared/services/patient-resupply.service.es6.js';
import TherapyDataService from './components/patient/components/therapy-data/therapy-data.service.es6';


// Directives
import signatureImg from './scripts/directives/signure.img.directive.es6';

// Filters
import renderBenefitItem from './scripts/filters/renderBenefitItem.filter.es6';
import sectionBFields
    from './components/patient-cmn/components/cmn-form/form-components/section-b-fields/section-b-fields.component.es6';

export default angular
    .module('app.patients', [])
    .config(config)

    // Components
    .component('patientMessageItem', patientMessageItem)
    .component('sendMessage', sendMessage)
    .component('cmnForm', cmnForm)
    .component('diagnoseCodes', diagnoseCodes)
    .component('sectionBFields', sectionBFields)

    // Controllers
    .controller('patientEditSummaryController', PatientEditSummaryController)
    .controller('patientsController', patientsController)
    .controller('patientCtrl', PatientCtrl)
    .controller('patientEditController', patientEditController)
    .controller('patientItemsController', patientItemsController)
    .controller('medicalRecordsController', medicalRecordsController)
    .controller('patientFormsController', patientFormsController)
    .controller('patientOrdersCtrl', PatientOrdersCtrl)
    .controller('patientResupplyController', patientResupplyController)
    .controller('insurancesListController', insurancesListController)
    .controller('editInsuranceController', editInsuranceController)
    .controller('AuthorizationsListCtrl', AuthorizationsListCtrl)
    .controller('insurancesController', insurancesController)
    .controller('patientRentalController', patientRentalController)
    .controller('patientCollectPaymentController', patientCollectPaymentController)
    .controller('patientFinancialController', patientFinancialController)
    .controller('patientFillSignFormController', patientFillSignFormController)
    .controller('documentsController', documentsController)
    .controller('demographicsController', demographicsController)
    .controller('notesController', notesController)
    .controller('BenefitsController', BenefitsController)
    .controller('messagesController', messagesController)
    .controller('patientCmnCtrl', patientCmnCtrl)
    .controller('patientPrescriptionCtrl', PatientPrescriptionCtrl)
    .controller('prescriptionDetailsCtrl', PrescriptionDetailsCtrl)
    .controller('prescriptionUpdateCtrl', PrescriptionUpdateCtrl)
    .controller('therapyDataCtrl', TherapyDataCtrl)

    .controller('confirmPaymentModalController', confirmPaymentModalController)
    .controller('addMedicalInfoRecordModalController', addMedicalInfoRecordModalController)
    .controller('deleteInsuranceModalController', deleteInsuranceModalController)
    .controller('hospitalAdmissionModalController', hospitalAdmissionModalController)
    .controller('editDocumentModalController', editDocumentModalController)
    .controller('resupplyProgramController', resupplyProgramController)
    .controller('patientFinancialInvoicesController', PatientFinancialInvoicesController)

    // Directives
    .directive('signatureImg', signatureImg)
    // Filters
    .filter('renderBenefitItem', renderBenefitItem)
    // Services
    .service('patientsService', patientsService)
    .service('patientService', patientService)
    .service('demographicsService', demographicsService)
    .service('medicalRecordsService', medicalRecordsService)
    .service('patientFormsService', patientFormsService)
    .service('documentsService', documentsService)
    .service('patientAuthorizationService', patientAuthorizationService)
    .service('patientInsurancesService', patientInsurancesService)
    .service('patientResupplyProgramsService', patientResupplyProgramsService)
    .service('patientFillSignService', patientFillSignService)
    .service('notesService', notesService)
    .service('patientEditService', patientEditService)
    .service('messagesService', messagesService)
    .service('cmnFormService', cmnFormService)
    .service('prescriptionService', PrescriptionService)
    .service('patientResupplyService', PatientResupplyService)
    .service('therapyDataService', TherapyDataService)

    .name;
