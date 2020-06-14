import { DICTIONARIES } from './quick-ship.constants.es6';

const setDeliveryMethodDictionaries = (payload) => ({
    type: DICTIONARIES.SET_DELIVERY_METHOD_DICTIONARIES,
    payload: payload
});

const setDeliveryCompaniesDictionary = (payload) => ({
    type: DICTIONARIES.SET_DELIVERY_COMPANIES_DICTIONARY,
    payload: payload
});

export default {
    setDeliveryMethodDictionaries,
    setDeliveryCompaniesDictionary
};

