export enum OptionsTypes {
    patient = 'patient',
    user = 'user',
    action = 'action',
}

export interface AutocompleteOptions {
    patient: boolean;
    user: boolean;
    action: boolean;
}

export interface SearchBoxParams {
    searchBoxElement: any;
    searchBoxSelectionStart: number;
    searchBoxText: string;
}

export class SearchBoxParamsMock implements SearchBoxParams {
    searchBoxElement = null;
    searchBoxSelectionStart = 0;
    searchBoxText = '';
}

export interface Action {
    name: string;
    params: string;
    description: string;
}

export const AutocompleteActionsList = [
    {
        name: 'task',
        params: '[what] [@someone] [due]',
        description: 'Create a new task',
    },
    {
        name: 'mytask',
        params: '',
        description: 'List your current tasks',
    },
    {
        name: 'search',
        params: '(or /s) [your text]',
        description: 'Perform a patient search',
    },
];

export interface LookForSpecialCharParams {
    str: string;
    options: AutocompleteOptions;
    targetElement: object;
}

export interface LookForSpecialCharResult {
   type: string;
   input: string;
}

export interface EditedSubstrOptions {
    substr: string;
    startIndex: number;
    caretPos: number;
}
