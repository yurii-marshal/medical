import * as dotProp from 'dot-prop-immutable';
import { resetItemProperties } from './reset-item-properties.reducer.es6';

export function setShipItemsReducer(state, payload) {
    return dotProp.set(state, `shipItems`, payload);
}

// AMOUNT AT INVENTORY
export function setAmountFromInventoryReducer(state, payload) {
    const { products } = payload;

    products.allIds.forEach((productId) => {
        if (state.inventory.byId[productId]) {
            products.byId[productId].linkedCount = state.inventory.byId[productId].linkedCount;
        } else {
            products.byId[productId].linkedCount = 0;
        }
    });

    const updatedInventoryWithAllIds = dotProp.set(
        state,
        'inventory.allIds',
        (allIds) => [...allIds, ...products.allIds]
    );

    const updatedInventoryWithById = dotProp.set(
        updatedInventoryWithAllIds,
        'inventory.byId',
        (byId) => Object.assign({}, byId, products.byId)
    );

    return updatedInventoryWithById;
}

export function setDeliveryMethodToAllReducer(state, payload) {

    // Relations
    let stateWithResetedProperties = state.shipItems.items.allHashes
        .reduce((reduceState, hash) => {

            if (reduceState.shipItems.items.byHash[hash].deliveryMethod !== payload) {
                return resetItemProperties(reduceState, reduceState.shipItems.items.byHash[hash]);
            }

            return reduceState;
        }, state);

    // End Relations

    let items = angular.copy(stateWithResetedProperties.shipItems.items);

    items.allHashes.forEach((hash) => {
        if (items.byHash[hash].deliveryMethod !== payload) {
            items.byHash[hash].deliveryMethod = payload;
        }
    });

    const withUpdatedMethods = dotProp.set(
        stateWithResetedProperties,
        'shipItems.items',
        items
    );

    return angular.copy(withUpdatedMethods);
}

export function addLinkedItemsIdsToShipItemReducer(state, payload) {
    const { shipItemHash } = payload;
    const { itemIds } = payload;

    return dotProp.set(
        state,
        `shipItems.items.byHash.${ shipItemHash }`,
        (shipItem) => {
            let newHashes = itemIds.map((itemId) => `${ shipItemHash }_${ itemId }`);

            if (shipItem.linkedItemsHashes) {
                newHashes = newHashes.concat(shipItem.linkedItemsHashes)
                    .reduce((acc, hash) => {
                        if (acc.indexOf(hash) === -1) {
                            acc.push(hash);
                        }
                        return acc;
                    }, []);
            }

            return Object.assign({}, shipItem, { linkedItemsHashes: newHashes });
        }
    );
}

export function updateShipItemCountWithLinkedItemsReducer(state, payload) {
    const shipItemHash = payload;
    const linkedItemsCount = state.shipItems.items.byHash[shipItemHash].linkedItemsHashes
        .reduce((acc, hash) => {
            return acc + state.linkedItems.items.byHash[hash].count;
        }, 0);

    return dotProp.set(
        state,
        `shipItems.items.byHash.${ shipItemHash }`,
        (shipItem) => {
            return Object.assign({}, shipItem, { count: (linkedItemsCount > 0 ? linkedItemsCount : shipItem.countInOrder) });
        }
    );
}

export function updateShipItemReducer(state, payload) {
    const { hash } = payload;
    const { data } = payload;

    return dotProp.set(
        state,
        `shipItems.items.byHash.${ hash }`,
        (shipItem) => Object.assign({}, shipItem, data)
    );
}

export function updateShipComponentReducer(state, payload) {
    const { hash } = payload;
    const { data } = payload;

    return dotProp.set(
        state,
        `shipItems.components.byHash.${ hash }`,
        (component) => Object.assign({}, component, data)
    );
}
