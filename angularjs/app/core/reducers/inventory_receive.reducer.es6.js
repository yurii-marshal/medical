import { INVENTORY_RECEIVE } from '../actions/inventory.constants.es6';

function initialInventoryReceiveState() {
    return {
        pairList: [],
        pairCurrent: {
            location: {
                Id: '',
                Description: '',
                Name: ''
            },
            product: {
                Id: '',
                Name: ''
            },
            purchaseOrder: {
                Id: null,
                DisplayId: null,
                Vendor: null,
                CreatedBy: null,
                CreatedOn: null,
                TotalPrice: null,
                Status: null,
                Items: []
            }
        }
    };
}

export function inventoryReceiveReducer(state = initialInventoryReceiveState(), action) {
    switch (action.type) {

        case INVENTORY_RECEIVE.RESET_PAIR_LIST:
            return _.assign({}, state, { pairList: [] });
        case INVENTORY_RECEIVE.SET_PAIR_LIST:
            return _.assign({}, state, { pairList: action.payload });

        case INVENTORY_RECEIVE.RESET_PAIR_CURRENT:
            return _.assign({}, state, { pairCurrent: initialInventoryReceiveState().pairCurrent });
        case INVENTORY_RECEIVE.SET_PAIR_CURRENT:
            return setPairCurrentReducer(state, action.payload);
        case INVENTORY_RECEIVE.RESET_PURCHASE_ORDER:
            return resetPurchaseOrderReducer(state);

        default:
            return state;
    }
}

export function resetPurchaseOrderReducer(state) {
    const newState = _.assign({}, state),
        emptyPO = initialInventoryReceiveState().pairCurrent.purchaseOrder;

    newState.pairCurrent = _.assign({}, newState.pairCurrent, { purchaseOrder: emptyPO });

    return newState;
}

export function setPairCurrentReducer(state, payload) {
    return _.assign({}, state, { pairCurrent: payload });
}
