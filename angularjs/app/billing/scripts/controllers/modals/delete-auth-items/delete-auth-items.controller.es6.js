export default class DeleteAuthItemsCtrl {
    constructor(
        $mdDialog
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
    }

    remove() {
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
