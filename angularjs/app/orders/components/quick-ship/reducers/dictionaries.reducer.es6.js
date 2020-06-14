import { DICTIONARIES } from '../actions/quick-ship.constants.es6';

function initialDictionariesState() {
    return {
        deliveryMethodDictionaries: [],
        deliveryCompaniesDictionary: []
    };
}

export function dictionariesReducer(state = initialDictionariesState(), action) {
    switch (action.type) {

        case DICTIONARIES.SET_DELIVERY_METHOD_DICTIONARIES:
            return _.assign({}, state, { deliveryMethodDictionaries: action.payload });
        case DICTIONARIES.SET_DELIVERY_COMPANIES_DICTIONARY:
            return _.assign({}, state, { deliveryCompaniesDictionary: action.payload });

        default:
            return state;
    }
}

