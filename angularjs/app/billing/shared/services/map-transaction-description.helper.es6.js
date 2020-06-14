import {
    adjustmentTypeConstants,
    adjustmentSourceConstants
} from '../../../core/constants/billing.constants.es6';

export function mapTransactionsDescription(transactions) {

    return transactions.map((item) => {
        if (item.Source.Id === adjustmentSourceConstants.PATIENT_ID &&
            item.Type.Id === adjustmentTypeConstants.PAYMENT_ID) {

            item.description = `${item.PaymentMethod.Name}`;

        } else if (item.Source.Id === adjustmentSourceConstants.PROVIDER_ID &&
            item.Type.Id === adjustmentTypeConstants.ADJUSTMENT_ID) {

            item.description = `Provider adjustment: ${item.AdjustmentReason.Name}`;

        } else if (item.Source.Id === adjustmentSourceConstants.PAYER_ID) {
            item.description = `EOB/ERA Received - ${item.PayerName}(${item.Coverage.Name})`;
        }

        return item;
    });


}
