import { INVENTORY_RECEIVE } from './inventory.constants.es6';

const resetPairList = () => ({
    type: INVENTORY_RECEIVE.RESET_PAIR_LIST
});
const setPairList = (model) => ({
    type: INVENTORY_RECEIVE.SET_PAIR_LIST,
    payload: model
});

const resetPairCurrent = () => ({
    type: INVENTORY_RECEIVE.RESET_PAIR_CURRENT
});
const setPairCurrent = (model) => ({
    type: INVENTORY_RECEIVE.SET_PAIR_CURRENT,
    payload: model
});

const resetPurchaseOrder = () => ({
    type: INVENTORY_RECEIVE.RESET_PURCHASE_ORDER
});


export default {
    resetPairList,
    setPairList,

    resetPairCurrent,
    setPairCurrent,
    resetPurchaseOrder
};
