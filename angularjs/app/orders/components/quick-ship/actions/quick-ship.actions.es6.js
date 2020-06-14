import { QUICKSHIP } from './quick-ship.constants.es6.js';

/* WORK WITH ADDITIONAL INFO FOR QUICK SHIP PROCESS */
const resetOrderShortInfo = () => ({
    type: QUICKSHIP.RESET_ORDER_SHORT_INFO
});

const setOrderShortInfo = (orderShortInfo) => ({
    type: QUICKSHIP.SET_ORDER_SHORT_INFO,
    payload: orderShortInfo
});

const resetPatientInfo = () => ({
    type: QUICKSHIP.RESET_PATIENT_INFO
});

const setPatientInfo = (patientInfo) => ({
    type: QUICKSHIP.SET_PATIENT_INFO,
    payload: patientInfo
});

/* WORK WITH ITEMS IN QUICK SHIP PROCESS */
const resetShipItems = () => ({
    type: QUICKSHIP.RESET_SHIP_ITEMS
});

const setShipItems = (items) => ({
    type: QUICKSHIP.SET_SHIP_ITEMS,
    payload: items
});

const attachComponents = (items) => ({
    type: QUICKSHIP.ATTACH_COMPONENTS,
    payload: items
});

const setAmountFromInventory = (items) => ({
    type: QUICKSHIP.SET_AMOUNT_FROM_INVENTORY,
    payload: items
});

const setDeliveryMethodToAll = (methodId) => ({
    type: QUICKSHIP.SET_DELIVERY_METHOD_TO_ALL,
    payload: methodId
});

const divideNotMultiple = (items) => ({
    type: QUICKSHIP.DIVIDE_NOT_MULTIPLE,
    payload: items
});

const deleteShipItem = (item) => ({
    type: QUICKSHIP.DELETE_SHIP_ITEM,
    payload: item
});

const updateShipItem = (item) => ({
    type: QUICKSHIP.UPDATE_SHIP_ITEM,
    payload: item
});

const updateShipComponent = (component) => ({
    type: QUICKSHIP.UPDATE_SHIP_COMPONENT,
    payload: component
});

const addQuickShipItems = (items) => ({
    type: QUICKSHIP.ADD_QUICKSHIP_ITEMS,
    payload: items
});

const resetItemProperties = (item) => ({
    type: QUICKSHIP.RESET_ITEM_PROPERTIES,
    payload: item
});

const resetQuickShipState = () => ({
    type: QUICKSHIP.RESET_QUICKSHIP_STATE
});

/* PICK FROM INVENTORY */
const setCurrentProduct = (product) => ({
    type: QUICKSHIP.SET_CURRENT_PRODUCT,
    payload: product
});

const setCurrentComponents = (components) => ({
    type: QUICKSHIP.SET_CURRENT_COMPONENTS,
    payload: components
});

const resetCurrentProduct = () => ({
    type: QUICKSHIP.RESET_CURRENT_PRODUCT
});

const clearProcessingItem = () => ({
    type: QUICKSHIP.CLEAR_PROCESSIGN_ITEM
});

const updateProcessingItem = (product) => ({
    type: QUICKSHIP.UPDATE_PROCESSIGN_ITEM,
    payload: product
});
const fulfillProcessingItem = (items) => ({
    type: QUICKSHIP.FULFILL_PROCESSIGN_ITEM,
    payload: items
});

const setLocationFrom = (location) => ({
    type: QUICKSHIP.SET_LOCATION_FROM,
    payload: location
});

const resetLocationFrom = () => ({
    type: QUICKSHIP.RESET_LOCATION_FROM
});

const setAnyLocationFrom = (location) => ({
    type: QUICKSHIP.SET_ANY_LOCATION_FROM,
    payload: location
});

const setLookupProperty = (property) => ({
    type: QUICKSHIP.SET_LOOKUP_PROPERTY,
    payload: property
});

const setNextKeyProperty = (property) => ({
    type: QUICKSHIP.SET_NEXT_KEY_PROPERTY,
    payload: property
});

