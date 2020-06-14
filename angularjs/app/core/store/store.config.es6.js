// TODO  THINK IF WE NEED Middleware
"use strict";
//import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index.es6';

export default $ngReduxProvider => {
    "ngInject";
    $ngReduxProvider.createStoreWith(rootReducer);
};

