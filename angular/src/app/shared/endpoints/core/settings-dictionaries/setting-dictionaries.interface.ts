export interface StatesDictionaryType {
    id: string;
    text: string;
}

export interface StatesDictionaryState {
    byId: {
        [id: string]: StatesDictionaryType,
    };
    allIds: string[];
}
