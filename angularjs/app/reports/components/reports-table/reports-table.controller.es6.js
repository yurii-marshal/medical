import {
    reportSourceId,
    reportFilterFieldType,
    reportFilterParamId,
    reportTableSortingType,
    reportTableColumnType,
    reportTableAttributesCategory,
    reportInventoryAuditType,
} from '../../../core/constants/reports.constants.es6';

export default class reportsTableController {
    constructor(
        $state,
        $scope,
        $filter,
        $timeout,
        ngToast,
        bsLoadingOverlayService,
        reportsService
    ) {
        'ngInject';
        this.sourceId = $state.params.sourceId;

        // This solution needs for add ability customize reports tabels
        this.activeTab = $scope.$parent.reportsContainer.tabs.find((tab) => tab.isActive);

        this.canCustomizeFilters = this.activeTab && this.activeTab.canCustomizeFilters;

        this.$filter = $filter;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.reportsService = reportsService;
        this.reportSourceId = reportSourceId;
        this.reportFilterFieldType = reportFilterFieldType;
        this.reportFilterParamId = reportFilterParamId;
        this.reportTableSortingType = reportTableSortingType;
        this.reportTableColumnType = reportTableColumnType;
        this.reportTableAttributesCategory = reportTableAttributesCategory;
        this.reportInventoryAuditType = reportInventoryAuditType;

        this.totalSummary = [];
        this.filters = [];

        // Counter shown how match filters will be show after first init.
        this.filtersFirstTimeMaxCount = 3;

        this.visibleColumns = [];
        this.visibleFilters = [];
        this.showHideColumnsLabel = 'Show / Hide fields';
        this.showHideFiltersLabel = 'Show / Hide filters';
        this.filtersChanged = false;

        this.gridOptions = null;
        this.columnsWidth = {
            [reportTableColumnType.None]: 130,
            [reportTableColumnType.Date]: 125,
            [reportTableColumnType.Price]: 105,
            [reportTableColumnType.PriceRange]: 105,
            [reportTableColumnType.Number]: 105,
            [reportTableColumnType.Phone]: 145,
            [reportTableColumnType.Link]: 150,
            [reportTableColumnType.Enum]: 150,
        };
        this.defaultColumnWidth = 150;
        this.defaultPageSize = 30;
        this.toolbarItems = [
            {
                name: 'export',
                text: 'Export',
                icon: {
                    url: 'assets/images/default/replace.svg',
                    w: 14,
                    h: 18
                },
                clickFunction: this.exportCsv.bind(this)
            }
        ];
        this.dataSource = {
            rowCount: null,
            getRows: (params) => this.getRows(params)
        };

        this._activate();

        const resizeListener = () => this.resizeTable();

        window.addEventListener('resize', resizeListener);
        $scope.$on('$destroy', () => {
            window.removeEventListener('resize', resizeListener);
        });

    }

    _activate() {
        this.getReportPageConf();
    }

