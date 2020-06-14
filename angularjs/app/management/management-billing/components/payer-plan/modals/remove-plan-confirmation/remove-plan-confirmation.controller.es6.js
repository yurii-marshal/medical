export default class PayerPlanRemoveController {
    constructor($mdDialog, tabs, planName) {
        'ngInject';

        this.tabs = tabs;
        this.planName = planName;

        this.$mdDialog = $mdDialog;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    remove() {
        this.$mdDialog.hide(true);
    }
}
