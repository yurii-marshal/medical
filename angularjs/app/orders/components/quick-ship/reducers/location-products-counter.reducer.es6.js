import * as dotProp from 'dot-prop-immutable';

export function updateOrCreateLocationProductsCounterReducer(state, payload) {

    const withAddOrUpdatedCounters = payload.allIds.reduce((state, itemId) => {

        if (state.locationProductsCounter.byId[itemId]) {
            return dotProp.set(
                state,
                `locationProductsCounter.byId.${ itemId }`,
                (counterItemObj) => {
                    const tempCount = payload.byId[itemId].count;

                    return Object.assign({}, counterItemObj, { tempCount } );
                }
            );
        }

        const withAddedIds = dotProp.set(
            state,
            `locationProductsCounter.allIds`,
            (allIds) => [...new Set([...allIds, itemId])]
        );

        const withAddedItemById = dotProp.set(
            withAddedIds,
            `locationProductsCounter.byId.${ itemId }`,
            { selectedCount: 0, tempCount: payload.byId[itemId].count }
        );

        return withAddedItemById;
    }, state);

    return withAddOrUpdatedCounters;
}

export function resetTempCountReducer(state, payload) {
    const { hash } = payload;

    return dotProp.set(
        state,
        `locationProductsCounter.byId.${ hash }`,
        (itemObj) => Object.assign({}, itemObj, { tempCount: 0 })
    );
}

export function subtractSelectedCountReducer(state, payload) {
    const { id } = payload;
    const { count } = payload;

    return dotProp.set(
        state,
        `locationProductsCounter.byId.${ id }`,
        (itemObj) => {
            const newCount = itemObj.selectedCount - count;

            return Object.assign({}, itemObj, { selectedCount: newCount });
        }
    );
}

export function shiftFromTempToSelectedCountReducer(state) {
    return state.locationProductsCounter.allIds.reduce((state, id) => {
        return dotProp.set(
            state,
            `locationProductsCounter.byId.${ id }`,
            (itemObj) => {
                const count = (itemObj.tempCount || 0) + (itemObj.selectedCount || 0);

                return Object.assign({}, itemObj, { tempCount: null, selectedCount: count });
            }
        );
    }, state);
}

export function resetAllTempCountsReducer(state) {
    return state.locationProductsCounter.allIds.reduce((state, id) => {
        return dotProp.set(
            state,
            `locationProductsCounter.byId.${ id }`,
            (itemObj) => {
                return Object.assign({}, itemObj, { tempCount: null });
            }
        );
    }, state);
}

export function prefillSelectedQtyByLocationReducer(state, payload) {

    const clearedState = clearPrefillSelectedQtyReducer(state);

    const stateWithUpdatedTmpCount = dotProp.set(
        clearedState,
        `locationProductsCounter.byId.${ payload.itemId }`,
        (itemObj) => {
            return Object.assign({}, itemObj, {
                prefilledCount: payload.count,
                selectedCount: itemObj.selectedCount || 0
            });
        }
    );

    const stateWithUpdatedAllIds = dotProp.set(
        stateWithUpdatedTmpCount,
        `locationProductsCounter.allIds`,
        (allIds) => [...new Set([...allIds, payload.itemId])]
    );

    return stateWithUpdatedAllIds;
}

export function clearPrefillSelectedQtyReducer(state) {
    return state.locationProductsCounter.allIds.reduce((state, id) => {
        return dotProp.set(
            state,
            `locationProductsCounter.byId.${ id }`,
            (itemObj) => Object.assign({}, itemObj, { prefilledCount: null })
        );
    }, state);
}
