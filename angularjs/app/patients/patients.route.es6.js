export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.patients', {
            url: '/patients',
            template: '<ui-view/>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.patients')) {
                        $state.go('root.patients.list');
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            },
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patients'
            }
        })
        .state('root.patients.list', {
            templateUrl: 'patients/components/patients/patients.html',
            controller: 'patientsController as patients',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patients',
                isOnlyNewPatients: undefined
            }
        })
        .state('root.patients.add', {
            url: '/add',
            templateUrl: 'patients/components/patient-edit/patient-edit.html',
            controller: 'patientEditController as patient',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Add Patient'
            }
        })
        .state('root.patients.add.step1', {
            url: '/patient-information',
            templateUrl: 'patients/components/patient-edit/patient-edit-wizard/patient-information/patient-information.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Add Patient'
            }
        })
        .state('root.patients.add.step2', {
            url: '/additional-info',
            templateUrl: 'patients/components/patient-edit/patient-edit-wizard/additional-info/additional-info.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Add Patient'
            }
        })
        .state('root.patients.add.step3', {
            url: '/summary',
            controller: 'patientEditSummaryController',
            controllerAs: 'summary',
            templateUrl: 'patients/components/patient-edit/patient-edit-wizard/summary/summary.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Add Patient'
            }
        })
        .state('root.patients.addToOrder', {
            url: '/add-to-order/:orderId',
            templateUrl: 'patients/components/patient-edit/patient-edit.html',
            controller: 'patientEditController as patient',
            data: {
                requireLogin: true,
                pageTitle: 'Add to Order'
            },
            ncyBreadcrumb: {
                label: 'New Patient for order',
                parent: 'panel.patients.list'
            }
        })
        .state('root.patients.edit', {
            url: '/:patientId/edit',
            templateUrl: 'patients/components/patient-edit/patient-edit.html',
            controller: 'patientEditController as patient',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Edit Patient'
            }
        })
        .state('root.patients.edit.step1', {
            url: '/patient-information',
            templateUrl: 'patients/components/patient-edit/patient-edit-wizard/patient-information/patient-information.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Edit Patient'
            }
        })
        .state('root.patients.edit.step2', {
            url: '/additional-info',
            templateUrl: 'patients/components/patient-edit/patient-edit-wizard/additional-info/additional-info.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Edit Patient'
            }
        })
        .state('root.patients.edit.step3', {
            url: '/summary',
            controller: 'patientEditSummaryController',
            controllerAs: 'summary',
            templateUrl: 'patients/components/patient-edit/patient-edit-wizard/summary/summary.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Edit Patient'
            }
        })
        .state('root.patient', {
            url: '/patient/:patientId',
            templateUrl: 'patients/components/patient/patient.html',
            controller: 'patientCtrl as patient',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient'
            }
        })
        .state('root.patient.demographics', {
            url: '/demographics',
            templateUrl: 'patients/components/demographics/demographics.html',
            controller: 'demographicsController as demographics',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Demographics'
            }
        })

        // resupply routes
        .state('root.patient.resupply', {
            url: '/resupply',
            templateUrl: 'patients/components/patient/components/resupply/patient-resupply.html',
            controller: 'patientResupplyController as resupply',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Resupply Program'
            }
        })

        .state('root.manage-resupply', {
            url: '/patient/:patientId/manage-resupply',
            templateUrl: 'patients/components/patient/components/manage-resupply/resupply-program.html',
            controller: 'resupplyProgramController as resProg',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Resupply Program'
            }
        })
        .state('root.manage-resupply.view', {
            templateUrl: 'patients/components/patient/components/manage-resupply/resupply-program-view/resupply-program-view.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Resupply Program'
            }
        })
        .state('root.manage-resupply.add', {
            templateUrl: 'patients/components/patient/components/manage-resupply/resupply-program-add/resupply-program-add.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Resupply Program'
            }
        })
        // end resupply routes

        .state('root.patient.messages', {
            url: '/messages',
            templateUrl: 'patients/components/messages/messages.html',
            controller: 'messagesController as messages',
            params: {
                view: 'all',
                topMenu: 'Patients',
                pageTitle: 'Patient Messages'
            }
        })
        .state('root.patient.forms', {
            url: '/forms',
            templateUrl: 'patients/views/patient-forms.html',
            controller: 'patientFormsController as forms',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Forms'
            }
        })

        // Prescriptions List
        .state('root.patient.prescription', {
            url: '/prescription',
            templateUrl: 'patients/components/patient/components/prescription/prescription.html',
            controller: 'patientPrescriptionCtrl',
            controllerAs: 'prescription',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Prescription'
            }
        })

        // Prescription Details
        .state('root.patient.prescriptionDetails', {
            url: '/prescription/:prescriptionId',
            templateUrl: 'patients/components/patient/components/prescription-details/prescription-details.html',
            controller: 'prescriptionDetailsCtrl as details',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Prescription Details'
            }
        })

        // Add new Prescription
        .state('root.patients.newPrescription', {
            url: '/:patientId/new-prescription',
            templateUrl: 'patients/components/patient/components/prescription-update/prescription-update.html',
            controller: 'prescriptionUpdateCtrl as prUpdate',
            params: {
                topMenu: 'Patients',
                pageTitle: 'New Prescription'
            }
        })
        .state('root.patients.newPrescription.view', {
            url: '/details',
            templateUrl: 'patients/components/patient/components/prescription-update/details.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'New Prescription'
            }
        })
        .state('root.patients.newPrescription.add', {
            url: '/add',
            templateUrl: 'patients/components/patient/components/prescription-update/add-item.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'New Prescription'
            }
        })

        // Update Prescription
        .state('root.patients.prescriptionUpdate', {
            url: '/:patientId/update-prescription/:prescriptionId',
            templateUrl: 'patients/components/patient/components/prescription-update/prescription-update.html',
            controller: 'prescriptionUpdateCtrl as prUpdate',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Update Prescription'
            }
        })
        .state('root.patients.prescriptionUpdate.view', {
            url: '/details',
            templateUrl: 'patients/components/patient/components/prescription-update/details.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Update Prescription'
            }
        })
        .state('root.patients.prescriptionUpdate.add', {
            url: '/add',
            templateUrl: 'patients/components/patient/components/prescription-update/add-item.html',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Update Prescription'
            }
        })

        // Patient Therapy data tab
        .state('root.patient.therapy', {
            url: '/therapy',
            templateUrl: 'patients/components/patient/components/therapy-data/therapy-data.html',
            controller: 'therapyDataCtrl as therapy',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Sleep Therapy',
                chosenDeviceId: undefined
            }
        })

        .state('root.patient.items', {
            url: '/items',
            template: '<ui-view/>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.patient.items')) {
                        $state.go('root.patient.items.list', { type: 'inventory' });
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            },
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Items'
            }
        })
        .state('root.patient.items.list', {
            url: '/:type',
            templateUrl: 'patients/components/patient/components/items/patient-items.html',
            controller: 'patientItemsController as patientItems',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Items'
            }
        })
        .state('root.patient.rental', {
            url: '/rental',
            templateUrl: 'patients/components/patient/components/patient-rental/patient-rental.html',
            controller: 'patientRentalController as patientRental',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Rental',
                rentProgramId: null
            }
        })
        .state('root.patient.orders', {
            url: '/orders',
            templateUrl: 'patients/components/patient/components/patient-orders/patient-orders.html',
            controller: 'patientOrdersCtrl as orders',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Orders'
            }
        })
        .state('root.patient.notes', {
            url: '/notes',
            templateUrl: 'patients/views/notes.html',
            controller: 'notesController as notes',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Notes'
            }
        })
        .state('root.patient.insurances', {
            url: '/insurances',
            templateUrl: 'patients/components/insurances/insurances.html',
            controller: 'insurancesController as insurances',
            params: {
                view: 'active',
                topMenu: 'Patients',
                pageTitle: 'Patient Insurance'
            }
        })
        .state('root.patient.insurances.insurances-list', {
            url: '/insurances-list',
            templateUrl: 'patients/components/insurances/components/insurances-list/insurances-list.html',
            controller: 'insurancesListController as insurancesList',
            params: {
                view: 'insurances-list',
                topMenu: 'Patients',
                pageTitle: 'Patient Insurance'
            }
        })
        .state('root.patient.insurances.authorizations-list', {
            url: '/authorizations-list',
            templateUrl: 'patients/components/insurances/components/authorizations-list/authorizations-list.html',
            controller: 'AuthorizationsListCtrl as authorizations',
            params: {
                view: 'authorizations-list',
                topMenu: 'Patients',
                pageTitle: 'Patient Authorizations'
            }
        })
        .state('root.patient.add-insurance', {
            url: '/insurances/add',
            templateUrl: 'patients/components/insurances/components/edit-insurance/edit-insurance.html',
            controller: 'editInsuranceController as $ctrl',
            params: {
                view: 'active',
                topMenu: 'Patients',
                pageTitle: 'New Insurance'
            }
        })
        .state('root.patient.edit-insurance', {
            url: '/insurances/edit/:insuranceId',
            templateUrl: 'patients/components/insurances/components/edit-insurance/edit-insurance.html',
            controller: 'editInsuranceController as $ctrl',
            params: {
                view: 'active',
                topMenu: 'Patients',
                pageTitle: 'Edit Insurance'
            }
        })

        .state('root.benefits', {
            url: '/patient/:patientId/insurances/:transactionId/benefits',
            templateUrl: 'patients/components/insurances/components/benefits/insurances-benefits.html',
            controller: 'BenefitsController as benefits',
            params: {
                topMenu: 'Patients',
                insuranceName: '',
                pageTitle: 'Benefits'
            }
        })
        .state('root.patient.medical-records', {
            url: '/medical-records',
            templateUrl: 'patients/views/medical-records.html',
            controller: 'medicalRecordsController as medical',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Medical Records'
            }
        })
        .state('root.patient.documents', {
            url: '/documents',
            templateUrl: 'patients/views/documents.html',
            controller: 'documentsController as documents',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Documents'
            }
        })
        .state('root.patient-cmn-form', {
            url: '/patient/:patientId/documents/cmn-form',
            templateUrl: 'patients/components/patient-cmn/patient-cmn.html',
            controller: 'patientCmnCtrl as cmn',
            params: {
                cmnId: undefined,
                patientId: undefined,
                topMenu: 'Patients',
                pageTitle: 'Patient CMN'
            }
        })
        .state('root.patient.financial', {
            url: '/financial',
            templateUrl: 'patients/components/financial/patient-financial.html',
            controller: 'patientFinancialController as financial',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Patient Financial'
            }
        })
        .state('root.patient.financial.invoices', {
            url: '/invoices',
            templateUrl: 'patients/components/financial/components/invoices/patient-invoices.html',
            controller: 'patientFinancialInvoicesController as invoiceCtrl',
            params: {
                view: 'invoices',
                topMenu: 'Patients',
                pageTitle: 'Patient Invoices'
            }
        })
        .state('root.patient.financial.payments', {
            url: '/payments',
            templateUrl: 'patients/components/financial/components/payments/patient-payments.html',
            params: {
                view: 'payments',
                topMenu: 'Patients',
                pageTitle: 'Patient Payments'
            }
        })
        .state('root.collect_payment', {
            url: '/patients/collect-payment/:patientId',
            templateUrl: 'patients/views/collect-payment.html',
            controller: 'patientCollectPaymentController as collect',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Collect Payment'
            }
        })
        .state('root.fill_sign', {
            url: '/patients/:patientId/fill-sign/:templateId',
            templateUrl: 'patients/views/patient-fill-sign-form.html',
            controller: 'patientFillSignFormController',
            controllerAs: 'patientFill',
            params: {
                topMenu: 'Patients',
                pageTitle: 'Fill and Sign',
                OrderId: null,
                SignedDate: null
            }
        });
}

