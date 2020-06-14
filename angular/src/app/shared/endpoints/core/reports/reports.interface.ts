export interface ReportExecuteRequest {
    Report: {
        Columns: ReportExecuteRequestColumn[];
        Filters: ReportExecuteRequestFilter[];
        Sorting: ReportExecuteRequestSorting[];
    };
    Pagination: {
        PageIndex: number;
        PageSize: number;
    };
}

export interface ReportRowItem {
    columnId: string;
    value: any;
    attributes: any;
}

export interface ReportRowsState {
    count?: number;
    byId: {
        [id: string]: ReportRowItem,
    };
    allIds: string[];
}

export interface ReportExecuteRequestColumn {
    ColumnId: string;
}

export interface ReportExecuteRequestFilter {
    FilterId: string;
    Value: any;
}

export interface ReportExecuteRequestSorting {
    ColumnId: string;
    Direction: number;
}

export interface ReportsMenuItem {
    id: string;
    name: string;
    description: string;
}

export interface ReportColumn {
    columnId: string;
    label: string;
    sortable: boolean;
    displayed: boolean;
}

export interface ReportParamModelType {
    id: string;
    description: string;
}

export interface ReportParamModelListItem {
    id: string;
    name: string;
}

export interface ReportParamModelRemoteData {
    url: string;
    idField: string;
    displayField: string;
    filterField: string;
}

export interface ReportParamModelSorting {
    columnId: string;
    direction: {
        id: string;
        description: string;
    };
}

export interface  ReportParamModelState {
    paramId: string;
    label: string;
    typeId: string;
    items?: ReportParamModelListItem[];
    remote?: ReportParamModelRemoteData;
    value: string;
}

export interface ReportPageState {
    sourceId: string;
    reportName: string;
    columns: {
        count?: number;
        byId: {
            [id: string]: ReportColumn,
        };
        allIds: string[];
    };
    paramTypes: {
        count?: number;
        byId: {
            [id: string]: ReportParamModelType,
        };
        allIds: string[];
    };
    params: {
        count?: number;
        byId: {
            [id: string]: ReportParamModelState,
        };
        allIds: string[];
    };
    sorting: {
        count?: number;
        byId: {
            [id: string]: ReportParamModelSorting,
        };
        allIds: string[];
    };
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
}

export function initReportPageState(): ReportPageState {
    return {
        sourceId: '',
        reportName: '',
        columns: {
            byId: {},
            allIds: [],
        },
        paramTypes: {
            byId: {},
            allIds: [],
        },
        params: {
            byId: {},
            allIds: [],
        },
        sorting: {
            byId: {},
            allIds: [],
        },
        pagination: {
            pageIndex: null,
            pageSize: null,
        },
    };
}
