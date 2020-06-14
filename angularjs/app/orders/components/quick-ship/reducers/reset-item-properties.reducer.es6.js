import * as dotProp from 'dot-prop-immutable';
import { shipmentDeliveryMethodConstants } from '../../../../core/constants/order.constants.es6';
import { removeLinkedItemReducer } from './linked-items.reducer.es6';

export function resetItemProperties(state, payload) {
    const shipItems = angular.copy(state.shipItems);
    let currentItem = shipItems.items.byHash[payload.hash];

    const method = currentItem.deliveryMethod;

    if (method !== shipmentDeliveryMethodConstants.INVENTORY_ID) {
        currentItem.count = currentItem.countInOrder || 1;
        currentItem.trackingNumber = null;
        currentItem.deliveryCompany = null;
        currentItem.shipDate = '';

        if (currentItem.isSerialized) {
            currentItem.serialNumber = null;
        }

        if (currentItem.isLotted) {
            currentItem.lotNumber = null;
        }
    }

    // Clearing Bundle components
    let stateWithClearedBundleComponents = state;

    if (currentItem.isBundle) {
        stateWithClearedBundleComponents = currentItem.componentsHashes.reduce((newState, cHash) => {
            const updatedComponent = Object.assign({}, shipItems.components.byHash[cHash]);

            if (updatedComponent.isSerialized) {
                updatedComponent.serialNumber = null;
            }

            if (updatedComponent.isLotted) {
                updatedComponent.lotNumber = null;
            }

            return dotProp.set(
                newState,
                `shipItems.components.byHash.${ cHash }`,
                updatedComponent
            );
        }, state);
    }

    const resetedItemProperties = dotProp.set(
        stateWithClearedBundleComponents,
        `shipItems.items.byHash.${payload.hash}`,
        currentItem
    );

    let resetedItemCount = resetedItemProperties;

    if (method === shipmentDeliveryMethodConstants.INVENTORY_ID) {

        currentItem = resetedItemProperties.shipItems.items.byHash[payload.hash];

        currentItem.count = currentItem.linkedItemsHashes && currentItem.linkedItemsHashes.length ?
            currentItem.linkedItemsHashes.reduce((acc, hash) => {
                return acc + state.linkedItems.items.byHash[hash].count;
            }, 0) :
            (currentItem.countInOrder || 1);

        resetedItemCount = dotProp.set(
            resetedItemProperties,
            `shipItems.items.byHash.${payload.hash}`,
            currentItem
        );

    }

    let deletedLinkedItems = resetedItemCount;

    if (resetedItemCount.shipItems.items.byHash[payload.hash].linkedItemsHashes) {
        deletedLinkedItems = resetedItemCount.shipItems.items.byHash[payload.hash].linkedItemsHashes
            .reduce((reduceState, linkedItemHash) => {
                return removeLinkedItemReducer(reduceState, {
                    hash: linkedItemHash,
                    productHash: payload.hash
                });
            }, resetedItemCount);
    }
    
    return deletedLinkedItems;
}
