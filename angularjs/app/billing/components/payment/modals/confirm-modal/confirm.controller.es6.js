export default class ConfirmModalCtrl {
    constructor(
        $rootScope,
        $state,
        $mdDialog,
        text
    ) {
        'ngInject';

        this.text = text;
        this.$mdDialog = $mdDialog;
    }

    confirm() {
        this.$mdDialog.hide({ confirm: true });
    }

    cancel() {
        this.$mdDialog.hide({ confirm: false });
    }
}
