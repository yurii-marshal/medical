export default class manualVerificationModalController {
    constructor($rootScope, $mdDialog, patientInsurancesService, insurance) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.patientInsurancesService = patientInsurancesService;

        this.insurance = insurance;
    }

    verify() {
        this.patientInsurancesService.manuallyVerify(this.insurance.Id)
            .then(() => this.$rootScope.$broadcast('insurancesUpdated'))
            .finally(() => this.$mdDialog.cancel());
    }

    close() {
        this.$mdDialog.cancel();
    }
}
