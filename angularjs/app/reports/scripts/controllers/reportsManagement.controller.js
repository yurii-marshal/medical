(function () {
    'use strict';

    angular
        .module('app.reports')
        .controller('reportManagementController', reportManagementController);

    /* @ngInject */
    function reportManagementController($q,
                                        $timeout,
                                        $sce,
                                        ngToast,
                                        reportManagementGridDetailsService,
                                        reportManagementService,
                                        bsLoadingOverlayService,
                                        $scope,
                                        WEB_API_SERVICE_URI,
                                        $state,
                                        $mdDialog,
                                        $filter) {
        var vm = this;

        vm.stateReportId = undefined;

        vm.sidebarConfig = {
            axis: 'y',
            scrollButtons: {
                enable: false
            },
            advanced: {
                updateOnContentResize: true
            },
            live: true,
            theme: "minimal",
            autoHideScrollbar: "false"
        };

        vm.canceller = $q.defer();
        //left side menu by default
        vm.menuClose = false;

        //used in start controller and click "clear" button
        function setDefault() {
            //for selected fields on the page
            vm.selected = {
                'reportSource': undefined,
                'filters': [],
                'options': [],
                'groupby': undefined,
                'reportId': undefined,
                'reportName': '',
                'sortValues': [],
                'shareForAll': false
            };
            //Defaults
            vm.blocks_open = {
                'data': true,
                'filters': true,
                'options': true
            };
            vm.filtersBlock = [];
            vm.filters = [];
            vm.selectedFilter = null;
            vm.options = [];
            vm.groupby = [];
            vm.error_apply_msg = '';
            vm.show_table_content = false;
            // for autocompletes
            vm.searchDataSource = "";
            vm.searchFilter = "";
            vm.searchGroupBy = "";
            // for paging
            vm.pageSize = 100;
            vm.pageIndex = 1;
            vm.totalItems = 0;
            vm.gridColumns = [];
            //used in 'datasorce select' for handle on-select after report is loaded
            vm.dataSourceReportLoad = false;
        }

        setDefault();

        function initReportSourceByParams() {
            if ($state.params.reportSourceId) {
                vm.reportSources.forEach(function (reportSource) {
                    if (reportSource.Id === +$state.params.reportSourceId) {
                        vm.selected.reportSource = reportSource;
                        vm.searchDataSource = reportSource.Name;
                        vm.onSelectDataSource(reportSource);
                    }
                });
            }
        }

        function initFiltersByParams() {
            var parsedFilters = [];

            // Expect data like filters = filterId:operationId:filterValue,...

            if ($state.params.filters) {
                parsedFilters = $state.params.filters.split(',');
                parsedFilters = parsedFilters.map(function (filter) {
                    return filter.split(':');
                });

                vm.filters.forEach(function (filter) {
                    parsedFilters.forEach(function (parsedFilter) {
                        if (filter.Id === +parsedFilter[0]
                            && vm.filtersBlock.map(function (f) {
                                return f.Id;
                            }).indexOf(filter.Id) === -1) {

                            var copyOfFilter = angular.copy(filter);

                            copyOfFilter.isSelected = true;

                            copyOfFilter.currentValue = decodeURIComponent(parsedFilter[2]);

                            copyOfFilter.Operations.forEach(function (operation) {
                                if (operation.Id === +parsedFilter[1]) {
                                    copyOfFilter.currentOption = operation;
                                }
                            });

                            vm.filtersBlock.push(copyOfFilter);
                        }
                    });
                });
            }

            vm.apply_report_filters();
        }


        loadReportsList(vm, 'myReports', 'user-reports');
        loadReportsList(vm, 'availableReports', 'available-reports');

        reportManagementService.getReportSourcesList()
            .success(function (data) {
                vm.reportSources = data.Items;
                initReportSourceByParams();
            }).error(function (data) {
            ngToast.danger("We’re experiencing an internal server problem. Please try again later.");
        });

        vm.onSelectDataSource = function (item) {
            if (item !== undefined && item !== null) {
                //fix issue with on-select after load report
                if (vm.dataSourceReportLoad) {
                    vm.dataSourceReportLoad = false;
                    return;
                }

                //show spinner filter & options
                bsLoadingOverlayService.start({referenceId: 'filters'});

                //reload data
                reportManagementService.getReportSourcesById(item.Id)
                    .success(function (data) {
                        vm.filters = reportManagementService.prepareFilters(data);
                        vm.options = reportManagementService.prepareOptions(data);
                        vm.groupby = reportManagementService.prepareGroupBy(data);

                        // default columns set selected
                        vm.selected.options = [];
                        angular.forEach(vm.options, function (item_option) {
                            if (item_option.InDefaultList) {
                                vm.selected.options.push(item_option);
                            }
                        });

                        // hide previous table result
                        vm.show_table_content = false;

                        initFiltersByParams();

                        bsLoadingOverlayService.stop({referenceId: 'filters'});

                    }).error(function (data) {
                    ngToast.danger("We’re experiencing an internal server problem for loading filters. Please try again later.");
                });
            } else {
                vm.filtersBlock = [];
            }
        };

        vm.toggleBlock = function (blockName) {
            vm.blocks_open[blockName] = !!!vm.blocks_open[blockName];
            var grid = reportManagementService.getGridApi();
            if (grid && grid.core) {
                grid.core.refresh();
            }
        };

        vm.toggle_menu = function () {
            vm.menuClose = !vm.menuClose;
        };

        vm.isAutocompleteMSizeClass = function (item) {

            var listFiltersMSize = {
                '502': 'Location',
                '503': 'Modifiers',
                '504': 'Diagnosis',
                '511': 'Referring Provider',
                '513': 'Billing Provider',
                '516': 'Payer Name',
                '520': 'Denial',
                '522': 'Adjustment Reasons'
            };

            return !!listFiltersMSize[item && item.Id];
        }

        vm.addFilter = function addFilter(item, objValue) {

            if (item === undefined || item === null) {
                return;
            }

            if (vm.filtersBlock.indexOf(item) === -1) {

                //by default after add filter is selected
                item.isSelected = true;
                item.controllType = reportManagementService.getControllType(item);
                item.currentValues = [];
                item.isMupltiple = false;

                //default values for filters
                item.currentValue = "";
                item.currentOption = reportManagementService.getCurrentOperation(item.Operations);

                if (objValue) {
                    //Set filter value
                    item = reportManagementService.getFilterValue(item, objValue);

                    //Set operation type for filter
                    angular.forEach(item.Operations, function (option) {
                        if (option.Id === objValue.ReportColumnOperationId) {
                            item.currentOption = option;
                        }
                    });
                }

                vm.filtersBlock.push(item);
                vm.filters.splice(vm.filters.indexOf(item), 1);
                vm.searchFilter = "";
            }
        };

        vm.getFilterValidationMsg = function (name) {
            var filterCanBeNegative = ['Balance', 'Adjustments'];
            var filterCanBeFloat = ['Allowed', 'Payments', 'Charge Amount'];

            if (filterCanBeNegative.indexOf(name) !== -1) {
                return name + ' consists only from numbers';
            } else if (filterCanBeFloat.indexOf(name) !== -1) {
                return name + ' consists only from positive numbers';
            }

            return name + ' consists only from digits';
        }

        vm.filterCanBeNegative = function (name) {
            var filters = ['Balance', 'Adjustments'];

            if (filters.indexOf(name) !== -1) {
                return true;
            }
        }

        vm.filterCanBeFloat = function (name) {
            var filters = ['Allowed', 'Payments', 'Charge Amount'];

            if (filters.indexOf(name) !== -1) {
                return true;
            }
        }

        vm.filterCanBeOnlyDigit = function (name) {
            var filters = ['Balance', 'Adjustments', 'Allowed', 'Payments', 'Charge Amount'];

            if (filters.indexOf(name) === -1) {
                return true;
            }
        }

        vm.load_report = function (id) {
            //run delete watcher if exist;
            if (window.watchOnChangeLoadedReportOptions)
                window.watchOnChangeLoadedReportOptions();

            bsLoadingOverlayService.start({referenceId: 'main_block'});
            vm.canceller.resolve("user cancelled");
            //hide blocks
            setDefault();
            vm.selected.reportId = id;
            vm.blocks_open = {
                'data': false,
                'filters': false,
                'options': false
            };

            reportManagementService.getReport(id)
                .success(function (data) {

                    vm.filters = reportManagementService.prepareFilters(data);
                    vm.options = reportManagementService.prepareOptions(data);
                    vm.groupby = reportManagementService.prepareGroupBy(data);
                    vm.filtersBlock = [];
                    vm.selected.reportName = data.Name || '';
                    vm.selected.shareForAll = data.IsPublic || false;
                    vm.selected.Editable = data.Editable || false;
                    angular.forEach(data.UserColumns, function (column) {
                        if (column.GroupBy) {
                            angular.forEach(vm.groupby, function (groupByColumn) {
                                if (groupByColumn.Id === column.ReportSourceColumnId) {
                                    vm.selected.groupby = groupByColumn;
                                }
                            });
                        }
                    });

                    //set DataSource values
                    //issue with on-select after change source value
                    vm.dataSourceReportLoad = true;
                    angular.forEach(vm.reportSources, function (item, key) {
                        if (item.Id === data.ReportSourceId) {
                            vm.selected.reportSource = vm.reportSources[key];
                        }
                    });


                    //apply selected filters
                    //data["UserFilters"] = [
                    //  {
                    //    "ReportSourceColumnId": 641,
                    //    "ReportColumnOperationId": 13,
                    //    "FilterValue": "New York",
                    //    "Id": 21
                    //  }
                    //];

                    angular.forEach(data.UserFilters, function (item_selected) {

                        angular.forEach(vm.filters, function (item_filter) {
                            if (item_selected.ReportSourceColumnId === item_filter.Id) {
                                vm.addFilter(item_filter, item_selected);
                            }
                        });

                    });

                    //apply selected columns
                    angular.forEach(data.UserColumns, function (item_selected) {
                        angular.forEach(vm.options, function (item_option) {
                            if (item_selected.ReportSourceColumnId === item_option.Id) {
                                vm.selected.options.push(item_option);
                            }
                        });
                    });

                    var watchOnChangeLoadedReportOptionsCounter = 0;
                    window.watchOnChangeLoadedReportOptions = $scope.$watch(function () {
                        return [vm.selected, vm.filtersBlock];
                    }, function () {
                        if (watchOnChangeLoadedReportOptionsCounter > 0) {

                            vm.selected['reportId'] = undefined;
                            vm.selected['reportName'] = '';
                            vm.selected['sortValues'] = [];
                            vm.selected['shareForAll'] = false;

                            $state.go("root." + "reports.index");

                            window.watchOnChangeLoadedReportOptions();
                        }
                        watchOnChangeLoadedReportOptionsCounter++;
                    }, true);

                    //apply to table
                    vm.apply_report_filters();

                    bsLoadingOverlayService.stop({referenceId: 'main_block'});

                })
                .error(function (data) {
                    bsLoadingOverlayService.stop({referenceId: 'main_block'});
                });
        };

        vm.delete_report = function (id) {
            reportManagementService.deleteReport(id)
                .success(function (data) {
                        loadReportsList(vm, 'availableReports', 'available-reports');
                        loadReportsList(vm, 'myReports', 'user-reports');
                        vm.clear_report_area();
                    }
                ).error(function (data) {
                ngToast.danger("Cannot delete report. Please reload page and check if the report still exists.");
            });
        };

        vm.closeSaveView = function () {
            vm.showSaveBlock = false;
            vm.saveBlockError = '';
            vm.saveView = undefined;
        };

        vm.openSaveView = function () {
            vm.showSaveBlock = true;
            vm.saveReportName = "";
            vm.shareForAll = false;
            vm.saveViewReportId = undefined;
        };

        vm.openEditView = function () {
            vm.showSaveBlock = true;
            vm.saveReportName = vm.selected.reportName;
            vm.shareForAll = vm.selected.shareForAll;
            vm.saveViewReportId = vm.selected.reportId;
        }

        vm.save_report = function (filter, options) {

            if (vm.reportForm.$invalid) {
                touchedErrorFields(vm.reportForm);
                return;
            }

            var obj = {
                'filters': filter || vm.filtersBlock,
                'columns': options || vm.selected.options,
                'groupby': vm.selected.groupby,
                'sourceid': vm.selected.reportSource.Id,
                'name': vm.saveReportName,
                'share': vm.shareForAll,
                'sortValues': vm.selected.sortValues,
                'reportId': vm.saveViewReportId
            }

            vm.saveBlockError = '';
            var errMsg = reportManagementService.validateSaveReport(obj);
            if (errMsg) {
                vm.saveBlockError = errMsg;
                return;
            }

            bsLoadingOverlayService.start({referenceId: 'save_report'});

            reportManagementService.saveReport(obj)
                .success(function (data) {

                    if (data.Message) {
                        ngToast.danger("Error:" + data.Message);
                    } else {
                        ngToast.success("Report was successfully saved!");
                    }
                    vm.showSaveBlock = false;
                    bsLoadingOverlayService.stop({referenceId: 'save_report'});

                    if (vm.shareForAll) {
                        loadReportsList(vm, 'availableReports', 'available-reports');
                        loadReportsList(vm, 'myReports', 'user-reports');
                    } else {
                        loadReportsList(vm, 'myReports', 'user-reports');
                    }

                }).error(function (data) {
                if (angular.isArray(data)) {
                    var message = "";
                    angular.forEach(data, function (error) {
                        message += error.Message;
                    });
                    ngToast.danger(message);
                } else {
                    ngToast.danger("Sorry, report cannot be saved temporarily. Please try again later.");
                }
                bsLoadingOverlayService.stop({referenceId: 'save_report'});
            });

        };

        vm.apply_report_filters = function () {

            vm.error_apply_msg = '';
            if (!vm.selected.options || vm.selected.options.length === 0) {
                vm.error_apply_msg = "'Selected columns' is empty.";
                return;
            }

            if (vm.reportMainForm && vm.reportMainForm.$invalid) {
                touchedErrorFields(vm.reportMainForm);
                return;
            }

            vm.canceller.resolve("user cancelled");
            var obj = {
                'filters': vm.filtersBlock,
                'columns': vm.selected.options,
                'groupby': vm.selected.groupby,
                'sourceid': vm.selected.reportSource.Id,
                'reportId': vm.selected.reportId,
                'sortValues': vm.selected.sortValues,
                'pageSize': vm.pageSize,
                'pageIndex': vm.pageIndex - 1,
                'allFilters': vm.filters
            };

            vm.gridTableData = reportManagementService.initializeGrid(
                $scope,
                obj,
                vm.getDataDown,
                vm.setSortValues,
                vm.apply_report_filters,
                $scope.showDialog,
                vm.setPageInfo
            );
            //vm.gridTableData.data = [];
            vm.show_table_content = true;
            vm.gridColumns = [];
            angular.forEach(vm.selected.options, function (option) {
                angular.forEach(vm.filters.concat(vm.filtersBlock), function (filter) {
                    if (filter.Id === option.Id) {
                        option.TypeCode = filter.TypeCode;
                    }
                });
                vm.gridColumns.push(option);
            });

            bsLoadingOverlayService.start({referenceId: 'table'});

            reportManagementService.getTableData(obj, $scope.pageIndex)
                .then(function (response) {
                        var data = response.data;

                        if (data.ReportBody) {
                            vm.isGrouped = vm.selected.groupby !== undefined && vm.selected.groupby !== null;
                            if (vm.isGrouped) {
                                var groupBy = $filter("groupBy");
                                var groupedData = groupBy(data.ReportBody, vm.selected.groupby.Code);
                                angular.forEach(groupedData, function (key, value) {
                                    groupedData[value].isExpanded = true;
                                });
                                vm.gridTableData.data = groupedData;
                            } else {
                                vm.gridTableData.data = data.ReportBody;
                            }

                            vm.gridTableData.totalItems = data.TotalCount;
                            vm.totalItems = data.TotalCount;
                        } else {
                            ngToast.danger("Error:" + data.Message);
                        }
                        bsLoadingOverlayService.stop({referenceId: 'table'});

                    },
                    function () {

                        ngToast.danger("We’re experiencing an internal server problem. Please try again later.");
                        bsLoadingOverlayService.stop({referenceId: 'table'});

                    });


        };

        vm.clear_report_area = function () {
            vm.canceller.resolve("user cancelled");
            //var i = vm.reportSources.indexOf(vm.selected.reportSource);

            //setDefault();
            //vm.selected.reportSource = vm.reportSources[i];

            vm.selectedFilter = null;
            vm.selected.filters = [];
            vm.selected.reportId = null;
            vm.filtersBlock = [];
            vm.blocks_open = {
                'data': true,
                'filters': true,
                'options': true
            };
            vm.onSelectDataSource(vm.selected.reportSource);

        };

        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            vm.stateReportId = $state.params.reportId;
        });


        function loadReportsList(scope, localReportName, serverReportName) {

            bsLoadingOverlayService.start({referenceId: 'reportSidebar'});

            reportManagementService.getReportsList(serverReportName)
                .success(function (data) {
                    scope[localReportName] = data.Items;
                }).error(function (data) {
                ngToast.danger("Sorry, '" + serverReportName + "' temporarily is unavailable. Please try again later.");
            }).then(function () {
                bsLoadingOverlayService.stop({referenceId: 'reportSidebar'});
            });
        }


        $scope.pageIndex = 1;

        //vm.getDataDown = function() {
        //    bsLoadingOverlayService.start({ referenceId: "table" });

        //    var api = reportManagementService.getGridApi();

        //    var obj = {
        //        'filters': vm.filtersBlock,
        //        'columns': vm.selected.options,
        //        'groupby': vm.selected.groupby,
        //        'sourceid': vm.selected.reportSource.Id,
        //        'reportId': vm.selected.reportId,
        //        'sortValues': vm.selected.sortValues
        //    }

        //    var promise = $q.defer();
        //    reportManagementService.getTableData(obj, $scope.pageIndex)
        //        .success(function(data) {
        //            $scope.pageIndex++;
        //            api.infiniteScroll.saveScrollPercentage();
        //            vm.gridTableData.data = vm.gridTableData.data.concat(data.ReportBody);
        //            api.infiniteScroll.dataLoaded().then(function() {
        //                promise.resolve();
        //            });
        //            bsLoadingOverlayService.stop({ referenceId: "table" });
        //        })
        //        .error(function(error) {
        //            api.infiniteScroll.dataLoaded();
        //            promise.reject();
        //            bsLoadingOverlayService.stop({ referenceId: "table" });
        //        });
        //    return promise.promise;
        //};


        $scope.getCurrenReportFile = function () {

            bsLoadingOverlayService.start({referenceId: "download_link"});
            vm.canceller = $q.defer();

            var obj = {
                'filters': vm.filtersBlock,
                'columns': vm.selected.options,
                'groupby': vm.selected.groupby,
                'sourceid': vm.selected.reportSource.Id,
                'reportId': vm.selected.reportId,
                'sortValues': vm.selected.sortValues
            };

            reportManagementService.downloadReport(obj, vm.canceller)
                .then(function (file) {
                    download(file, "report.csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                    bsLoadingOverlayService.stop({referenceId: "download_link"});
                }, function (error) {
                    ngToast.danger(error);
                    bsLoadingOverlayService.stop({referenceId: "download_link"});
                });
        };


        $scope.$on('$stateChangeSuccess', function (toState) {
            if ($state.is("root.reports.index.detail")) {

                vm.load_report($state.params.reportId);

            }
            //redirect on "/"
            if ($state.is("root.reports")) {
                $state.go("root.reports.index");
            }
        });

        vm.setSortValues = function (sortValues) {
            vm.selected.sortValues = sortValues;
        }

        vm.getData = function (filterSourceId, value) {
            return reportManagementService.getData(filterSourceId, value).then(function (response) {
                return response.data.Items;
            });
        }

        $scope.showDialog = function (row) {
            $mdDialog.show({
                controller: reportManagementController,
                templateUrl: "../../reports/views/templates/dialog.html",
                parent: angular.element(document.body),
                local: {
                    row: row
                }
            })
                .then(function (answer) {
                    //$scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    //$scope.status = 'You cancelled the dialog.';
                });
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        vm.setPageInfo = function (pageSize, pageIndex) {
            vm.pageSize = pageSize;
            vm.pageIndex = pageIndex;
        };

        vm.currentValues = [];

        vm.sort = function (header) {
            vm.removeOtherSortColumns(header.Code);

            if (header.isAsc) {
                header.isAsc = false;
            } else {
                header.isAsc = true;
            }

            vm.setSortValues([{name: header.Code, sortValue: header.isAsc ? "asc" : "desc"}]);
            vm.apply_report_filters();
        }

        vm.removeOtherSortColumns = function (code) {
            angular.forEach(vm.gridColumns, function (column) {
                if (column.Code !== code) {
                    column.isAsc = undefined;
                }
            });
        }

        vm.isGrouped = false;

        vm.expand = function (key) {
            vm.gridTableData.data[key].isExpanded = !vm.gridTableData.data[key].isExpanded;
        }

        vm.select = function (row) {
            angular.forEach(vm.gridTableData.data, function (data) {
                if (angular.isArray(data)) {
                    angular.forEach(data, function (item) {
                        item.isSelected = false;
                    });
                } else {
                    data.isSelected = false;
                }
            });

            row.isSelected = true;
        }

        vm.changeMultiple = function (filter) {
            if (filter) {
                filter.currentValues = [];
                filter.isMupltiple = !filter.isMupltiple;
            }
        }
    }
})();
