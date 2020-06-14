import * as dotProp from 'dot-prop-immutable';

export function attachComponentsReducer(state, payload) {
    const shipItems = angular.copy(state.shipItems);

    payload.forEach((item) => {
        item.components.allHashes.forEach((componentHash) => {
            const parentProductHash = item.components.byHash[componentHash].parentHash;

            shipItems.items.byHash[parentProductHash].componentsHashes.push(componentHash);

            if (
                item.components.byHash[componentHash].isSerialized ||
                item.components.byHash[componentHash].isLotted
            ) {
                shipItems.items.byHash[parentProductHash].isMultiple = false;
            }

            shipItems.components.allHashes.push(componentHash);
            shipItems.components.byHash[componentHash] = _.assign({}, item.components.byHash[componentHash]);
        });
    });

    return dotProp.set(state, 'shipItems', shipItems);
}
