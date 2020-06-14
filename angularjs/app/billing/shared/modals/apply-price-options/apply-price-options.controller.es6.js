export default class applyPriceOptionsController {
    constructor($mdDialog, additionalText) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.additionalText = additionalText;
    }

    save() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}