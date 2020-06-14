import {
    initReportPageState,
    ReportExecuteRequest,
    ReportPageState,
    ReportsMenuItem,
} from './reports.interface';

export function mapExecuteRequest(data: ReportPageState): ReportExecuteRequest {
    const outData: ReportExecuteRequest = {
        Report: {
            Columns: data.columns.allIds.map((columnId) => ({
                ColumnId: columnId,
            })),
            Filters: data.params.allIds.map((paramId) => ({
                FilterId: paramId,
                Value: data.params.byId[paramId].value,
            })),
            Sorting: [
                {
                    ColumnId: 'Agging90',
                    Direction: 1,
                },
            ],
        },
        Pagination: {
            PageIndex: 0,
            PageSize: 15,
        },
    };

    return outData;
}

// export function normalizeReportsExecute(rowsServerData: any): ReportRowsState {
//     const reportRows: ReportRowsState = {
//         allIds: [],
//         byId: {}
//     };
//
//     rowsServerData.Items.forEach(() => {
//
//     });
//
//    return reportRows;
// }

export function normalizeReportsMenu(reportsData: any): ReportsMenuItem[] {
    const reportsMenu = reportsData.map((item) => ({
        id: item.Id,
        name: item.Name,
        description: item.Name,
    }));

    return reportsMenu;
}

export function normalizeReportPageConf(reportPageData: any): ReportPageState {
    const outputReportPageData: ReportPageState = initReportPageState();

    outputReportPageData.sourceId = reportPageData.SourceId;
    outputReportPageData.reportName = reportPageData.ReportName;
    outputReportPageData.pagination = {
        pageIndex: reportPageData.Pagination.PageIndex,
        pageSize: reportPageData.Pagination.PageSize,
    };

    reportPageData.Sorting.forEach((sortingItem: any) => {
        outputReportPageData.sorting.byId[sortingItem.ColumnId] = {
            columnId: sortingItem.ColumnId,
            direction: {
                id: sortingItem.Direction.Id,
                description: sortingItem.Direction.Description,
            },
        };
    });

    outputReportPageData.sorting.allIds = Object.keys(outputReportPageData.sorting.byId);

    reportPageData.Params.forEach((paramsItem) => {
        outputReportPageData.params.byId[paramsItem.Model.ParamId] = {
            paramId: paramsItem.Model.ParamId,
            label: paramsItem.Model.Label,
            typeId: paramsItem.Model.Type.Id,
            value: paramsItem.Value,
        };

        outputReportPageData.paramTypes.byId[paramsItem.Model.Type.Id] = {
            id: paramsItem.Model.Type.Id,
            description: paramsItem.Model.Type.Description,
        };

        if (paramsItem.Model.List) {
            outputReportPageData.params.byId[paramsItem.Model.ParamId].items = paramsItem.Model.List.Items.map((item) => {
                return {
                    name: item.Name,
                    id: item.Id,
                };
            });
        }

        if (paramsItem.Model.Remote) {
            outputReportPageData.params.byId[paramsItem.Model.ParamId].remote = {
                url: paramsItem.Model.Remote.Url,
                idField: paramsItem.Model.Remote.IdField,
                displayField: paramsItem.Model.Remote.DispayField,
                filterField: paramsItem.Model.Remote.FilterField,
            };
        }
    });

    outputReportPageData.params.allIds = Object.keys(outputReportPageData.params.byId);
    outputReportPageData.paramTypes.allIds = Object.keys(outputReportPageData.paramTypes.byId);

    reportPageData.Columns.forEach((columnsItem) => {
        outputReportPageData.columns.byId[columnsItem.ColumnId] = {
            columnId: columnsItem.ColumnId,
            label: columnsItem.Label,
            sortable: columnsItem.Sortable,
            displayed: columnsItem.Displayed,
        };
    });

    outputReportPageData.columns.allIds = Object.keys(outputReportPageData.columns.byId);

    return outputReportPageData;
}
