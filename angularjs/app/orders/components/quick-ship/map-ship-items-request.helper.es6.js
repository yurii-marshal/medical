import { shipmentDeliveryMethodConstants } from '../../../core/constants/order.constants.es6';

export function mapQuickShipItemsRequest(shipItems, linkedItems) {

    let model = {
        Items: []
    };

    shipItems.items.allHashes.forEach((hash) => {
        let item = shipItems.items.byHash[hash];

        if (item.deliveryMethod !== shipmentDeliveryMethodConstants.INVENTORY_ID) {
            let newItem = {
                ProductId: item.productId,
                Count: item.count,
                Notes: item.notes,
                ShippedMethod: item.deliveryMethod,
                TrackingNumber: item.trackingNumber
            };

            if (item.trackingNumber) {
                newItem.Carrier = item.deliveryCompany;
            }

            if (item.shipDate) {
                newItem.ShippedDate = moment(item.shipDate).format('YYYY-MM-DD');
            }

            if (!item.isMultiple) {
                newItem.Device = {
                    DeviceId: null,
                    ProductId: item.productId,
                    SerialNumber: item.serialNumber,
                    LotNumber: item.lotNumber,
                    Components: !item.isBundle ? null :
                        item.componentsHashes.reduce((acc, cHash) => {
                            acc.push({
                                ProductId: shipItems.components.byHash[cHash].productId,
                                SerialNumber: shipItems.components.byHash[cHash].serialNumber,
                                LotNumber: shipItems.components.byHash[cHash].lotNumber
                            });

                            return acc;
                        }, [])
                };
            }

            model.Items.push(newItem);
        }

    });

    if (linkedItems.items &&
        linkedItems.items.allHashes &&
        linkedItems.items.allHashes.length) {
        linkedItems.items.allHashes.forEach((hash) => {
            let item = linkedItems.items.byHash[hash];

            model.Items.push({
                ProductId: item.productId,
                Carrier: item.trackingNumber ? item.deliveryCompany : null,
                Count: item.count,
                Notes: item.notes,
                ShippedDate: item.shipDate ? moment(item.shipDate).format('YYYY-MM-DD') : '',
                ShippedMethod: shipmentDeliveryMethodConstants.INVENTORY_ID,
                TrackingNumber: item.trackingNumber,
                Device: {
                    DeviceId: item.id,
                    ProductId: item.productId,
                    SerialNumber: item.serialNumber,
                    LotNumber: item.lotNumber,
                    Components: (!item.componentsHashes || !item.componentsHashes.length) ?
                        null :
                        item.componentsHashes.reduce((acc, cHash) => {
                            acc.push({
                                ProductId: linkedItems.components.byHash[cHash].productId,
                                SerialNumber: linkedItems.components.byHash[cHash].serialNumber,
                                LotNumber: linkedItems.components.byHash[cHash].lotNumber
                            });

                            return acc;
                        }, [])
                }
            });
        });
    }


    return model;
}