    getReportPageConf() {
        this.bsLoadingOverlayService.start({referenceId: 'reportsLoading'});
        this.reportsService.getReportPageConf(this.sourceId)
            .then((response) => {
                this.filters = response.data.Params.map((item) => {
                    switch (item.Model.Type.Id) {
                        case this.reportFilterFieldType.Date:
                            item.currentValue = item.Value ? moment(item.Value).format('MM/DD/YYYY') : null;
                            break;
                        case this.reportFilterFieldType.RemoteList:
                            item.searchText = '';
                            item.currentValue = {};
                            break;
                        case this.reportFilterFieldType.MultiSelectList:
                            item.searchText = '';

                            item.currentValue = {};

                            if (item.Value) {
                                item.Value.forEach((itemId) => {

                                    const staticItem = item.Model.List.Items.find((staticItems) => {
                                        return staticItems.Id === itemId;
                                    });

                                    item.currentValue[staticItem.Id] = {
                                        value: staticItem.Id,
                                        label: staticItem.Name
                                    };
                                });
                            }

                            break;
                        default:
                            item.currentValue = item.Value;
                            break;
                    }
                    return item;
                });

                if (!this.canCustomizeFilters) {
                    this.filtersFirstTimeMaxCount = this.filters.length;
                }

                this.filters.forEach((item, index) => {

                    if (this.filtersFirstTimeMaxCount <= index) {
                        item.isHide = true;
                    }

                    if (item.Model.Type.Id === this.reportFilterFieldType.Date) {
                        if (item.Model.ParamId === this.reportFilterParamId.FromDate) {
                            item.endDate = this.filters.find((f) => f.Model.ParamId === this.reportFilterParamId.ToDate);
                        } else if (item.Model.ParamId === this.reportFilterParamId.ToDate) {
                            item.startDate = this.filters.find((f) => f.Model.ParamId === this.reportFilterParamId.FromDate);
                        }
                    }
                });

                this.pagination = {PageSize: this.defaultPageSize, PageIndex: 0};

                const columnDefs = response.data.Columns.map((item) => ({
                    headerName: item.Label,
                    headerTooltip: item.Label.toUpperCase(),
                    type: item.Type.Id,
                    field: item.ColumnId,
                    colId: item.ColumnId,
                    width: this.getColumnWidth(item.Type.Id),
                    minWidth: 50,
                    valueFormatter: (params) => this.valueFormatter(params, item.Type),
                    cellRenderer: (params) => this.cellRenderer(params, item),
                    comparator: () => 0,
                    suppressMenu: true,
                    suppressSorting: !item.Sortable,
                    hide: !item.Displayed
                }));

                this.gridOptions = {
                    columnDefs: columnDefs,
                    columnTypes: {
                        [reportTableColumnType.None]: {},
                        [reportTableColumnType.Date]: {},
                        [reportTableColumnType.Price]: {},
                        [reportTableColumnType.Phone]: {},
                        [reportTableColumnType.Link]: {},
                        [reportTableColumnType.Enum]: {},
                    },
                    gridAutoHeight: true,
                    enableColResize: true,
                    colResizeDefault: 'shift',
                    suppressMovableColumns: true,
                    sortingOrder: ['asc', 'desc'],
                    overlayLoadingTemplate: '<span></span>',
                    overlayNoRowsTemplate: '<span class="ag-overlay-no-rows-center">No data</span>',
                    enableServerSideSorting: true,
                    rowModelType: 'infinite',
                    paginationPageSize: this.defaultPageSize,
                    cacheBlockSize: this.defaultPageSize,
                    maxBlocksInCache: 5,
                    maxConcurrentDatasourceRequests: 2,
                    infiniteInitialRowCount: 1,
                    pagination: true,
                    onPaginationChanged: () => {
                        if (this.gridOptions.api) {
                            this.pagination.PageIndex = this.gridOptions.api.paginationGetCurrentPage();
                        }
                    },
                    onGridReady: (params) => {
                        const sortModel = response.data.Sorting.map((item) => ({
                            colId: item.ColumnId,
                            sort: item.Direction.Description.toLowerCase()
                        }));

                        params.api.setSortModel(sortModel);
                        this.resizeTable();
                        this.updateDataSource();
                    },
                    defaultColDef: {
                        headerComponentParams: {
                            template:
                                '<div class="ag-cell-label-container" role="presentation">' +
                                '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
                                '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
                                '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
                                '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
                                '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
                                '  </div>' +
                                '</div>'
                        }
                    }
                };
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({referenceId: 'reportsLoading'});
            });
    }

    getRows(params) {
        if (!this.gridOptions.api) {
            return;
        }
        this.gridOptions.api.hideOverlay();
        this.bsLoadingOverlayService.start({referenceId: 'reportsTableLoading'});
        this.reportsService.getReportPageData(this.sourceId, this.getRowsParams())
            .then((response) => {
                if (response.data.Summary) {
                    this.totalSummary = response.data.Summary.map((item) =>
                        ({label: item.Label, value: this.formatPrice(item.Value)}));
                }
                const rowData = response.data.Items.map((item) => item.Columns.reduce(
                    (res, data) => Object.assign(res, {
                        [data.ColumnId]: {
                            value: data.Value,
                            attributes: data.Attributes
                        }
                    }),
                    {}
                ));
                let lastRow = -1;

                if (this.gridOptions.api && rowData.length < this.pagination.PageSize) {
                    lastRow = this.gridOptions.api.paginationGetRowCount() + rowData.length - 1;
                }
                params.successCallback(rowData, lastRow);
            })
            .catch(() => {
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({referenceId: 'reportsTableLoading'});
                if (this.gridOptions.api && !this.gridOptions.api.getDisplayedRowCount()) {
                    this.gridOptions.api.showNoRowsOverlay();
                }
            });
    }

