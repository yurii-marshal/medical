// PICKED ITEMS
import * as dotProp from 'dot-prop-immutable';
import { clearProcessingItemReducer } from './current-product.reducers.es6';
import { initialQuickShipState } from './initial-state.helper.es6';

import { updateOrCreateLocationProductsCounterReducer } from './location-products-counter.reducer.es6';

export function addPickedItemsReducer(state, payload) {

    const updatedWithPickedItemsById = dotProp.set(
        state,
        'pickedItems.items.byId',
        (byId) => Object.assign({}, byId, payload.items.byId)
    );

    const updatedWithPickedItemsAllIds = dotProp.set(
        updatedWithPickedItemsById,
        'pickedItems.items.allIds',
        (allIds) => [...new Set(allIds.concat(payload.items.allIds))]
    );

    const updatedWithPickedComponentsById = dotProp.set(
        updatedWithPickedItemsAllIds,
        'pickedItems.components.byId',
        (byId) => Object.assign({}, byId, payload.components.byId)
    );

    const updatedWithPickedComponentsAllIds = dotProp.set(
        updatedWithPickedComponentsById,
        'pickedItems.components.allIds',
        (allIds) => [...new Set(allIds.concat(payload.components.allIds))]
    );

    // Relationships
    const updatedCounters = updateOrCreateLocationProductsCounterReducer(updatedWithPickedComponentsAllIds, payload.items);

    const addedPickedItems = clearProcessingItemReducer(updatedCounters);

    return addedPickedItems;
}

export function addSeparatedPickedItemReducer(state, payload) {

    const payloadCopy = angular.copy(payload);

    payloadCopy.items.byId[payloadCopy.items.allIds[0]].count = 1;

    return addPickedItemsReducer(state, payloadCopy);
}

export function resetPickedItemsReducer(state) {
    return dotProp.set(state, 'pickedItems', initialQuickShipState().pickedItems);
}

export function deletePickedItemReducer(state, payload) {
    const pickedItems = angular.copy(state.pickedItems);

    let currentItem = pickedItems.items.byId[payload.id];

    if (currentItem.isBundle) {
        currentItem.componentsIds.forEach((cId) => {
            delete pickedItems.components.byId[cId];
        });
        pickedItems.components.allIds = pickedItems.components.allIds.filter((id) => {
            return currentItem.componentsIds.indexOf(id) === -1;
        });
    }

    pickedItems.items.allIds = pickedItems.items.allIds.filter((id) => {
        return id !== currentItem.id;
    });

    delete pickedItems.items.byId[payload.id];

    return dotProp.set(state, 'pickedItems', pickedItems);
}
