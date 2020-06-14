// Constants
import { pricingTypeConstants } from '../../../../core/constants/billing.constants.es6';

export default class invoiceRentalServiceLineModalController {
    constructor( $mdDialog, invoiceId, saveFn, lines ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.invoiceId = invoiceId;
        this.save = saveFn;
        this.lines = lines;
    }

    isNotInitiated(line) {
        return line.PriceType.Id === pricingTypeConstants.RENTAL_TYPE_ID && !line.RentStartSettings && !line.RentProgramId;
    }

    saveInvoice() {
        this.save();
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}

