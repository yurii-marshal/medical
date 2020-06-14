import * as dotProp from 'dot-prop-immutable';
import { removeLinkedItemReducer } from './linked-items.reducer.es6';

// This reducer needs to be refactored

export function deleteShipItemReducer(state, payload) {

    let stateCopy = angular.copy(state);

    // Relationships
    if (stateCopy.shipItems.items.byHash[payload.hash].linkedItemsHashes) {
        stateCopy = state.shipItems.items.byHash[payload.hash].linkedItemsHashes
            .reduce((reduceState, linkedItemHash) => {
                return removeLinkedItemReducer(reduceState, {
                    hash: linkedItemHash,
                    productHash: payload.hash
                });
            }, stateCopy);
    }
    // End Relationships

    const removedLinkedItems = angular.copy(stateCopy);

    const shipItems = removedLinkedItems.shipItems;
    let currentItem = shipItems.items.byHash[payload.hash];

    if (currentItem.isBundle) {
        currentItem.componentsHashes.forEach((cHash) => {
            delete shipItems.components.byHash[cHash];
        });

        shipItems.components.allHashes = shipItems.components.allHashes.filter((hash) => {
            return currentItem.componentsHashes.indexOf(hash) === -1;
        });
    }

    shipItems.items.allHashes = shipItems.items.allHashes.filter((hash) => {
        return hash !== currentItem.hash;
    });

    delete shipItems.items.byHash[payload.hash];

    const updatedShipItems = dotProp.set(removedLinkedItems, 'shipItems', shipItems);

    return updatedShipItems;
}

