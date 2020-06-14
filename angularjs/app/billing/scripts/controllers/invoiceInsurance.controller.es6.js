import { insuredSignatureOnFileConstants } from '../../../core/constants/billing.constants.es6';
import { patientGenderConstants } from '../../../core/constants/core.constants.es6';

// CHANGE PRIORITY MODAL
import changePriorityModalTemplate from '../../../core/modals/insurance-change-priority/insurance-change-priority.html';
import changePriorityModalController from '../../../core/modals/insurance-change-priority/insurance-change-priority.controller.es6.js';

// EDIT INSURANCE MODAL
import editInsuranceTemplate from '../../shared/modals/edit-insurance/edit-insurance.html';
import EditInsuranceCtrl from '../../shared/modals/edit-insurance/edit-insurance.controller.es6.js';

// UPDATE INSURANCE MODAL
import updateInsuranceModalTemplate from '../../shared/modals/update-insurance/update-insurance.html';
import updateInsuranceModalController from '../../shared/modals/update-insurance/update-insurance.controller.es6.js';

export default class invoiceInsuranceController {
    constructor($q, $rootScope, $state, $mdDialog, ngToast, bsLoadingOverlayService, invoicesService, payersService) {
        'ngInject';

        this.$q = $q;
        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.payersService = payersService;

        this.insuredSignatureOnFileConstants = insuredSignatureOnFileConstants;
        this.patientGenderConstants = patientGenderConstants;

        this.invoiceId = $state.params.invoiceId;
        this.model = invoicesService.getModel();
        this.insuranceTypeCodes = [];
        this.insurances = [];
        this.insurancesCount = undefined;

        this.getInsuranceList();
    }

    getInsuranceList() {
        const params = { pageIndex: 0, pageSize: 100 };
        const promises = [
            this.invoicesService.getInsuranceList(this.invoiceId, params),
            this.payersService.getInsuranceTypesCodes()
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'insuranceList' });
        this.$q.all(promises)
            .then((responses) => {
                this.insuranceTypeCodes = responses[1].data;
                this.insurances = responses[0].data.Items.map((item) => {
                    item.InsuranceTypeCode = this.insuranceTypeCodes.find((code) => item.InsuranceTypeCode && code.Id === item.InsuranceTypeCode);
                    return item;
                });
                this.insurancesCount = responses[0].data.Count;
                // TODO uncomment after release
                // this.insurances = this.insurances.map((ins) => {
                //     ins.PositionIndex = ins.PriorityOrder;
                //     return ins;
                // });
            })
            .catch(() => this.insurancesCount = undefined)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'insuranceList' }));
    }

    deleteInsurance(ins) {
        this.bsLoadingOverlayService.start({ referenceId: 'insuranceList' });
        this.invoicesService.deleteInsurance(this.invoiceId, ins.Id)
            .then(() => {
                let index = _.findIndex(this.insurances, (item) => item.Id.toString() === ins.Id.toString());
                if (index !== -1) { this.insurances.splice(index, 1); }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'insuranceList' }));
    }

    editInsurance(event, insuranceId) {
        this.$mdDialog.show({
            template: editInsuranceTemplate,
            controller: EditInsuranceCtrl,
            controllerAs: '$ctrl',
            targetEvent: event,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                invoiceId: this.invoiceId,
                patientId: this.model.Patient.Id,
                insuranceTypeCodes: this.insuranceTypeCodes,
                insuranceId
            }
        }).then(() => this.getInsuranceList());
    }

    updateInsurances(event) {
        this.$mdDialog.show({
            template: updateInsuranceModalTemplate,
            controller: updateInsuranceModalController,
            controllerAs: '$ctrl',
            targetEvent: event,
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                invoiceId: this.invoiceId,
                patientId: this.model.Patient.Id
            }
        }).then(() => {
            this.ngToast.success('All patient insurance were successfully updated');
            this.getInsuranceList();
        });
    }

    updateInsuranceSingle(invoiceInsuranceId, patientInsuranceId) {
        this.bsLoadingOverlayService.start({ referenceId: 'insuranceList' });
        this.invoicesService.updateInsuranceSingle(this.invoiceId, patientInsuranceId, invoiceInsuranceId, this.model.Patient.Id)
            .then(() => {
                this.ngToast.success('Insurance was successfully updated');
                this.getInsuranceList();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'insuranceList' }));
    }

    changePriority(event) {
        this.$mdDialog.show({
            template: changePriorityModalTemplate,
            controller: changePriorityModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            locals: {
                invoiceId: this.invoiceId,
                // TODO remove after release
                insurances: this.insurances.map((ins) => {
                    ins.PositionIndex = ins.PriorityOrder;
                    return ins;
                })
            }
        }).then(() => {
            this.getInsuranceList();
            this.$rootScope.$broadcast('reloadInvoiceInfo');
        });
    }
}
