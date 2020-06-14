export default class changePriorityModalController {
    constructor(
        $rootScope,
        $mdDialog,
        invoicesService,
        patientInsurancesService,
        insurances,
        invoiceId
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.invoicesService = invoicesService;
        this.patientInsurancesService = patientInsurancesService;

        this.insurances = _.sortBy(insurances, ['PositionIndex']);

        this.invoiceId = invoiceId;

        this.reorderedInsurances = [];
        this.isSaveDisabled = false;

        this.sortableOptions1 = {
            orderChanged: (event) => this.reorderedInsurances = event.dest.sortableScope.modelValue
        };
    }

    save() {
        this.isSaveDisabled = true;
        let promise = this.invoiceId ?
            this.invoicesService.reorderInsurances(this.reorderedInsurances, this.invoiceId) :
            this.patientInsurancesService.reorderInsurances(this.reorderedInsurances);

        promise
            .then(() => {
                this.$rootScope.$broadcast('patientUpdated');
                this.$mdDialog.hide();
            })
            .finally(() => this.isSaveDisabled = false);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
