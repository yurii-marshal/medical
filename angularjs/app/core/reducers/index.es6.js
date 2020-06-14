import { combineReducers } from 'redux';
import { quickShipReducer } from '../../orders/components/quick-ship/reducers/quick-ship.reducer.es6.js';
import { inventoryTransferReducer } from './inventory_transfer.reducer.es6';
import { inventoryReceiveReducer } from './inventory_receive.reducer.es6';
import { dictionariesReducer } from '../../orders/components/quick-ship/reducers/dictionaries.reducer.es6.js';

const rootReducer = combineReducers({
    dictionaries: dictionariesReducer,
    quickShip: quickShipReducer,
    inventoryTransfer: inventoryTransferReducer,
    inventoryReceive: inventoryReceiveReducer
});

export default rootReducer;
