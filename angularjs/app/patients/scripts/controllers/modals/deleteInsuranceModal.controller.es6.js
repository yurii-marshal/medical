export default class deleteInsuranceModalController {
    constructor($rootScope,
                $mdDialog,
                bsLoadingOverlayService,
                patientInsurancesService,
                insuranceId) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$rootScope = $rootScope;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientInsurancesService = patientInsurancesService;
        this.insuranceId = insuranceId;
    }

    close() {
        this.$mdDialog.cancel();
    }

    delete() {
        this.$mdDialog.cancel();
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        this.patientInsurancesService.deleteInsurance(this.insuranceId)
            .then(() => {
                this.$rootScope.$broadcast('insurancesUpdated');
                this.$rootScope.$broadcast('patientUpdated');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }
}
