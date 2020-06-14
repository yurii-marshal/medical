export default class PrescriptionOptionsCtrl {
    constructor($mdDialog, params, actionDispatcher) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.actionDispatcher = actionDispatcher;
        this.params = params;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (!this.formModal.$valid) {
            touchedErrorFields(this.formModal);
            return;
        }

        // popup menu has actions: "1","2","3" => electronically,fax,print
        this.actionDispatcher(this.params.action, angular.merge(this.params));
    }
}
