import * as dotProp from 'dot-prop-immutable';
import { initialQuickShipState } from './initial-state.helper.es6';

export function divideNotMultipleComponentsReducer(state, payload) {
    const shipItems = {
        items: angular.copy(state.shipItems.items),
        components: angular.copy(initialQuickShipState().shipItems.components)
    };

    shipItems.items.allHashes.forEach((hash) => {
        if (shipItems.items.byHash[hash].isBundle) {
            shipItems.items.byHash[hash].componentsHashes = [];
        }
    });

    payload.components.allHashes.forEach((cHash) => {
        if (
            payload.components.byHash[cHash].isMultiple ||
            payload.components.byHash[cHash].count === 1
        ) {

            shipItems.components.byHash[cHash] = _.assign({}, payload.components.byHash[cHash]);
            shipItems.components.allHashes.push(cHash);

            const parentHash = shipItems.components.byHash[cHash].parentHash;

            shipItems.items.byHash[parentHash].componentsHashes.push(cHash);

        } else {

            for (let i=0;i<payload.components.byHash[cHash].count;i++) {
                let componentCopy = _.assign({}, payload.components.byHash[cHash]);
                const componentHash = `${cHash}_${guid()}`;

                componentCopy.count = 1;
                componentCopy.hash = componentHash;

                shipItems.components.byHash[componentHash] = _.assign({}, componentCopy);
                shipItems.components.allHashes.push(componentHash);

                shipItems.items.byHash[componentCopy.parentHash].componentsHashes.push(componentHash);

            }

        }
    });

    return dotProp.set( state, 'shipItems', shipItems);
}
