export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.calendar', {
            url: '/calendar?view&date&filter&tag&location&personnel',
            dsr: true,
            templateUrl: 'calendar/components/calendar-events/calendar-events.html',
            controller: 'calendarEventsController as calendarEv',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Calendar'
            }
        })
        .state('root.calendar-appointment', {
            url: '/calendar/appointment/:appointmentId',
            templateUrl: 'calendar/components/appointment-details/appointment-details.html',
            controller: 'appointmentDetailsCtrl as appointment',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Details'
            }
        })
        .state('root.calendar-appointment.complete', {
            url: '/complete',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Appointment'
            }
        })
        .state('root.appointment_wizard', {
            url: '/calendar/new-appointment/:personnelIds/',
            templateUrl: 'calendar/components/appointment-wizard/appointment-wizard.html',
            controller: 'calendarWizardController as wizard',
            params: {
                date: undefined,
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.appointment_wizard.step1', {
            url: 'step1',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step1/appointment-step1.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.appointment_wizard.step2', {
            url: 'step2',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step2/appointment-step2.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.appointment_wizard.step3', {
            url: 'step3',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step3/appointment-step3.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.patient_appointment_wizard', {
            url: '/calendar/patient/:patientId/new-appointment/',
            templateUrl: 'calendar/components/appointment-wizard/appointment-wizard.html',
            controller: 'calendarWizardController as wizard',
            params: {
                date: undefined,
                patientId: undefined,
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.patient_appointment_wizard.step1', {
            url: 'step1',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step1/appointment-step1.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.patient_appointment_wizard.step2', {
            url: 'step2',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step2/appointment-step2.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.patient_appointment_wizard.step3', {
            url: 'step3',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step3/appointment-step3.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })

        // Patient Order routing
        .state('root.order_appointment_wizard', {
            url: '/calendar/patient/:patientId/:orderId/new-appointment/',
            templateUrl: 'calendar/components/appointment-wizard/appointment-wizard.html',
            controller: 'calendarWizardController as wizard',
            params: {
                date: undefined,
                patientId: undefined,
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.order_appointment_wizard.step1', {
            url: 'step1',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step1/appointment-step1.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.order_appointment_wizard.step2', {
            url: 'step2',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step2/appointment-step2.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.order_appointment_wizard.step3', {
            url: 'step3',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step3/appointment-step3.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })

        // Patient Order route end
        .state('root.reschedule_appointment_wizard', {
            url: '/calendar/reschedule-appointment/:appointmentId',
            templateUrl: 'calendar/components/appointment-wizard/appointment-wizard.html',
            controller: 'calendarWizardController as wizard',
            params: {
                date: undefined,
                appointmentId: undefined,
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.reschedule_appointment_wizard.step1', {
            url: '/step1',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step1/appointment-step1.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.reschedule_appointment_wizard.step2', {
            url: '/step2',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step2/appointment-step2.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })
        .state('root.reschedule_appointment_wizard.step3', {
            url: '/step3',
            templateUrl: 'calendar/components/appointment-wizard/appointment-step3/appointment-step3.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Appointment Wizard'
            }
        })

        // COMPLETE EVENT WIZARD
        .state('root.completeEvent', {
            url: '/calendar/:patientId/:personnelId/complete/:appointmentId',
            templateUrl: 'calendar/components/complete-wizard/complete-wizard.html',
            controller: 'completeWizardController',
            controllerAs: 'complete',
            data: {
                showPopupBeforeLeave: true
            },
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step1', {
            url: '/step1',
            template: '<ui-view/>',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step1.equipments', {
            url: '/equipments',
            templateUrl: 'calendar/components/complete-wizard/equipment/equipment.html',
            controller: 'completeWizardEquipmentController',
            controllerAs: 'equipment',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step1.add', {
            url: '/add',
            templateUrl: 'calendar/components/complete-wizard/equipment/search-items.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step2', {
            url: '/step2',
            template: '<ui-view/>',
            controller: 'completeWizardResupplyController',
            controllerAs: 'resupply',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step2.resupply', {
            url: '/resupply-program',
            templateUrl: 'calendar/components/complete-wizard/resupply/resupply-program.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step2.add', {
            url: '/add',
            templateUrl: 'calendar/components/complete-wizard/resupply/search-items.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step3', {
            url: '/step3',
            templateUrl: 'calendar/components/complete-wizard/note/note.html',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        })
        .state('root.completeEvent.step4', {
            url: '/step4',
            templateUrl: 'calendar/components/complete-wizard/summary/summary.html',
            controller: 'completeWizardSummaryController',
            controllerAs: 'summary',
            params: {
                topMenu: 'Calendar',
                pageTitle: 'Complete Event'
            }
        });
}
