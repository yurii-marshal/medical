import { INVENTORY_TRANSFER } from './inventory.constants.es6';

const resetPairList = () => ({
    type: INVENTORY_TRANSFER.RESET_PAIR_LIST
});
const setPairList = (model) => ({
    type: INVENTORY_TRANSFER.SET_PAIR_LIST,
    payload: model
});

const resetPairCurrent = () => ({
    type: INVENTORY_TRANSFER.RESET_PAIR_CURRENT
});
const setPairCurrent = (model) => ({
    type: INVENTORY_TRANSFER.SET_PAIR_CURRENT,
    payload: model
});

export default {
    resetPairList,
    setPairList,

    resetPairCurrent,
    setPairCurrent
}
