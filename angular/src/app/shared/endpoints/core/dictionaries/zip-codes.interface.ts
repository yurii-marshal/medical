export interface HttpGetZipCodesParams {
    sortExpression?: string;
    pageIndex?: number;
    pageSize?: number;
    text?: string;
    stateId?: number;
}

export interface ZipDictionaryType {
    description: string;
    id: number;
    text: string;
}

export interface ZipDictionaryState {
    count: number;
    byId: {
        [id: string]: ZipDictionaryType,
    };
    allIds: string[];
}
