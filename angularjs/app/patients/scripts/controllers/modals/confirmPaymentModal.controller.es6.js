export default class confirmPaymentModalController {
    constructor($mdDialog, shortInfo, Amount, Card) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.shortInfo = shortInfo;
        this.Amount = Amount;
        this.Card = Card;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    confirm() {
        this.$mdDialog.hide();
    }
}