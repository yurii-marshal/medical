export default class attachPatientController {
    constructor($mdDialog, infinityTableService, ordersService, orderId) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.infinityTableService = infinityTableService;
        this.ordersService = ordersService;
        this.orderId = orderId;

        this.searchTextPatient = undefined;
    }

    querySearchPatient(query) {
        return this.ordersService.getPatientsByName(query)
            .then(response => response.data.Items);
    }

    doAttach() {
        if (this.Form.$invalid) {
            touchedErrorFields(this.Form);
            return;
        }

        this.ordersService.attachPatientToOrder(this.orderId, this.selectedPatient.Id)
            .then(_ => {
                this.$mdDialog.hide();
                this.infinityTableService.reload();
            });
    }

    closeWindow() {
        this.$mdDialog.close();
    }
}