    getRowsParams() {
        return {
            Report: {
                Columns: this.gridOptions.columnDefs.map((item) => ({
                    ColumnId: item.colId
                })),
                Filters: this.filters.filter((item) => !!item.currentValue && !item.isHide)
                    .map((item) => {
                        let value = item.currentValue;

                        switch (item.Model.Type.Id) {
                            case this.reportFilterFieldType.Date:
                                value = moment(value).format('YYYY-MM-DD');
                                break;
                            case this.reportFilterFieldType.RemoteList:
                                value = Object.keys(value);
                                if (!value.length) {
                                    value = null;
                                }
                                break;
                            case this.reportFilterFieldType.MultiSelectList:
                                value = Object.keys(value);

                                if (!value.length) {
                                    value = null;
                                }

                                break;
                            default:
                                break;
                        }
                        return {
                            FilterId: item.Model.ParamId,
                            Value: value
                        };
                    })
                    .filter((item) => !!item.Value),
                Sorting: this.gridOptions.api.getSortModel().map((item) => ({
                    ColumnId: item.colId,
                    Direction: this.reportTableSortingType[item.sort]
                }))
            },
            Pagination: this.pagination
        };
    }

    exportCsv() {
        const params = this.getRowsParams();

        delete params.Pagination;
        this.bsLoadingOverlayService.start({referenceId: 'reportsLoading'});
        this.reportsService.exportReportToCsv(this.sourceId, params)
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'reportsLoading'}));
    }

    getColumnWidth(type) {
        return this.columnsWidth[type] || this.defaultColumnWidth;
    }

    cellRenderer(params, column) {
        let value = params.valueFormatted || '';
        const attributes = params.value && params.value.attributes;

        if (attributes && value) {
            switch (column.Type.Id) {

                case this.reportTableColumnType.Link:
                    value = this.cellRendererLink(value, attributes);
                    break;

                case this.reportTableColumnType.Enum:
                    value = this.cellRendererEnum(value, attributes, column);
                    break;

                default:
                    break;
            }
        }
        return value;
    }

    cellRendererLink(value, attributes) {
        switch (attributes.Category) {

            case this.reportTableAttributesCategory.Patient:
                value = `<a href="#/patient/${attributes.Id}/demographics">${value}</a>`;
                break;

            case this.reportTableAttributesCategory.Invoice:
                value = `<a href="#/billing/invoices/invoice/${attributes.Id}/details">${value}</a>`;
                break;

            case this.reportTableAttributesCategory.Payment:
                value = `<a href="#/billing/payment/${attributes.Id}/details">${value}</a>`;
                break;

            case this.reportTableAttributesCategory.Order:
                value = `<a href="/#/orders/order/${attributes.Id}/details">${value}</a>`;
                break;

            default:
                break;
        }
        return value;
    }

    cellRendererEnum(value, attributes, column) {
        switch (this.sourceId) {

            case this.reportSourceId.InventoryAudit:
                value = this.cellRendererInventoryAudit(value, attributes, column);
                break;

            default:
                break;
        }
        return value;
    }

    cellRendererInventoryAudit(value, attributes, column) {
        switch (column.ColumnId) {

            case 'Type':
                const statusClass = this.getInventoryAuditTypeStatusClass(attributes.Id);

                value =`<span class="status-label ${statusClass}">${value}</span>`;
                break;

            default:
                break;
        }
        return value
    }

    getInventoryAuditTypeStatusClass(statusId) {
        let statusClass = '';

        switch (statusId) {
            case this.reportInventoryAuditType.Receive:
                statusClass = 'green';
                break;
            case this.reportInventoryAuditType.Update:
                statusClass = 'blue';
                break;
            case this.reportInventoryAuditType.Move:
                statusClass = 'dark-blue';
                break;
            case this.reportInventoryAuditType.Delete:
                statusClass = 'red';
                break;
            case this.reportInventoryAuditType.ChangeStatus:
                statusClass = 'orange';
                break;
            default:
                statusClass = 'gray';
                break;
        }
        return statusClass;
    }

    valueFormatter(params, columnType) {
        let value = params.value && params.value.value;

        if (value !== null && value !== undefined) {
            switch (columnType.Id) {
                case this.reportTableColumnType.Date:
                    value = moment(value).format('MM/DD/YYYY');
                    break;
                case this.reportTableColumnType.Price:
                    value = this.formatPrice(value);
                    break;
                case this.reportTableColumnType.PriceRange:
                    const from = this.formatPrice(value.From);
                    const to = this.formatPrice(value.To);

                    value = from && to ? `${from} - ${to}` : '';
                    break;
                case this.reportTableColumnType.Phone:
                    value = this.$filter('tel')(value);
                    break;
                default:
                    break;
            }
        }
        return value;
    }

    updateDataSource() {
        this.gridOptions.api.setDatasource(this.dataSource);
    }

    onFilterChanged() {
        this.$timeout(() => {
            /* $timeout for start/end time validation directive.
             When directive apply changes, then we check our form validation
            */
            if (this.filtersForm.$valid) {
                this.updateDataSource();
            }
        }, 100);
    }

    isShowHideColumnCheckboxDisabled(column) {
        return this.visibleColumns.length === 1 && !!this.visibleColumns.find((col) => col.colId === column.colId);
    }

    onRefreshSelectedFilters() {
        this.filters.forEach((filter, index) => {
            filter.isHide = this.filtersFirstTimeMaxCount <= index;
            this.clearFilter(filter);
        });

        this.onFilterChanged();
    }

    clearFilter(filter) {
        switch (filter.Model.Type.Id) {
            case this.reportFilterFieldType.RemoteList:
                filter.currentValue = {};
                break;
            case this.reportFilterFieldType.MultiSelectList:
                filter.currentValue = {};
                break;
            default:
                filter.currentValue = null;
                break;
        }
    }

    onSelectFilter(filterItem) {
        filterItem.isHide = !filterItem.isHide;
        this.filtersChanged = true;
    }

    onSuggestionPanelVisibility(status) {
        if (!status && this.filtersChanged) {
            this.filtersChanged = false;
            this.searchFilterText = '';

            this.filters.forEach((filter) => {
                if (filter.isHide) {
                    this.clearFilter(filter);
                }
            });

            this.onFilterChanged();
        }

        this.showHideFiltersLabel = !status ? 'Show / Hide filters' : ' ';
    }

    getFiltersItems(text) {
        return this.filters.filter((f) => {
            return f.Model.Label.toLowerCase().indexOf(text.toLowerCase()) > -1;
        });
    }

    onShowHideColumns() {
        const columns = this.gridOptions.columnApi.getAllDisplayedColumns();
        const isChanged = columns.length !== this.visibleColumns.length ||
            !!columns.filter((col) => !this.visibleColumns.find((item) => col.colId === item.colId)).length;

        if (!isChanged) {
            return;
        }
        this.gridOptions.columnApi.getAllColumns().forEach((col) => {
            const isVisible = !!this.visibleColumns.find((item) => col.colId === item.colId);

            this.gridOptions.columnApi.setColumnVisible(col.colId, isVisible);
        });
        this.gridOptions.api.refreshHeader();
        this.resizeTable();
    }

    resizeTable() {
        const gridElement = document.getElementById('reports-grid');
        const columns = this.gridOptions.columnApi.getAllDisplayedColumns();
        const possibleWidth = columns.reduce((sum, col) => (sum + this.getColumnWidth(col.getColDef().type)), 0);

        if (possibleWidth < gridElement.clientWidth) {
            this.gridOptions.api.sizeColumnsToFit();
        } else {
            columns.forEach((col) => this.gridOptions.columnApi.setColumnWidth(col, this.getColumnWidth(col.getColDef().type)));
        }
    }

    formatPrice(value) {
        if (value === undefined || value === null || value === '' || isNaN(+value)) {
            return value;
        }
        const formattedValue = this.$filter('number')(Math.abs(value));

        return +value < 0 ? `$ (${formattedValue})` : `$ ${formattedValue}`;
    }
}
