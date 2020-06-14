export default class productLookupModalController {
    constructor($mdDialog, lookupId) {
        'ngInject';
        this.$mdDialog = $mdDialog;
        this.lookupId = lookupId;

    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save () {
        this.$mdDialog.hide();
    }
}
