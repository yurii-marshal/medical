export default class updateAssociationModalController {
    constructor($mdDialog) {
        'ngInject';

        this.$mdDialog = $mdDialog;
    }

    cancel () {
        this.$mdDialog.cancel();
    }

    update () {
        this.$mdDialog.hide();
    }

}
