import * as dotProp from 'dot-prop-immutable';

import {
    addLinkedItemsIdsToShipItemReducer,
    updateShipItemCountWithLinkedItemsReducer
} from './ship-items.reducers.es6';
import {
    updateInvLinkedCountByPickedItemsReducer,
    decreaseCountInventoryReducer
} from './inventory.reducers.es6';

import { subtractSelectedCountReducer } from './location-products-counter.reducer.es6';

export function addLinkedItemsReducer(state, payload) {
    const { pickedItems } = payload;
    const { shipItemHash } = payload;

    const newItemsState = Object.assign({}, state.linkedItems.items);

    // Map data with new hash shipItemHash_itemId and save prev count
    pickedItems.items.allIds.forEach((itemId) => {
        const currentItem = pickedItems.items.byId[itemId];

        const hash = `${ shipItemHash }_${ currentItem.id }`;
        let count = currentItem.count;

        if (newItemsState.byHash[hash]) {
            count += newItemsState.byHash[hash].count;
        }

        newItemsState.byHash[hash] = Object.assign({}, newItemsState.byHash[hash], pickedItems.items.byId[itemId], { count });

        if (pickedItems.items.byId[itemId].componentsIds) {
            newItemsState.byHash[hash].componentsHashes = pickedItems.items.byId[itemId].componentsIds.map((componentId) => {
                return `${ shipItemHash }_${ componentId }`;
            });
        }

        delete newItemsState.byHash[hash].componentsIds;
        newItemsState.byHash[hash]._hash = hash;
    });

    newItemsState.allHashes = Object.keys(newItemsState.byHash);

    const updatedWithLinkedItemsByHash = dotProp.set(
        state,
        'linkedItems.items.byHash',
        (byHash) => Object.assign({}, byHash, newItemsState.byHash)
    );

    const updatedWithLinkedItemsAllHashes = dotProp.set(
        updatedWithLinkedItemsByHash,
        'linkedItems.items.allHashes',
        (allIds) => [...new Set(allIds.concat(newItemsState.allHashes))]
    );

    // Relationships
    const updatedWithShipItem = addLinkedItemsIdsToShipItemReducer(updatedWithLinkedItemsAllHashes, {
        itemIds: pickedItems.items.allIds,
        shipItemHash
    });

    const updatedWithLinkedCount = updateShipItemCountWithLinkedItemsReducer(updatedWithShipItem, shipItemHash);

    const updatedWithLinkedComponents = addLinkedItemsComponentsReducer(updatedWithLinkedCount, payload);

    const updatedWithInventoryCount = updateInvLinkedCountByPickedItemsReducer(updatedWithLinkedComponents, { pickedItems });

    return updatedWithInventoryCount;

}

export function updateLinkedItemReducer(state, payload) {
    const { itemChanges } = payload;
    const { hash } = payload;

    const updatedItem = dotProp.set(
        state,
        `linkedItems.items.byHash.${hash}`,
        (item) => Object.assign({}, item, itemChanges)
    );

    return updatedItem;
}

export function removeLinkedItemReducer(state, payload) {
    const { hash } = payload;
    const { productHash } = payload;
    const linkedItem = state.linkedItems.items.byHash[hash];

    const removedItemByHash = dotProp.delete(state, `linkedItems.items.byHash.${hash}`);

    const removedItemAllHashes = dotProp.set(
        removedItemByHash,
        `linkedItems.items.allHashes`,
        (allHashes) => allHashes.filter((itemHash) => itemHash !== hash)
    );

    const removedShipItemsLinkedHashes = dotProp.set(
        removedItemAllHashes,
        `shipItems.items.byHash.${ productHash }.linkedItemsHashes`,
        (linkedItemsHashes) => linkedItemsHashes.filter((itemHash) => itemHash !== hash)
    );

    // Relationships
    const updatedWithLinkedCount = updateShipItemCountWithLinkedItemsReducer(removedShipItemsLinkedHashes, productHash);

    const decreasedCountInventory = decreaseCountInventoryReducer(updatedWithLinkedCount, {
        productId: linkedItem.productId,
        count: linkedItem.count
    });

    const decreasedSelectedCount = subtractSelectedCountReducer(decreasedCountInventory, {
        id: linkedItem.id,
        count: linkedItem.count
    });

    return decreasedSelectedCount;
}

export function addLinkedItemsComponentsReducer(state, payload) {

    const { pickedItems } = payload;
    const { shipItemHash } = payload;

    const newComponentState = Object.assign({}, state.linkedItems.components);

    pickedItems.components.allIds.forEach((componentId) => {
        const hash = `${ shipItemHash }_${ componentId }`;

        newComponentState.byHash[hash] = Object.assign({}, newComponentState.byHash[hash], pickedItems.components.byId[componentId]);
        newComponentState.byHash[hash]._hash = hash;
    });

    newComponentState.allHashes = Object.keys(newComponentState.byHash);

    const updatedWithLinkedComponentsByHash = dotProp.set(
        state,
        'linkedItems.components.byHash',
        (byHash) => Object.assign({}, byHash, newComponentState.byHash)
    );

    const updatedWithLinkedComponentsAllHashes = dotProp.set(
        updatedWithLinkedComponentsByHash,
        'linkedItems.components.allHashes',
        (allHashes) => [...new Set(allHashes.concat(newComponentState.allHashes))]
    );

    return updatedWithLinkedComponentsAllHashes;
}
