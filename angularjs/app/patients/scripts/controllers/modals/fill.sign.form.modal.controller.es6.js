export default class fillSignFormModalController {
    constructor($mdDialog, signedData) {
        'ngInject';

        this.$mdDialog =  $mdDialog;

        this.signature = null;

        if (signedData) {
            this.signature = signedData;
        }
    }

    setSignatureBytes(bytes) {
        this.signature = bytes;
    }

    save() {
        if (this.signFillForm.$valid) {
            this.$mdDialog.hide(this.signature);
        } else {
            touchedErrorFields(this.signFillForm);
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
