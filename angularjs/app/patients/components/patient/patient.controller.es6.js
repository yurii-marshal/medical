// Add authorization Modal
import addAuthorizationTemplate from '../../shared/modals/add-authorization/add-authorization.html';
import AddAuthorizationCtrl from '../../shared/modals/add-authorization/add-authorization.controller.es6.js';
// Register device Modal
import registerDeviceModalTemplate from './modals/register-device/register-device-modal.html';
import RegisterDeviceModalCtrl from './modals/register-device/register-device-modal.controller.es6.js';
// Add document Modal
import addDocumentModalTemplate from '../../shared/modals/add-document/add-document.html';
import AddDocumentModalCtrl from '../../shared/modals/add-document/add-document.controller.es6';

import { patientStatusConstants } from '../../../core/constants/core.constants.es6.js';

export default class PatientCtrl {
    constructor($scope,
                $rootScope,
                $q,
                ngToast,
                $state,
                $mdDialog,
                invoicesService,
                patientService,
                patientsService,
                corePatientService,
                bsLoadingOverlayService,
                rentalOptionsService,
                patientResupplyProgramsService,
                therapyDataService,
                cmnFormService) {
        'ngInject';

        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$q = $q;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.invoicesService = invoicesService;
        this.patientService = patientService;
        this.patientsService = patientsService;
        this.corePatientService = corePatientService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.cmnFormService = cmnFormService;
        this.rentalOptionsService = rentalOptionsService;
        this.patientResupplyProgramsService = patientResupplyProgramsService;
        this.isManageResupplyPage = this.$state.is('root.patient.manage-resupply');
        this.therapyDataService = therapyDataService;
        this.patientStatusConstants = patientStatusConstants;

        this.patientId = $state.params.patientId;
        this.shortInfo = {};

        $scope.$on('$locationChangeStart', ($event, next) => {
            this.isManageResupplyPage = next.match('/manage-resupply');
        });

        this.toolbarItems = [
            {
                text: 'New Patient',
                icon: {
                    url: 'assets/images/default/user-circle.svg',
                    w: 18,
                    h: 18
                },
                clickFunction: this.newPatient.bind(this),
                isHidden: false
            },
            {
                text: 'New Order',
                name: 'newOrder',
                icon: {
                    url: 'assets/images/default/tasks.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this.newOrder.bind(this),
                isHidden: true // hide when patient in status hold
            },
            {
                text: 'New Insurance',
                name: 'insurance',
                icon: {
                    url: 'assets/images/default/new-order.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this.newInsurance.bind(this),
                isHidden: true // hide when patient in status hold
            },
            {
                text: 'New Authorization',
                name: 'authorization',
                icon: {
                    url: 'assets/images/default/shield-empty.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this.newAuthorization.bind(this),
                isHidden: true
            },
            {
                text: 'New Invoice',
                name: 'invoice',
                icon: {
                    url: 'assets/images/default/plus-circle-thin.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this.newInvoice.bind(this),
                isHidden: true // hide if patient doesn't have location
            },
            {
                text: 'New Appointment',
                name: 'newAppointment',
                icon: {
                    url: 'assets/images/default/calendar.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: this.newAppointment.bind(this),
                isHidden: true
            },
            {
                text: 'New Document',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: this.newDocument.bind(this),
                isHidden: false
            },
            {
                text: 'Log CMN',
                name: 'logCmn',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: () => this.goToCmn(),
                isHidden: false
            },
            {
                text: 'Request CMN',
                name: 'requestCmn',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: () => this.goToCmn(),
                isHidden: true
            },
            // TODO Uncomment and fix after Portal fixing
            // {
            //     text: 'New Message',
            //     name: 'message',
            //     icon: {
            //         url: 'assets/images/default/messages.svg',
            //         w: 16,
            //         h: 16
            //     },
            //     clickFunction: this.newMsg.bind(this),
            //     isHidden: true // hide when patient in status hold
            // },
            {
                text: 'Statements',
                name: 'statements',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: this.goStatements.bind(this),
                isHidden: true
            },
            {
                text: 'New Note',
                icon: {
                    url: 'assets/images/default/messages.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this.newNote.bind(this),
                isHidden: false
            },
            {
                text: 'Collect Payment',
                icon: {
                    url: 'assets/images/default/card.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this.collectPayment.bind(this),
                isHidden: false
            },
            {
                text: 'Register Device',
                name: 'registerDevice',
                icon: {
                    url: 'assets/images/default/register-device.svg',
                    w: 18,
                    h: 18
                },
                clickFunction: this.registerDevice.bind(this),
                isHidden: true
            },
            {
                text: 'New Prescription',
                icon: {
                    url: 'assets/images/default/new-order.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: () => this.newPrescription(),
                isHidden: false
            },
            {
                text: '',
                name: 'medSage',
                icon: {
                    url: 'assets/images/default/ic-fab-medsage.svg',
                    w: 16,
                    h: 18
                },
                clickFunction: () => this.enrollToMedSage(),
                isHidden: true
            }
        ];

        this.tabs = [
            {
                title: 'Demographics',
                view: 'root.patient.demographics',
                icon: {
                    url: 'assets/images/default/user-circle.svg',
                    w: 18,
                    h: 18
                }
            },
            {
                title: 'Medical Records',
                view: 'root.patient.medical-records',
                icon: {
                    url: 'assets/images/default/tasks.svg',
                    w: 16,
                    h: 18
                }
            },
            {
                title: 'Insurance',
                view: 'root.patient.insurances',
                linkView: 'root.patient.insurances.insurances-list',
                icon: {
                    url: 'assets/images/default/insurance.svg',
                    w: 18,
                    h: 20
                }
            },
            {
                title: 'Documents',
                view: 'root.patient.documents',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                }
            },
            {
                title: 'Forms',
                view: 'root.patient.forms',
                icon: {
                    url: 'assets/images/default/task-success.svg',
                    w: 18,
                    h: 20
                }
            },
            {
                title: 'Prescription',
                view: 'root.patient.prescription',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                }
            },
            {
                title: 'Therapy Data',
                view: 'root.patient.therapy',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 14,
                    h: 18
                },
                isHidden: true
            },
            {
                title: 'Items',
                view: 'root.patient.items',
                linkView: 'root.patient.items.list({ "type": "inventory" })',
                icon: {
                    url: 'assets/images/default/list-v2.svg',
                    w: 18,
                    h: 10
                }
            },
            {
                title: 'Orders',
                view: 'root.patient.orders',
                icon: {
                    url: 'assets/images/default/new-order.svg',
                    w: 16,
                    h: 18
                }
            },
            {
                title: 'Notes',
                view: 'root.patient.notes',
                icon: {
                    url: 'assets/images/default/notes.svg',
                    w: 16,
                    h: 14
                }
            },
            {
                title: 'Financial',
                view: 'root.patient.financial.invoices',
                icon: {
                    url: 'assets/images/default/billing.svg',
                    w: 19,
                    h: 18
                }
            },
            {
                title: 'Resupply',
                view: 'root.patient.resupply',
                icon: {
                    url: 'assets/images/default/refresh.svg',
                    w: 16,
                    h: 22,
                    className: 'refresh-rotate-icon'
                }
            }
        ];

        this.rentalTabItem = {
            title: 'Rental',
            view: 'root.patient.rental',
            icon: {
                url: 'assets/images/default/rent.svg',
                w: 18,
                h: 16
            }
        };

        this.resupplyTabItem = {
            title: 'Resupply',
            view: 'root.patient.resupply',
            icon: {
                url: 'assets/images/default/barcode.svg',
                w: 20,
                h: 16
            }
        };

        this.isActive = this._isActive.bind(this);

        this._setVisibilityForTabs();

        // Check is show therapy tab
        this.therapyDataService.getDevices(this.patientId).then((response) => {

            if (response.data.length > 0) {
                const therapyTab = this.tabs.find((tab) => {
                    return tab.title === 'Therapy Data';
                });

                therapyTab.isHidden = false;
            }
        });

        $scope.$on('patientUpdated', () => this._setAllowedAction());

        $scope.$on('$stateChangeStart', (event, toState) => {
            if (toState.name !== 'root.patient.insurances.benefits') {
                this.isBenefitsOpen = false;
            }
        });

        $scope.$on('$stateChangeSuccess', () => {
            if ($state.is('root.patient')) {
                $state.go('root.patient.demographics');
            }
        });

        $scope.$watch(() => this.shortInfo, (newVal) => {
            if (!_.isEmpty(newVal)) {
                this._setAllowedAction();
            }
        }, true);
    }

    collectPayment() {
        this.$state.go('root.collect_payment', { patientId: this.patientId });
    }

    _isActive(view) {
        if (view === 'root.patient.financial.invoices' &&
            (this.$state.current.name === 'root.patient.financial.payments' ||
            this.$state.current.name === 'root.patient.financial.invoices')) {
            return true;
        }

        if (view === 'root.patient.resupply' &&
            (this.$state.current.name === 'root.patient.manage-resupply.view' ||
            this.$state.current.name === 'root.patient.manage-resupply.add')) {
            return true;
        }

        if (view === 'root.patient.insurances' &&
            (this.$state.current.name === 'root.patient.add-insurance' ||
                this.$state.current.name === 'root.patient.edit-insurance')) {
            return true;
        }

        return this.$state.current.name.indexOf(view) !== -1;

    }

    _setAllowedAction() {
        this.invoicesService.getInvoices({ Patient: { Id: this.patientId } }, {}, 0, 1)
            .then((response) => {
                let statementItem = _.find(this.toolbarItems, (item) => item.name === 'statements');

                if (response.data && statementItem) {
                    statementItem.isHidden = !response.data.Count;
                }
            });

        this.patientsService.getDevicesForRegistration(this.patientId)
            .then((response) => {
                let registerDeviceItem = _.find(this.toolbarItems, (item) => item.name === 'registerDevice');

                if (response && registerDeviceItem) {
                    registerDeviceItem.isHidden = !response.length;
                }
            });

        let authorizationItem = _.find(this.toolbarItems, (item) => item.name === 'authorization');

        if (this.shortInfo.Insurances && authorizationItem) {
            authorizationItem.isHidden = !this.shortInfo.Insurances.length;
        }

        if (this.shortInfo.Status) {
            this.toolbarItems.forEach((item) => {
                switch (item.name) {
                    case 'newOrder':
                    case 'insurance':
                    case 'invoice':
                        item.isHidden = !this.shortInfo.Location;
                        break;
                    case 'message':
                        item.isHidden = +this.shortInfo.Status.Id === this.patientStatusConstants.HOLD_STATUS_ID;
                        break;
                    case 'newAppointment':
                        item.isHidden = +this.shortInfo.Status.Id !== this.patientStatusConstants.ACTIVE_STATUS_ID;
                        break;
                    default:
                        break;
                }
            });
        }

        if (this.shortInfo.CanBeEnrolledToMedSage) {
            const medSageToolbarItem = this.toolbarItems.find((item) => item.name === 'medSage');

            medSageToolbarItem.isHidden = false;
            medSageToolbarItem.text = this.shortInfo.MedSageEnrolled ? 'Unenroll from MedSage' : 'Enroll in MedSage';
        }
    }

    _setVisibilityForTabs() {
        const promises = [
            this.rentalOptionsService.getPatientRentalItems(this.patientId, {}, 0, 1),
            this.rentalOptionsService.getPatientRentalHistory(this.patientId, {}, 0, 1)
        ];

        this.$q.all(promises)
            .then((responses) => {
                if (responses[0].data.Count || responses[1].data.Count) {
                    const itemsTabIndex = _.findIndex(this.tabs, { title: 'Items' });

                    this.tabs.splice(itemsTabIndex, 0, this.rentalTabItem);
                }
            });

        // TODO - to find out if we need this
        // this.patientResupplyProgramsService.checkPatientResupplyPrograms(this.patientId)
        //     .then((response) => {
        //         const ordersTabIndex = _.findIndex(this.tabs, { title: 'Orders' });
        //
        //         if (response && response.data) {
        //             this.tabs.splice(ordersTabIndex, 0, this.resupplyTabItem);
        //         }
        //     });
    }

    newDocument($event) {
        this.$mdDialog.show({
            template: addDocumentModalTemplate,
            targetEvent: $event,
            controller: AddDocumentModalCtrl,
            controllerAs: 'addDoc',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            closeTo: '#action-toolbar-trigger'
        });
    }

    goToCmn() {
        this.cmnFormService.goToCmnForm(this.patientId);
    }

    newInsurance() {
        this.$state.go('root.patient.add-insurance');
    }

    newInvoice() {
        let predefinedPatient = {
            DisplayId: this.shortInfo.DisplayId,
            DateOfBirthday: this.shortInfo.DateOfBirthday,
            Name: this.shortInfo.Name,
            Id: this.patientId
        };

        this.$state.go('root.billing.invoices', { showNewInvoiceModal: true, predefinedPatient });
    }

    newAppointment() {
        this.$state.go('root.patient_appointment_wizard', { patientId: this.patientId });
    }

    newAuthorization($event) {
        this.$mdDialog.show({
            template: addAuthorizationTemplate,
            targetEvent: $event,
            controller: AddAuthorizationCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            closeTo: '#action-toolbar-trigger',
            locals: {
                authorizationId: undefined
            }
        });
    }

    newPatient() {
        this.$state.go('root.patients.add.step1');
    }

    newPrescription() {
        this.$state.go('root.patients.newPrescription', { patientId: this.patientId });
    }

    enrollToMedSage() {
        const model = {
            MedSageEnrolled: !this.shortInfo.MedSageEnrolled,
            PatientId: { Id: this.patientId }
        };

        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        this.corePatientService.enrollToMedSage(model)
            .then(() => {
                this.$rootScope.$broadcast('patientUpdated');
                this.ngToast.success(`Patient successfully ${model.MedSageEnrolled ? 'enrolled to' : 'unenrolled from'} MedSage resupply program`);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    newOrder() {
        this.$state.go('root.orders.add', {
            patient: {
                Name: this.shortInfo.Name,
                DateOfBirthday: this.shortInfo.DateOfBirthday,
                Id: this.shortInfo.Id
            }
        });
    }

    newMsg() {
        this.$state.go('root.patient.messages');
    }

    newNote() {
        this.$state.go('root.patient.notes');
    }

    goStatements() {
        const middleName = this.shortInfo.Name.Middle ? this.shortInfo.Name.Middle : '';
        let filterByName = middleName ?
            `${this.shortInfo.Name.First} ${this.shortInfo.Name.Middle} ${this.shortInfo.Name.Last}` :
            `${this.shortInfo.Name.First} ${this.shortInfo.Name.Last}`;

        this.$state.go('root.statements', { filterByName });
    }

    registerDevice($event) {
        this.$mdDialog.show({
            template: registerDeviceModalTemplate,
            targetEvent: $event,
            controller: RegisterDeviceModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            closeTo: '#action-toolbar-trigger',
            locals: {
                patientId: this.patientId
            }
        });
    }

    goToMessagesTab() {
        this.$state.go('root.patient.messages', { patientId: this.patientId });
    }
}
