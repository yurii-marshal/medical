import * as dotProp from 'dot-prop-immutable';
import { QUICKSHIP } from '../actions/quick-ship.constants.es6.js';
import { initialQuickShipState } from './initial-state.helper.es6.js';

import { attachComponentsReducer } from './attach-components.reducer.es6.js';
import {
    setShipItemsReducer,
    setAmountFromInventoryReducer,
    setDeliveryMethodToAllReducer,
    updateShipItemReducer,
    updateShipComponentReducer
} from './ship-items.reducers.es6';

import { divideNotMultipleReducer } from './divide-not-multiple.reducer.es6';
import { addQuickShipItems } from './add-quick-ship-items.reducer.es6';
import { deleteShipItemReducer } from './delete-ship-item.reducer.es6';
import { resetItemProperties } from './reset-item-properties.reducer.es6';

import {
    addLinkedItemsReducer,
    updateLinkedItemReducer,
    removeLinkedItemReducer
} from './linked-items.reducer.es6';

import {
    setCurrentProductReducer,
    setCurrentComponentsReducer,
    resetCurrentProductReducer,
    clearProcessingItemReducer,
    updateProcessingItemReducer,
    fulfillProcessingItemReducer,

    setLocationFromReducer,
    resetLocationFromReducer,
    setAnyLocationFromReducer,
    setLookupPropertyReducer,
    setNextKeyReducer,
    setStatusReducer,
    setBarcodeReducer,
    determineActivePropertyReducer

} from './current-product.reducers.es6';

import {
    addPickedItemsReducer,
    resetPickedItemsReducer,
    deletePickedItemReducer,
    addSeparatedPickedItemReducer
} from './picked-items.reducers.es6';

import {
    updateOrCreateLocationProductsCounterReducer,
    resetTempCountReducer,
    shiftFromTempToSelectedCountReducer,
    resetAllTempCountsReducer,
    subtractSelectedCountReducer,
    prefillSelectedQtyByLocationReducer,
    clearPrefillSelectedQtyReducer
} from './location-products-counter.reducer.es6';

