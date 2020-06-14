import {
    ZipDictionaryState,
    ZipDictionaryType,
} from './zip-codes.interface';

export function normalizeZipDictionaries(dictionaries: any): ZipDictionaryState {
    const zipDictionaryState: ZipDictionaryState = {
        count: dictionaries.Count,
        byId: {},
        allIds: [],
    };

    dictionaries.Items.forEach((zipDictionary) => {
        const normalZipDictionary: ZipDictionaryType = {
            description: zipDictionary.description,
            id: zipDictionary.id,
            text: zipDictionary.text,
        };

        zipDictionaryState.byId[zipDictionary.id] = normalZipDictionary;
    });

    zipDictionaryState.allIds = Object.keys(zipDictionaryState.byId);
    return zipDictionaryState;
}
