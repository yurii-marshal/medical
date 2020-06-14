export default class UpdateResupplyProgramModalController {
    constructor($mdDialog, items) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.items = items;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    update() {
        this.$mdDialog.hide(this.items);
    }
}
