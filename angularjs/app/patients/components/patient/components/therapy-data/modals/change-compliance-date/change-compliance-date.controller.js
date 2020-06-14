export default class ChangeComplianceDate {
    constructor($mdDialog, date, registeredDate) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.complianceDate = date;
        this.registeredDate = moment(registeredDate).format('MM/DD/YYYY');
        this.todayDate = moment().format('MM/DD/YYYY');
    }

    save() {
        this.$mdDialog.hide(this.complianceDate);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
