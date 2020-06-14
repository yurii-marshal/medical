import * as dotProp from 'dot-prop-immutable';
import { divideNotMultipleComponentsReducer } from './divide-not-multiple-components.reducer.es6';

export function addQuickShipItems(state, payload) {

    const shipItems = angular.copy(state.shipItems);

    shipItems.items.byHash = _.assign({}, shipItems.items.byHash, payload.items.byHash);
    shipItems.items.allHashes = Object.keys(shipItems.items.byHash);

    shipItems.components.byHash = _.assign({}, shipItems.components.byHash, payload.components.byHash);
    shipItems.components.allHashes = Object.keys(shipItems.components.byHash);

    return divideNotMultipleComponentsReducer(dotProp.set(state, 'shipItems', shipItems), shipItems);
}
