import * as dotProp from 'dot-prop-immutable';

export function updateInvLinkedCountByPickedItemsReducer(state, payload) {
    const { pickedItems } = payload;

    pickedItems.items.allIds.reduce((state, id) => {
        const pickedItem = pickedItems.items.byId[id];

        return dotProp.set(
            state,
            `inventory.byId.${ pickedItem.productId }`,
            (inventoryItem) => {
                inventoryItem.linkedCount += pickedItem.count;
                return inventoryItem;
            }
        );
    }, state);

    return state;
}

export function decreaseCountInventoryReducer(state, payload) {
    const { productId } = payload;
    const { count } = payload;

    return dotProp.set(
        state,
        `inventory.byId.${ productId }`,
        (inventoryItem) => Object.assign({}, inventoryItem, { linkedCount: inventoryItem.linkedCount -= count })
    );
}