export function quickShipReducer(state = initialQuickShipState(), action) {
    switch (action.type) {

        /* WORK WITH ADDITIONAL INFO FOR QUICK SHIP PROCESS */
        case QUICKSHIP.RESET_ORDER_SHORT_INFO:
            return _.assign({}, state, { orderShortInfo: {} });
        case QUICKSHIP.SET_ORDER_SHORT_INFO:
            return _.assign({}, state, { orderShortInfo: action.payload });

        case QUICKSHIP.RESET_PATIENT_INFO:
            return _.assign({}, state, { patientInfo: {} });
        case QUICKSHIP.SET_PATIENT_INFO:
            return _.assign({}, state, { patientInfo: action.payload });

        /* WORK WITH ITEMS IN QUICK SHIP PROCESS */
        case QUICKSHIP.RESET_SHIP_ITEMS:
            return dotProp.set(state, 'shipItems', initialQuickShipState().shipItems);
        case QUICKSHIP.SET_SHIP_ITEMS:
            return setShipItemsReducer(state, action.payload);
        case QUICKSHIP.ATTACH_COMPONENTS:
            return attachComponentsReducer(state, action.payload);
        case QUICKSHIP.SET_AMOUNT_FROM_INVENTORY:
            return setAmountFromInventoryReducer(state, action.payload);
        case QUICKSHIP.SET_DELIVERY_METHOD_TO_ALL:
            return setDeliveryMethodToAllReducer(state, action.payload);
        case QUICKSHIP.DIVIDE_NOT_MULTIPLE:
            return divideNotMultipleReducer(state, action.payload);

        case QUICKSHIP.DELETE_SHIP_ITEM:
            return deleteShipItemReducer(state, action.payload);
        case QUICKSHIP.UPDATE_SHIP_ITEM:
            return updateShipItemReducer(state, action.payload);
        case QUICKSHIP.UPDATE_SHIP_COMPONENT:
            return updateShipComponentReducer(state, action.payload);
        case QUICKSHIP.ADD_QUICKSHIP_ITEMS:
            return addQuickShipItems(state, action.payload);
        case QUICKSHIP.RESET_ITEM_PROPERTIES:
            return resetItemProperties(state, action.payload);

        case QUICKSHIP.SET_CURRENT_PRODUCT:
            return setCurrentProductReducer(state, action.payload);
        case QUICKSHIP.SET_CURRENT_COMPONENTS:
            return setCurrentComponentsReducer(state, action.payload);
        case QUICKSHIP.RESET_CURRENT_PRODUCT:
            return resetCurrentProductReducer(state);
        case QUICKSHIP.CLEAR_PROCESSIGN_ITEM:
            return clearProcessingItemReducer(state);
        case QUICKSHIP.UPDATE_PROCESSIGN_ITEM:
            return updateProcessingItemReducer(state, action.payload);
        case QUICKSHIP.FULFILL_PROCESSIGN_ITEM:
            return fulfillProcessingItemReducer(state, action.payload);

        case QUICKSHIP.SET_LOCATION_FROM:
            return setLocationFromReducer(state, action.payload);
        case QUICKSHIP.RESET_LOCATION_FROM:
            return resetLocationFromReducer(state);
        case QUICKSHIP.SET_ANY_LOCATION_FROM:
            return setAnyLocationFromReducer(state, action.payload);
        case QUICKSHIP.SET_LOOKUP_PROPERTY:
            return setLookupPropertyReducer(state, action.payload);
        case QUICKSHIP.SET_NEXT_KEY_PROPERTY:
            return setNextKeyReducer(state, action.payload);
        case QUICKSHIP.SET_STATUS_PROPERTY:
            return setStatusReducer(state, action.payload);
        case QUICKSHIP.SET_BARCODE_PROPERTY:
            return setBarcodeReducer(state, action.payload);
        case QUICKSHIP.DETERMINE_ACTIVE_PROPERTY:
            return determineActivePropertyReducer(state, action.payload);


        case QUICKSHIP.ADD_PICKED_ITEMS:
            return addPickedItemsReducer(state, action.payload);
        case QUICKSHIP.ADD_SEPARATED_PICKED_ITEM:
            return addSeparatedPickedItemReducer(state, action.payload);
        case QUICKSHIP.RESET_PICKED_ITEMS:
            return resetPickedItemsReducer(state);
        case QUICKSHIP.DELETE_PICKED_ITEM:
            return deletePickedItemReducer(state, action.payload);

        case QUICKSHIP.RESET_QUICKSHIP_STATE:
            return angular.copy(initialQuickShipState());

        /* WORK WITH ADDITIONAL INFO FOR QUICK SHIP PROCESS */
        case QUICKSHIP.ADD_LINKED_ITEMS:
            return addLinkedItemsReducer(state, action.payload);

        case QUICKSHIP.UPDATE_LINKED_ITEM:
            return updateLinkedItemReducer(state, action.payload);

        case QUICKSHIP.REMOVE_LINKED_ITEM:
            return removeLinkedItemReducer(state, action.payload);

        case QUICKSHIP.UPDATE_OR_CREATE_LOCATION_PRODUCTS_COUNTER:
            return updateOrCreateLocationProductsCounterReducer(state, action.payload);

        case QUICKSHIP.PREFILL_SELECTED_QTY_BY_LOCATION:
            return prefillSelectedQtyByLocationReducer(state, action.payload);

        case QUICKSHIP.CLEAR_PREFILL_SELECTED_QTY:
            return clearPrefillSelectedQtyReducer(state);

        case QUICKSHIP.RESET_TEMP_COUNT_LOCATION_PRODUCTS_COUNTER:
            return resetTempCountReducer(state, action.payload);

        case QUICKSHIP.RESET_SELECTED_COUNT_LOCATION_PRODUCTS_COUNTER:
            return subtractSelectedCountReducer(state, action.payload);

        case QUICKSHIP.SHIFT_FROM_TEMP_TO_SELECTED_COUNT:
            return shiftFromTempToSelectedCountReducer(state);

        case QUICKSHIP.RESET_ALL_TEMP_COUNTS:
            return resetAllTempCountsReducer(state);

        default:
            return state;
    }
}
