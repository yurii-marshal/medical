import * as dotProp from 'dot-prop-immutable';
import { initialQuickShipState } from './initial-state.helper.es6';
import { divideNotMultipleComponentsReducer } from './divide-not-multiple-components.reducer.es6';

export function divideNotMultipleReducer(state, payload) {

    const expandedItems = angular.copy(initialQuickShipState().shipItems);

    payload.items.allHashes.forEach((hash) => {
        let item = payload.items.byHash[hash];

        if ( item.isMultiple || (item.count === 1) ) {

            expandedItems.items.byHash[hash] = _.assign({}, item);
            expandedItems.items.allHashes.push(hash);

            if (item.isBundle) {
                item.componentsHashes.forEach((cHash) => {
                    expandedItems.components.allHashes.push(cHash);
                    expandedItems.components.byHash[cHash] = _.assign({}, payload.components.byHash[cHash]);
                    expandedItems.components.byHash[cHash].parentHash = hash;
                });
            }

        } else {
            for (let i=0;i<item.count;i++) {

                let itemCopy = _.assign({}, item);
                const itemHash = `${hash}_${guid()}`;

                itemCopy.count = 1;
                itemCopy.countInOrder = 1;
                itemCopy.hash = itemHash;

                expandedItems.items.byHash[itemHash] = itemCopy;
                expandedItems.items.allHashes.push(itemHash);

                if (item.isBundle) {
                    itemCopy.componentsHashes = [];

                    item.componentsHashes.forEach((cHash) => {

                        const componentHash = `${cHash}_${guid()}`;

                        expandedItems.components.allHashes.push(componentHash);
                        expandedItems.components.byHash[componentHash] = _.assign({}, payload.components.byHash[cHash]);
                        expandedItems.components.byHash[componentHash].parentHash = itemHash;

                        itemCopy.componentsHashes.push(componentHash);
                    });
                }
            }
        }
    });

    const updatedWithNotMultiple = dotProp.set(
        state,
        'shipItems',
        expandedItems
    );

    return divideNotMultipleComponentsReducer(updatedWithNotMultiple, expandedItems);
}

