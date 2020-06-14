export default class BenefitsController {
    constructor(bsLoadingOverlayService,
                patientInsurancesService,
                $state,
                ngToast,
                $timeout) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientInsurancesService = patientInsurancesService;
        this.ngToast = ngToast;
        this.$timeout = $timeout;

        this.patientId = $state.params.patientId;
        this.insuranceId = $state.params.insuranceId;
        this.insuranceName = $state.params.insuranceName;
        this.transactionId = $state.params.transactionId;
        this.RequestValidation = {};
        this.showInProgress = false;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'benefits' });

        this.patientInsurancesService.getBenefits(this.transactionId)
            .then((res) => {
                if (res.data.Errors) {
                    const errString = angular.isArray(res.data.Errors)
                        ? res.data.Errors.map((i) => i.Message).join('<br/>')
                        : res.data.Errors;

                    this.ngToast.danger(`Error: ${errString}`);
                    return;
                }

                if (res.data.Status && res.data.Status.Name === 'InProgress') {
                    this.showInProgress = true;
                    // update page after 10 sec.
                    this.$timeout(this._activate, 10*1000);
                } else {
                    this.showInProgress = false;
                }

                this.RequestValidation = res.data.RequestValidation || {};
                this.model = res.data.Details;
                this.model.Eligibility.Coverages = this._mapBenefitsStatusClass(this.model.Eligibility.Coverages);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'benefits' }));
    }

    _mapBenefitsStatusClass(benefits) {
        function getClass(item) {
            const activeStatusesIds = ['1', '2', '3', '3', '5'];
            const itemId = item.Status.Id.toString();

            if (activeStatusesIds.indexOf(itemId) !== -1) {
                return true;
            }
        }

        benefits.map((benefit) => {
            benefit.Status.Class = getClass(benefit) ? 'active' : '';
        });

        return benefits;
    }

}
