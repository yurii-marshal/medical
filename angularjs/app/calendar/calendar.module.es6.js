// Config
import config from './calendar.route.es6';

// Controllers
import calendarEventsController from './components/calendar-events/calendar-events.controller.es6';
import AppointmentDetailsCtrl from './components/appointment-details/appointment-details.controller.es6.js';

import completeModalController from './scripts/controllers/modals/completeModal.controller.es6';

import CompleteWizardEquipmentController from './components/complete-wizard/equipment/equipment.controller.es6';
import CompleteWizardResupplyController from './components/complete-wizard/resupply/resupply-program.controller.es6';
import CompleteWizardSummaryController from './components/complete-wizard/summary/summary.controller.es6';
import UpdateResupplyProgramModalController from './components/complete-wizard/resupply/modals/update-resupply-program-modal.controller.es6.js';

import CompleteWizardController from './components/complete-wizard/complete-wizard.controller.es6';
import CalendarWizardController from './components/appointment-wizard/calendar.wizard.controller.es6';

// Appointment Wizard Components
import appointmentOrders from './components/appointment-wizard/appointment-step1/appointment-orders/appointment-orders.component.es6.js';
import appointmentOrdersService from './components/appointment-wizard/appointment-step1/appointment-orders/appointment-orders.service.es6.js';
import appointmentDuration from './components/appointment-wizard/shared/appointment-duration/appointment-duration.component.es6';
import appointmentDocuments from './components/appointment-wizard/appointment-step1/appointment-documents/appointment-documents.component.es6';
import appointmentStep2Component from './components/appointment-wizard/appointment-step2/appointment-step2.component.es6.js';
import appointmentStep1Component from './components/appointment-wizard/appointment-step1/appointment-step1.component.es6.js';
import appointmentDetailTimeInfoComponent from './components/appointment-wizard/appointment-step3/appointment-detail-time-info/appointmentDetailTimeInfo.component.es6.js';
import deviceItems from './components/complete-wizard/equipment/device-items/device-items.component.es6';

// Customer Specific Text Component
import customerSpecificText from './components/customer-specific-text/customer-specific-text.component.es6';
import customerSpecificService from './components/customer-specific-text/customer-specific-text.service.es6';

// Services
import calendarEventsService from './scripts/services/calendar-events.service.es6.js';
import calendarAppointmentService from './shared/services/calendar-appointment.service.es6.js';
import completeWizardService from './components/complete-wizard/complete-wizard.service.es6.js';

// Directives
import durationValidatorDirective from './components/appointment-wizard/shared/appointment-duration/durationValidator.directive.es6';

import signature from './scripts/directives/signature.directive.es6';

export default angular
    .module('app.calendar', [])
    .config(config)

    // Controllers
    .controller('calendarEventsController', calendarEventsController)
    .controller('appointmentDetailsCtrl', AppointmentDetailsCtrl)
    .controller('completeModalController', completeModalController)

    .controller('completeWizardEquipmentController', CompleteWizardEquipmentController)
    .controller('completeWizardResupplyController', CompleteWizardResupplyController)
    .controller('completeWizardSummaryController', CompleteWizardSummaryController)
    .controller('updateResupplyProgramModalController', UpdateResupplyProgramModalController)
    .controller('completeWizardController', CompleteWizardController)
    .controller('calendarWizardController', CalendarWizardController)

    // Appointment Wizard Components
    .component('appointmentOrders', appointmentOrders)
    .service('appointmentOrdersService', appointmentOrdersService)
    .component('appointmentDuration', appointmentDuration)
    .component('appointmentDocuments', appointmentDocuments)
    .component('appointmentStep2', appointmentStep2Component)
    .component('appointmentStep1', appointmentStep1Component)
    .component('appointmentDetailTimeInfo', appointmentDetailTimeInfoComponent)
    .component('deviceItems', deviceItems)

    // Customer Specific Text Component
    .component('customerSpecificText', customerSpecificText)
    .service('customerSpecificService', customerSpecificService)

    // Services
    .service('calendarEventsService', calendarEventsService)
    .service('calendarAppointmentService', calendarAppointmentService)
    .service('completeWizardService', completeWizardService)


    // Directives
    .directive('durationValidator', () => new durationValidatorDirective())
    .directive('signature', signature)
    .name;
