import PrescriptionOptionsCtrl from './modals/prescription-options/prescription-options.controller.es6.js';
import PrescriptionFaxCtrl from './modals/prescription-fax/prescription-fax.controller.es6.js';

import PrescriptionFaxTpl from './modals/prescription-fax/prescription-popup-fax.html';
import PrescriptionOptionsTpl from './modals/prescription-options/prescription-popup.html';

export default class PatientPrescriptionCtrl {
    constructor(popupMenuCalendar,
                bsLoadingOverlayService,
                $mdDialog,
                $state,
                prescriptionService) {
        'ngInject';

        this.prescriptionService = prescriptionService;
        this.popoverMenu = popupMenuCalendar;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$mdDialog = $mdDialog;
        this.$state = $state;

        this.patientId = $state.params.patientId;
        this.patientName = $state.params.patientName; // where get patient name
        this.statuses = {
            prescriptionNew: 1,
            prescriptionActive: 2,
            prescriptionExpired: 3
        };

        this.firstPageLoaded = false;
        this.loading = false;

        this.prescriptionsListParams = {
            items: [],
            pageSize: 10,
            pageIndex: 0,
            stopLoading: false
        };

        /**
         * @interface this.prescriptionsList
         {
              "Count": 0,
              "Items": [
                {
                  "Id": "string",
                  "EffectiveDate": "2018-02-05T12:45:17.046Z",
                  "Hcpcs": [
                    "string"
                  ],
                  "Status": {
                    "Id": "string",
                    "Text": "string",
                    "Code": "string"
                  },
                  "CreatedBy": {
                    "First": "string",
                    "Last": "string",
                    "Middle": "string",
                    "FullName": "string"
                  },
                  "CreatedOn": "2018-02-05T12:45:17.046Z",
                  "ModifiedBy": {
                    "First": "string",
                    "Last": "string",
                    "Middle": "string",
                    "FullName": "string"
                  },
                  "ModifiedOn": "2018-02-05T12:45:17.046Z",
                  "TreatingProvider": {
                    "Id": "string",
                    "Practice": "string",
                    "Npi": "string",
                    "PhysicianName": {
                      "First": "string",
                      "Last": "string",
                      "Middle": "string",
                      "FullName": "string"
                    },
                    "Location": {
                      "Address": "string",
                      "Phone": "string",
                      "Fax": "string",
                      "Email": "string"
                    }
                  }
                }
              ]
            }
         */

    }

    getPrescriptions() {
        if (this.prescriptionsListParams.stopLoading) {
            return;
        }

        const params = {
            patientId: this.patientId,
            pageSize: this.prescriptionsListParams.pageSize,
            pageIndex: this.prescriptionsListParams.pageIndex
                            ? this.prescriptionsListParams.pageIndex
                            : 0
        };

        this.loading = true;
        this.prescriptionsListParams.stopLoading = true;
        this.bsLoadingOverlayService.start({ referenceId: 'prescriptionList' });
        this.prescriptionService.getPrescriptionsList(params)
            .then((response) => {
                if (response && response.length) {

                    const mappedItems = response.map((prescription) => {
                        this.prescriptionService.mapTreatingProviderContacts(prescription.TreatingProvider);
                        return prescription;
                    });

                    this.prescriptionsListParams.items = this.prescriptionsListParams.items.concat(mappedItems);
                    this.prescriptionsListParams.pageIndex++;
                    this.prescriptionsListParams.stopLoading = response.length < this.prescriptionsListParams.pageSize;
                }

                if (!this.firstPageLoaded) {
                    this.firstPageLoaded = true;
                }
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'prescriptionList' });
                this.loading = false;
            });
    }

    _clearPrescriptionsList() {
        window.scrollTo(0, 0);

        this.firstPageLoaded = false;

        this.prescriptionsListParams = {
            items: [],
            pageSize: 6,
            pageIndex: 0,
            stopLoading: false
        };
    }

    openUpdatePrescriptionMenu(actions, prescription, event) {
        event.stopPropagation();
        let menuItems = this._getPopoverMenuItems(actions, prescription);

        this.popoverMenu.showPopupMenu(menuItems, event);
    }

    _getPopoverMenuItems(actions, prescription) {
        let popoverMenuItems = [], fax = '';

        if (prescription.TreatingProvider.Location
            && prescription.TreatingProvider.Location.Fax) {
            fax = prescription.TreatingProvider.Location.Fax;
        }
        angular.forEach(actions, (item) => {
            popoverMenuItems.push({
                'title': item.Text,
                'class': 'no-left-icon',
                'exec': () => {
                    let params = {
                        prescriptionId: prescription.Id,
                        action: item.Id,
                        fax,
                        options: this._getDefaultOptions()
                    };

                    this._showOptionsPopup(params);
                }
            });
        });
        return popoverMenuItems;
    }

    /**
     * Show modal with Options.
     * @param {Object} params
     * @param {String} params.prescriptionId,
     * @param {String} params.action
     * @param {String} params.fax
     * @param {Object} params.options returned by this._getDefaultOptions()
     */
    _showOptionsPopup(params) {
        this.$mdDialog.show({
            template: PrescriptionOptionsTpl,
            clickOutsideToClose: true,
            controllerAs: 'modal',
            locals: { params, actionDispatcher: (action, params) => this._actionDispatcher(action, params) },
            controller: PrescriptionOptionsCtrl
        });
    }

    /**
     * Show input modal for fax.
     * @param {Object} params
     * @param {String} params.prescriptionId,
     * @param {String} params.action
     * @param {String} params.fax
     * @param {Object} params.options returned by this._getDefaultOptions()
     * @param {Function} actionFunc
     */
    _showFaxModal(params, actionFunc) {
        this.$mdDialog.show({
            template: PrescriptionFaxTpl,
            targetEvent: event,
            clickOutsideToClose: true,
            locals: { actionFunc, params, showOptionsPopup: (params) => this._showOptionsPopup(params) },
            controllerAs: 'modal',
            controller: PrescriptionFaxCtrl
        });
    }

    _getDefaultOptions() {
        return {
            LegibleOrder: true,
            PatientName: true,
            SignedDate: true,
            StartOrderDate: true,
            FrequencyOfUse: true,
            PhysicianName: true,
            PhysicianSignature: true,
            PhysicianNpi: true,
            QualifiedDiagnosisCode: true,
            ItemDescription: true
        };
    }

    _actionDispatcher(action, params) {
        switch (action) {
            case '1': // electronically - not implemented on back
                break;
            case '2': // fax
                return this._showFaxModal(params, (fax) => {
                    return this.prescriptionService
                        .prescriptionActionFax(params.prescriptionId, params.options, fax);
                });
                break;
            case '3': // print
                return this.prescriptionService
                    .prescriptionActionPrint(params.prescriptionId, params.options, this.patientName);
                break;
            default:
                break;
        }
    }

    deletePrescription(event, id) {
        event.stopPropagation();

        if (this.loading) {
            return;
        }
        this.loading = true;
        this.bsLoadingOverlayService.start({ referenceId: 'prescriptionList' });
        this.prescriptionService.deletePrescription(id)
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'prescriptionList' });

                this._clearPrescriptionsList();
                this.getPrescriptions();
            });
    }

    updatePrescription(event, prescriptionId) {
        event.stopPropagation();
        this.$state.go('root.patients.prescriptionUpdate.view', { patientId: this.patientId, prescriptionId });
    }

    openPrescriptionDetails(event, prescriptionId) {
        event.stopPropagation();

        if (this.loading) {
            return;
        }
        this.$state.go('root.patient.prescriptionDetails', { patientId: this.patientId, prescriptionId });
    }
}
