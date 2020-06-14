export default class autoVerificationModalController {
    constructor($rootScope, $state, $mdDialog, patientInsurancesService, insurance, patientId) {
        'ngInject';

        patientInsurancesService.autoVerify(insurance.Id)
            .then((response) => {
                if (response.data && response.data.Success) {
                    $state.go('root.benefits', {
                        transactionId: response.data.VerificationInfo.TransactionId,
                        insuranceId: insurance.Id,
                        patientId: patientId,
                        insuranceName: insurance.Payer.Name
                    });
                } else if (response.data && response.data.FailureInfo) {
                    $mdDialog.hide(response.data.FailureInfo);
                } else {
                    $rootScope.$broadcast('insurancesUpdated');
                }
            })
            .finally(() => $mdDialog.cancel());
    }
}
