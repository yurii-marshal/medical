import {
    StatesDictionaryType,
    StatesDictionaryState,
} from './setting-dictionaries.interface';

export function normalizeStatesDictionaries(dictionaries: any): StatesDictionaryState {
    const statesDictionaryState: StatesDictionaryState = {
        byId: {},
        allIds: [],
    };

    dictionaries.forEach((statesDictionary) => {
        const normalStatesDictionary: StatesDictionaryType = {
            id: statesDictionary.Id,
            text: statesDictionary.Text,
        };
        statesDictionaryState.byId[statesDictionary.Id] = normalStatesDictionary;
    });

    statesDictionaryState.allIds = Object.keys(statesDictionaryState.byId);
    return statesDictionaryState;
}
