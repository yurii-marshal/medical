export default class SaveConfirm {
    constructor($mdDialog) {
        'ngInject';

        this.$mdDialog = $mdDialog;
    }

    save() {
        this.$mdDialog.hide(true);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
