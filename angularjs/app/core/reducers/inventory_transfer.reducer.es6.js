import { INVENTORY_TRANSFER } from '../actions/inventory.constants.es6';

function initialInventoryTransferState() {
    return {
        pairList: [],
        pairCurrent: {
            locationFrom: {
                Id: '',
                UniqueId: '',
                Description: '',
                Name: ''
            },
            locationTo: {
                Id: '',
                Description: '',
                Name: ''
            },
            product: {
                Id: '',
                Name: ''
            },
            SearchKeys: [],
            Status: undefined
        }
    }
}

export function inventoryTransferReducer(state = initialInventoryTransferState(), action) {
    switch (action.type) {

        case INVENTORY_TRANSFER.RESET_PAIR_LIST:
            return _.assign({}, state, { pairList: [] });
        case INVENTORY_TRANSFER.SET_PAIR_LIST:
            return _.assign({}, state, { pairList: action.payload });

        case INVENTORY_TRANSFER.RESET_PAIR_CURRENT:
            return _.assign({}, state, { pairCurrent: initialInventoryTransferState().pairCurrent });
        case INVENTORY_TRANSFER.SET_PAIR_CURRENT:
            return _.assign({}, state, { pairCurrent: action.payload });

        default:
            return state;
    }
}

