export default class appointmentPickupEquipmentController {
    constructor($mdDialog, selectedOrderEquipment, patientEquipment) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.selectedOrderEquipment = selectedOrderEquipment;
        this.patientEquipment = patientEquipment;

        this.availableEquipmentList = [];

        if (!selectedOrderEquipment || !selectedOrderEquipment.length) {
            angular.copy(this.patientEquipment, this.availableEquipmentList);
        } else {
            this.availableEquipmentList = _.differenceBy(patientEquipment, selectedOrderEquipment, (item) => item.Id);
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        let selectedEquipment = this.availableEquipmentList.filter((item) => item.Selected);

        selectedEquipment = this.selectedOrderEquipment.concat(selectedEquipment);

        this.$mdDialog.hide(selectedEquipment);
    }
}