const setStatusProperty = (property) => ({
    type: QUICKSHIP.SET_STATUS_PROPERTY,
    payload: property
});

const setBarcodeProperty = (property) => ({
    type: QUICKSHIP.SET_BARCODE_PROPERTY,
    payload: property
});

const determineActiveProperty = (product) => ({
    type: QUICKSHIP.DETERMINE_ACTIVE_PROPERTY,
    payload: product
});

const addPickedItems = (items) => ({
    type: QUICKSHIP.ADD_PICKED_ITEMS,
    payload: items
});

const addSeparatedPickedItem = (items) => ({
    type: QUICKSHIP.ADD_SEPARATED_PICKED_ITEM,
    payload: items
});

const resetPickedItems = () => ({
    type: QUICKSHIP.RESET_PICKED_ITEMS
});

const deletePickedItem = (item) => ({
    type: QUICKSHIP.DELETE_PICKED_ITEM,
    payload: item
});

const addLinkedItems = (payload) => ({
    type: QUICKSHIP.ADD_LINKED_ITEMS,
    payload: payload
});

const updateLinkedItem = (payload) => ({
    type: QUICKSHIP.UPDATE_LINKED_ITEM,
    payload: payload
});

const removeLinkedItem = (payload) => ({
    type: QUICKSHIP.REMOVE_LINKED_ITEM,
    payload: payload
});

const updateOrCreateLocationProductsCounter = (payload) => ({
    type: QUICKSHIP.UPDATE_OR_CREATE_LOCATION_PRODUCTS_COUNTER,
    payload: payload
});

const setPrefillSelectedQtyByLocation = (payload) => ({
    type: QUICKSHIP.PREFILL_SELECTED_QTY_BY_LOCATION,
    payload: payload
});

const clearPrefillSelectedQty = (payload) => ({
    type: QUICKSHIP.CLEAR_PREFILL_SELECTED_QTY,
    payload: payload
});

const resetTempCountLocationProductsCounter = (payload) => ({
    type: QUICKSHIP.RESET_TEMP_COUNT_LOCATION_PRODUCTS_COUNTER,
    payload: payload
});

const subtractSelectedCountLocationProductsCounter = (payload) => ({
    type: QUICKSHIP.RESET_SELECTED_COUNT_LOCATION_PRODUCTS_COUNTER,
    payload: payload
});

const shiftFromTempToSelectedCount = () => ({
    type: QUICKSHIP.SHIFT_FROM_TEMP_TO_SELECTED_COUNT,
    payload: null
});

const resetAllTempCounts = () => ({
    type: QUICKSHIP.RESET_ALL_TEMP_COUNTS,
    payload: null
});

export default {
    resetOrderShortInfo,
    setOrderShortInfo,

    resetPatientInfo,
    setPatientInfo,

    resetShipItems,
    setShipItems,
    attachComponents,
    setAmountFromInventory,
    setDeliveryMethodToAll,
    divideNotMultiple,
    deleteShipItem,
    updateShipItem,
    updateShipComponent,
    addQuickShipItems,

    resetItemProperties,

    resetQuickShipState,

    /* QUICKSHIP_TRANSFER */
    setCurrentProduct,
    setCurrentComponents,
    resetCurrentProduct,
    clearProcessingItem,
    updateProcessingItem,
    fulfillProcessingItem,

    setLocationFrom,
    resetLocationFrom,
    setAnyLocationFrom,
    setLookupProperty,
    setNextKeyProperty,
    setStatusProperty,
    setBarcodeProperty,
    determineActiveProperty,

    addPickedItems,
    addSeparatedPickedItem,
    resetPickedItems,
    deletePickedItem,
    addLinkedItems,
    updateLinkedItem,
    removeLinkedItem,

    updateOrCreateLocationProductsCounter,
    setPrefillSelectedQtyByLocation,
    clearPrefillSelectedQty,
    resetTempCountLocationProductsCounter,
    shiftFromTempToSelectedCount,
    resetAllTempCounts,
    subtractSelectedCountLocationProductsCounter
};

