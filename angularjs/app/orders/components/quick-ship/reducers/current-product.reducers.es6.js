import * as dotProp from 'dot-prop-immutable';
import { initialQuickShipState } from './initial-state.helper.es6.js';
import { lookupProperties } from '../quick-ship.config.es6';

// CURRENT PRODUCT MODEL
export function setCurrentProductReducer(state, payload) {
    const currentProduct = angular.copy(state.currentProduct);
    const inventory = angular.copy(state.inventory);

    currentProduct.locationTo = {
        id: state.patientInfo.id,
        displayName: `${state.patientInfo.fullName}(${state.patientInfo.dateOfBirth})`
    };
    currentProduct.productId = payload.productId;
    currentProduct.hash = payload.hash;
    currentProduct.storeIds = inventory.byId[payload.productId].storeIds;

    currentProduct.product = payload;

    return dotProp.set(state, 'currentProduct', currentProduct);
}

export function setCurrentComponentsReducer(state, payload) {
    const components = angular.copy(state.currentProduct.components);

    components.allIds = payload.allHashes.reduce((acc, hash) => {
        acc.push(payload.byHash[hash].productId);
        return acc;
    }, []);

    components.byId = payload.allHashes.reduce((acc, hash) => {
        acc[payload.byHash[hash].productId] = payload.byHash[hash];
        return acc;
    }, {});

    return dotProp.set(state, 'currentProduct.components', components);
}

export function resetCurrentProductReducer(state) {
    return dotProp.set(state, 'currentProduct', initialQuickShipState().currentProduct);
}

// PROCESSING ITEM
export function clearProcessingItemReducer(state) {
    const currentProduct = angular.copy(state.currentProduct);

    currentProduct.locationFrom = initialQuickShipState().currentProduct.locationFrom;
    currentProduct.isAnyLocationFrom = false;

    currentProduct.product.barcode = null;
    currentProduct.product = {};
    currentProduct.components = initialQuickShipState().currentProduct.components;

    currentProduct.nextKey = null;
    currentProduct.status = null;
    currentProduct.lookupProperty = lookupProperties.LOCATION.id;

    return dotProp.set(state, 'currentProduct', currentProduct);
}

export function updateProcessingItemReducer(state, payload) {
    const currentProduct = angular.copy(state.currentProduct);
    const activeProperty = currentProduct.product.activeProperty;
    const activeProductId = payload.nextKey ? payload.nextKey.productId : null;

    // update flag device number
    currentProduct.product = Object.assign({}, payload.product);

    if (payload.components.allIds.length) {
        currentProduct.components = Object.assign({}, payload.components);
    }

    if (activeProperty) {
        if (!payload.components.allIds.length) {
            const activeProperty = currentProduct.product.activeProperty;

            currentProduct.product[activeProperty] = currentProduct.barcode;
        } else {
            if (currentProduct.components.byId[activeProductId]) {
                currentProduct.components.byId[activeProductId][activeProperty] = currentProduct.barcode;
            }
        }
    }

    return dotProp.set(state, 'currentProduct', currentProduct);
}

export function fulfillProcessingItemReducer(state, payload) {

    const updatedCurrentItem = dotProp.set(
        state,
        'currentProduct.product',
        payload.items.byId[payload.items.allIds[0]]
    );

    let updatedCurrentItemComponents = updatedCurrentItem;

    if (!payload.components.allIds.length) {
        updatedCurrentItemComponents = dotProp.set(
            updatedCurrentItem,
            'currentProduct.components',
            payload.components
        );
    }

    return updatedCurrentItemComponents;
}

// LOCATION
export function setLocationFromReducer(state, payload) {
    const currentProduct = angular.copy(state.currentProduct);

    currentProduct.locationFrom = payload;
    currentProduct.isAnyLocationFrom = false;

    return dotProp.set(state, 'currentProduct', currentProduct);
}

export function resetLocationFromReducer(state) {
    const currentProduct = angular.copy(state.currentProduct);

    currentProduct.locationFrom = initialQuickShipState().currentProduct.locationFrom;
    currentProduct.isAnyLocationFrom = false;

    return dotProp.set(state, 'currentProduct', currentProduct);
}

export function setAnyLocationFromReducer(state, payload) {
    const currentProduct = angular.copy(state.currentProduct);

    currentProduct.isAnyLocationFrom = payload;
    currentProduct.locationFrom = initialQuickShipState().currentProduct.locationFrom;

    return dotProp.set(state, 'currentProduct', currentProduct);
}

// LOOKUP
export function setLookupPropertyReducer(state, payload) {
    const currentProduct = angular.copy(state.currentProduct);

    // payload can be nextKey object OR primitive value
    if (payload && payload.keyType) {
        for (let prop in lookupProperties) {
            if (lookupProperties[prop].key === payload.keyType.code) {
                currentProduct.lookupProperty = lookupProperties[prop].id;
            }
        }
    } else {
        currentProduct.lookupProperty = payload;
    }

    return dotProp.set(state, 'currentProduct', currentProduct);
}

// NEXT KEY
export function setNextKeyReducer(state, payload) {
    return dotProp.set(state, 'currentProduct.nextKey', payload);
}

// STATUS
export function setStatusReducer(state, payload) {
    return dotProp.set(state, 'currentProduct.status', payload);
}

// BARCODE
export function setBarcodeReducer(state, payload) {
    return dotProp.set(state, 'currentProduct.barcode', payload);
}

// DETERMINE_ACTIVE_PROPERTY
export function determineActivePropertyReducer(state, payload) {
    const currentProduct = angular.copy(state.currentProduct);
    const { lookupProperty } = payload;

    if (!currentProduct.components.allIds.length) {
        return dotProp.set(state, 'currentProduct.product.activeProperty', lookupProperty);
    }

    let activeComponentId = null;

    if (lookupProperty === lookupProperties.SERIAL_NUMBER.id) {
        activeComponentId = currentProduct.components.allIds.find((id) => {
            return currentProduct.components.byId[id].isSerialized &&
                !currentProduct.components.byId[id].serialNumber;
        });
    }

    if (lookupProperty === lookupProperties.LOT_NUMBER.id) {
        activeComponentId = currentProduct.components.allIds.find((id) => {
            return currentProduct.components.byId[id].isLotted &&
                !currentProduct.components.byId[id].lotNumber;
        });
    }

    const removedActiveFlagState = dotProp.set(
        state,
        'currentProduct.components.byId',
        () => currentProduct.components.allIds.reduce((acc, id) => {
            acc[id].isActive = false;
            acc[id].activeProperty = null;

            return acc;
        }, currentProduct.components.byId)
    );

    return dotProp.set(
        removedActiveFlagState,
        `currentProduct.components.byId.${activeComponentId}`,
        (component) => Object.assign({}, component, { isActive: true, activeProperty: lookupProperty })
    );
}

