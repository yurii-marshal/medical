// Modal Controllers
import autoVerificationModalController from './modals/auto-verification/autoVerificationModal.controller.es6.js';
import manualVerificationModalController from './modals/manual-verification/manualVerificationModal.controller.es6.js';
import insuranceFailedModalController from './modals/insurance-failed/insuranceFailedModal.controller.es6.js';

// Modal templates
import insuranceFailedModalTemplate from './modals/insurance-failed/insurance-failure-info-modal.html';
import manualVerificationModalTemplate from './modals/manual-verification/manual-verification-modal.html';
import autoVerificationModalTemplate from './modals/auto-verification/auto-verification-modal.html';

export default class insurancesListController {
    constructor($q, $scope, $state, $mdDialog, bsLoadingOverlayService, patientInsurancesService) {
        'ngInject';

        this.$q = $q;
        this.$scope = $scope;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientInsurancesService = patientInsurancesService;

        this.patientId = $state.params.patientId;
        this.insurances = [];

        $scope.$on('insurancesUpdated', () => this._getInsurances());

        this.isActiveItems = true;
        this.loadingItems = false;

        this._getActiveInsurancesPromise();
    }

    _getInsurances() {
        if (this.isActiveItems) {
            return this._getActiveInsurancesPromise();
        }

        return this._getHistoryInsurancesPromise();
    }

    _getActiveInsurancesPromise() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        return this.patientInsurancesService.getInsurances(this.patientId)
            .then((response) => {
                this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' });
                this.insurances = response.data.Items;
            });
    }

    _getHistoryInsurancesPromise() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        return this.patientInsurancesService.getInsurancesHistory(this.patientId)
            .then((response) => {
                this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' });
                this.insurances = response.data;
            });
    }

    changeStatus() {
        this.isActiveItems = !this.isActiveItems;

        this.loadingItems = true;

        this._getInsurances().then(() => {
            this.loadingItems = false;
        });
    }

    editInsurance(insuranceId) {
        this.$state.go('root.patient.edit-insurance', { insuranceId });
    }

    deleteInsurance(event, insuranceId) {
        this.$mdDialog.show({
            templateUrl: 'patients/views/modals/deleteInsurance.html',
            targetEvent: event,
            controller: 'deleteInsuranceModalController as delIns',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: { insuranceId }
        });
    }

    manualVerification(event, insurance) {
        this.$mdDialog.show({
            template: manualVerificationModalTemplate,
            targetEvent: event,
            controller: manualVerificationModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: { insurance }
        });
    }

    autoVerification(event, insurance) {
        this.$mdDialog.show({
            template: autoVerificationModalTemplate,
            targetEvent: event,
            controller: autoVerificationModalController,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: {
                insurance,
                patientId: this.patientId
            }
        })
        .then((response) => {
            if (response) {
                this._getInsurances();
                this.showFailureDetails(response);
            }
        });
    }

    insuranceVerification(event, insurance) {
        if (insurance.VerificationInfo.NeedManuallyVerification) {
            this.manualVerification(event, insurance);
        } else {
            this.autoVerification(event, insurance);
        }
    }

    showFailureDetails(FailureInfo) {
        this.$mdDialog.show({
            template: insuranceFailedModalTemplate,
            controller: insuranceFailedModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { FailureInfo }
        });
    }
}
