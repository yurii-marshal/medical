export default class ValidationErrorsModalController {
    constructor(
        $mdDialog
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
    }

    close() {
        this.$mdDialog.hide();
    }
}
