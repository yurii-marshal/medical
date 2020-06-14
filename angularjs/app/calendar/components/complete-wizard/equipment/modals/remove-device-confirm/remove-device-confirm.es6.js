export default class RemoveDeviceConfirmController {
    constructor($mdDialog, maxCountToMove, deviceName) {
        'ngInject';

        this.deviceName = deviceName;
        this.maxCountToMove = maxCountToMove;
        this.$mdDialog = $mdDialog;
        this.countItems = 1;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    remove() {
        if (this.Form.$valid) {
            this.$mdDialog.hide({
                'countItems': this.countItems
            });
        } else {
            touchedErrorFields(this.Form);
        }
    }
}
