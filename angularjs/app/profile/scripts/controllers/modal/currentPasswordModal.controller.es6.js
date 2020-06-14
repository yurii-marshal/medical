export default class currentPasswordModalController {
    constructor($mdDialog) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.password = undefined;
    }

    save() {
        this.$mdDialog.hide(this.password);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    submitForm(event) {
        if (event.keyCode === 13) { this.save(); }
    }
}
