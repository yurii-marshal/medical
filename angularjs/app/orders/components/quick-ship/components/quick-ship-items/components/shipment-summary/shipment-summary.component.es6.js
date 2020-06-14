import template from './shipment-summary.html';
import { patientGenderConstants } from '../../../../../../../core/constants/core.constants.es6';

class ShipmentSummaryCtrl {
    constructor(quickShipService) {
        'ngInject';

        this.quickShipService = quickShipService;
        this.genders = patientGenderConstants;

        this.isPackagingSlipLoading = false;
    }

    generatePackagingSlip() {
        const items = this.shipItems.items;
        const data = {
            Items: items.allHashes.reduce((acc, hash) => {
                acc.push({
                    ProductId: items.byHash[hash].productId,
                    Qty: items.byHash[hash].count
                });

                return acc;
            }, [])
        };

        this.isPackagingSlipLoading = true;
        this.quickShipService.generatePackagingSlip(this.orderShortInfo.id, this.patientInfo.id, data)
            .then(() => this.isPackagingSlipLoading = false);
    }
}

const shipmentSummary = {
    bindings: {
        shipItems: '<',
        orderShortInfo: '<',
        patientInfo: '<'
    },
    template,
    controller: ShipmentSummaryCtrl
};

export default shipmentSummary;
