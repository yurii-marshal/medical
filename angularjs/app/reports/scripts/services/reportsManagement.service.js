(function () {
    'use strict';

    angular
      .module('app.reports')
      .service('reportManagementService', reportManagementService);

    reportManagementService.$inject = ['$http', "WEB_API_SERVICE_URI", "$q", "$filter"];

    /* @ngInject */
    function reportManagementService($http, WEB_API_SERVICE_URI, $q, $filter) {
        /* structure from backEnd */
        this.getReportsList = getReportsList;
        this.getReportSourcesList = getReportSourcesList;
        this.getReportSourcesById = getReportSourcesById;

        this.prepareFilters = prepareFilters;
        this.prepareOptions = prepareOptions;
        this.prepareGroupBy = prepareGroupBy;
        this.getControllType = getControllType;

        this.getTableData = getTableData;
        this.initializeGrid = initializeGrid;
        this.saveReport = saveReport;
        this.getReport = getReport;
        this.deleteReport = deleteReport;

        this.downloadReport = downloadReport;

        this.onRegisterApi = onRegisterApi;
        this.getGridApi = getGridApi;
        this.validateSaveReport = validateSaveReport;
        this.getFilterValue = getFilterValue;
        this.getData = getData;
        this.getCurrentOperation = getCurrentOperation;

        var api = {};
        var parentScope;
        var getDataDown;
        var setSortValues;
        var applyReportFilters;
        var showDialog;
        var setPageInfo;

        function getReportsList(type) {
            return $http.get(WEB_API_SERVICE_URI + "reports/" + type);
        }

        function getReportSourcesList() {
            return $http.get(WEB_API_SERVICE_URI + "reports/sources?sortExpression=name%20ASC");
        }

        function getReportSourcesById(id) {
            return $http.get(WEB_API_SERVICE_URI + "reports/sources/" + id);
        }

        function prepareFilters(data) {
            data.Filters = $filter("orderBy")(data.Filters, "Name", false);
            return data.Filters;
        }

        function prepareOptions(data) {
            data.Options = $filter("orderBy")(data.Options, "Name", false);
            return data.Options;
        }

        function prepareGroupBy(data) {
            data.GroupByList = $filter("orderBy")(data.GroupByList, "Name", false);
            return data.GroupByList;
        }

        function getControllType(item) {
            if (item.SimpleItems && item.SimpleItems.length > 0) {
                return 'select';
            }
            if (item.TypeCode === "LIST" && item.IsRemoteFilter) {
                return "autocomplete";
            }
            return item.TypeCode;
        }

        function getReport(id) {
            return $http.get(WEB_API_SERVICE_URI + "reports/user-reports/" + id);
        }

        function deleteReport(id) {
            return $http({
                method: "DELETE",
                url: WEB_API_SERVICE_URI + "reports/user-reports/" + id
            });
        }

        function saveReport(obj) {

            var request = _prepareData(obj);

            request["IsPublic"] = obj.share;
            request["Name"] = obj.name;
            request["Description"] = "";
            request["ReportSourceId"] = obj.sourceid;

            if (request.reportId > 0) {
                request["UserReportId"] = obj.reportId;
            }
            return $http.post(WEB_API_SERVICE_URI + "reports/user-reports", request);
            //return $http.post(WEB_API_SERVICE_URI + "reports/user-reports/source/1/export", request);

        };

        function getTableData(obj, pageIndex) {
            var  deferred = $q.defer();

            var request = _prepareData(obj);

            var requestPromise;
            if (request.reportId > 0) {
              requestPromise = $http.get(WEB_API_SERVICE_URI + "reports/user-reports/" + request.reportId + "/load?pageSize=" + obj.pageSize + "&pageIndex=" + obj.pageIndex);
            } else {
              requestPromise = $http.post(WEB_API_SERVICE_URI + "reports/user-reports/source/" + obj.sourceid + "/load?pageSize=" + obj.pageSize + "&pageIndex=" + obj.pageIndex, request);
            }

            requestPromise.then(function (response) {
              //prepare data before return
              deferred.resolve(
                _prepareResponse(response, obj)
              );
            }, function (err) {
              deferred.reject(err);
            });

            return deferred.promise;
        }

        function addColumnWidth(item) {
            var columnWidthArr = {
                id: 100,
                Name: "*",
                prefix: 70,
                gender: 70,
                dob: 180,
                ResponsibleName: "*",
                mobile: 110,
                home_phone: 110,
                emer_phone: 110,
                Respondible: "*",
                email: "*",
                add_line_1: "*",
                add_line_2: "*",
                EmerName: "*"
            };
            item.width = item.width ? item.width : columnWidthArr[item.Code] ? columnWidthArr[item.Code] : "100";

            return item;
        }

        function initializeGrid(scope, obj, getDataDownFn, setSortValuesFn, applyReportFiltersFn, showDialogFn, setPageInfoFn) {
            parentScope = scope;
            var columns_arr = obj.columns;
            var sortValues = obj.sortValues;
            getDataDown = getDataDownFn;
            setSortValues = setSortValuesFn;
            applyReportFilters = applyReportFiltersFn;
            showDialog = showDialogFn;
            setPageInfo = setPageInfoFn;
            var groupby = obj.groupby;
            var filters = obj.allFilters;
            var selectedFilters = obj.filters;

            // { name: "number", displayName: "#", width: "40", enableSorting: false},
            var columnDefs = [];
            angular.forEach(columns_arr, function (item) {
                var dateFilter = getCellType(filters.concat(selectedFilters), item.Id) === "DATE" ? " | date:'MM/dd/yyyy'" : "";

                var obj = {
                    field: item.Code,
                    displayName: item.Name,
                    //minwidth: "90",
                    width: "*",// addColumnWidth(item).width,
                    cellTemplate: "<div class=\"ui-grid-cell-contents ng-binding ng-scope\"><span ng-cell-text><md-tooltip md-direction=\"bottom\">{{COL_FIELD"
                        + dateFilter
                        + "}}</md-tooltip>{{COL_FIELD"
                        + dateFilter
                        + "}}</span></div>"
                };

                var sortValue = getFieldSortValue(item.Code, sortValues);
                if (sortValue !== "") {
                    obj.sort = { direction: sortValue };
                }

                if (groupby !== undefined && groupby !== null && item.Name === groupby.Name) {
                    obj.grouping = { groupPriority: 1 };
                    obj.sort = { priority: 1, direction: 'asc' };
                }

                columnDefs.push(obj);
            });

            return {
                onRegisterApi: onRegisterApi,
                columnDefs: columnDefs,
                //infiniteScrollDown: true,
                //enableHorizontalScrollbar: 0,
                //enableVerticalScrollbar: 0,
                //enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                //modifierKeysToMultiSelect: false,
                //noUnselect: true,
                enableColumnMenus: false,
                //showGridFooter: true,
                ////gridFooterTemplate: footerTemplate,
                //enableExpandable: true,
                ////expandableRowTemplate: subGridTemplatePath,
                ////expandableRowScope: {
                ////  subGridVariable: "subGridScopeVariable"
                //
                enableColumnResizing: true,
                paginationPageSize: 100,
                useExternalPagination: true,
                paginationPageSizes: [100, 250, 500]
            }
        }

        function onRegisterApi(gridApi) {
            //gridApi.expandable.on.rowExpandedStateChanged(parentScope, rowExpandedStateChanged);
            //gridApi.infiniteScroll.on.needLoadMoreData(null, getDataDown);
            gridApi.core.on.sortChanged(null, function (grid, sortColumns) {
                var sortValues = [];
                angular.forEach(sortColumns, function (value) {
                    sortValues.push({ name: value.name, sortValue: value.sort.direction });
                });
                setSortValues(sortValues);
                applyReportFilters();
            });
            gridApi.pagination.on.paginationChanged(null, function (newPage, pageSize) {
                setPageInfo(pageSize, newPage - 1);
                applyReportFilters();
            });
            api = gridApi;
        }

        function getGridApi() {
            return api;
        }

        function validateSaveReport(data) {

            if (data.columns.length < 1) {
                return "Selected columns is empty";
            }
            if (data.name.length < 1) {
                return "Empty report name";
            }

            return '';
        }

        function _prepareData(obj) {
            var request = {};
            var sortValues = obj.sortValues;

            request.reportId = obj.reportId || undefined;

            //collect columns
            if (angular.isArray(obj.columns)) {
                request['Columns'] = [];
                angular.forEach(obj.columns, function (item) {
                    var obj = {
                        'ReportSourceColumnId': item.Id,
                        "SortValue": getFieldSortValue(item.Code, sortValues),
                        "SortOrder": 1,
                        "Id": item.Id
                    };
                    request['Columns'].push(obj);
                });
            }

            //collect filters
            if (angular.isArray(obj.filters)) {
                request['Filters'] = [];
                angular.forEach(obj.filters, function (item) {

                  if (item.isSelected &&
                      item.currentOption.OperationCode === "NONE") {
                    var obj = {
                      "ReportSourceColumnId": item.Id,
                      "ReportColumnOperationId": item.currentOption.Id,
                      "FilterValue": ""
                    };
                    request['Filters'].push(obj);
                    return false;
                  }

                    //check filter before send to server
                    //filter is selected
                    if (item.isSelected &&
                        //options selected
                        item.currentOption && item.currentOption.Id
                      ) {
                        var value;

                        switch (item.TypeCode) {
                            case "DATE":
                              //check on empty input
                              if(!item.currentValue) { return false; }

                              if (item.currentOption.OperationCode === "BETWEEN") {
                                  value = {
                                      DateRange: {
                                          From: getSendDate(item.currentValue),
                                          To: getSendDate(item.endDate)
                                      }
                                  };
                              } else {
                                  value = { Date: getSendDate(item.currentValue) }
                              }
                              break;

                            case "DATETIME":
                              //check on empty input
                              if(!item.currentValue) { return false; }

                              if (item.currentOption.OperationCode === "BETWEEN") {
                                    value = {
                                        DateRange: {
                                            From: getDateTime(item.currentValue),
                                            To: getDateTime(item.endDate)
                                        }
                                    };
                                } else {
                                    value = { Date: getDateTime(item.currentValue) }
                                }
                                break;

                            case "LIST":
                              //check on empty input

                              if (!(item.currentValue || (item.currentValues && item.currentValues.length))) {
                                  return false;
                              }

                              var codes = [];

                              if (item.currentValues.length > 0) {
                                  angular.forEach(item.currentValues, function(currentValue) {
                                      codes.push({"Code":currentValue.Code});
                                  });
                              } else {
                                  codes.push({"Code":item.currentValue.Code});
                              }

                              value = {
                                  List: codes
                              };
                              break;

                            default:
                              //check on empty input
                              if(angular.isUndefined(item.currentValue) || item.currentValue === "") { return false; }
                              value = { String: item.currentValue };
                        }

                        var obj = {
                            "ReportSourceColumnId": item.Id,
                            "ReportColumnOperationId": item.currentOption.Id,
                            "FilterValue": value
                        };
                        request['Filters'].push(obj);
                    }
                });
            }

            //set groupby option
            if (obj.groupby && obj.groupby.Id) {
                request['GroupByColumns'] = [{
                    'ReportSourceColumnId': obj.groupby.Id
                }];
            }

            return request;
        }

        function _prepareResponse(response, params) {
          try {
            if (response.data && response.data.ReportBody) {
              //prepare translator from RAW value to value from LIST for filters
              var ColumnListTranslator = {};
              angular.forEach(params.columns, function (column) {
                if (column.TypeCode && (column.TypeCode.toUpperCase() === "LIST")) {

                  var processFilter = function (filter) {
                    if (filter.Id === column.Id && filter.SimpleItems.length > 0) {
                      ColumnListTranslator[column.Code] = {};
                      angular.forEach(filter.SimpleItems, function (item) {
                        ColumnListTranslator[column.Code][item.Code + ""] = item.Value;
                      });
                    }
                  };

                  angular.forEach(params.allFilters, processFilter);
                  angular.forEach(params.filters, processFilter);

                }
              });

              //Go throw all rows returned from server;
              for (var i = 0; i < response.data.ReportBody.length; i++) {
                var row = response.data.ReportBody[i];

                for (var property in ColumnListTranslator) {
                  var value = row[property];
                  //check if VALUE presented in Translator object
                  if (ColumnListTranslator[property].hasOwnProperty(value)) {
                    //translate value
                    response.data.ReportBody[i][property] = ColumnListTranslator[property][value];
                  }
                }
              }

            }
          }
          catch (err) {
            console.error('Error processing translation LIST values');
            console.error(err);
          }
          return response;
        }

        function getFieldSortValue(fieldName, fields) {
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].name === fieldName) {
                    return fields[i].sortValue;
                }
            }
            return "";
        }

        function downloadReportById(id) {
            var url = WEB_API_SERVICE_URI + 'reports/user-reports/' + id + '/export';
            return $http({
                url: url,
                method: "GET",
                responseType: 'blob'
            })
              .then(function (response) {
                  //success
                  return response.data;
              }, function (responce) {
                  //error
                  return $q.reject('Error get file from server');
              });

        };

        function downloadReport(params, canceller) {

            var request = _prepareData(params);
            var httpCfg = {};

            //if get currnet report by Id
            if (request.reportId > 0) {
                httpCfg = {
                    url: WEB_API_SERVICE_URI + 'reports/user-reports/' + request.reportId + '/export',
                    method: "GET",
                    responseType: 'blob',
                    timeout: canceller.promise
                };
            } else {
                httpCfg = {
                    url: WEB_API_SERVICE_URI + "reports/user-reports/source/" + params.sourceid + "/export",
                    method: "POST",
                    data: request,
                    responseType: 'blob',
                    timeout: canceller.promise
                };
            }

            return $http(httpCfg)
              .then(function (response) {
                  //success
                  return response.data;
              }, function (responce) {
                  //error
                  return $q.reject('Error get file from server');
              });

        };

        function getFilterValue(item, objValue) {
            switch (item.TypeCode) {
                case "DATE":
                    return getDateFilterValue(item, objValue, false);
                case "DATETIME":
                    return getDateFilterValue(item, objValue, true);
                case "LIST":
                    return getListFilterValue(item, objValue);
                default:
                    item.currentValue = objValue.FilterValue.String;
                    return item;
            }
        }

        function getData(filterSourceId, value) {
            return $http.get(WEB_API_SERVICE_URI + "reports/sources/filters/" + filterSourceId + "?value=" + value);
        }

        function getCellType(filters, id) {
            var type;
            angular.forEach(filters, function (filter) {
                if (filter.Id === id) {
                    type = filter.TypeCode;
                }
            });
            return type;
        }

        function getSendDate(date) {
            var dateOptions = date.split("/");
            if (dateOptions.length === 3) {
                return dateOptions[2] + "-" + dateOptions[0] + "-" + dateOptions[1];
            }
            return "";
        }

        function getDateTime(dateTime) {

            var dateLocal = new Date(dateTime);

            var dateUtc = new Date(dateLocal.getTime() - dateLocal.getTimezoneOffset()*60*1000);

            return dateUtc.toISOString();
        }

        function getDateFilterValue(item, objValue, isDateTime) {
            if (objValue.FilterValue.Date) {
                item.currentValue = isDateTime ? getFormattedDateTime(objValue.FilterValue.Date) : getFormattedDate(objValue.FilterValue.Date);
                return item;
            } else {
                item.currentValue = isDateTime ? getFormattedDateTime(objValue.FilterValue.DateRange.From) : getFormattedDate(objValue.FilterValue.DateRange.From);
                item.endDate = isDateTime ? getFormattedDateTime(objValue.FilterValue.DateRange.To) : getFormattedDate(objValue.FilterValue.DateRange.To);
                return item;
            }
        }

        function getFormattedDate(date) {
            var dateTimeOptions = date.split("T");
            var dateOptions = dateTimeOptions[0].split("-");
            var formattedDate = dateOptions[1] + "/" + dateOptions[2] + "/" + dateOptions[0];
            return formattedDate;
        }

        function getFormattedDateTime(date) {

          //create the time in UTC instead of the local timezone
          var amUtcDate = $filter("amUtc")(date);

          //return US format for datetime picker
          return $filter("amDateFormat")(amUtcDate, "MM/DD/YYYY");

        }

        function getListFilterValue(item, objValue) {

          //AUTOCOMPLITE
          if(item.controllType === "autocomplete") {
            item.currentValues = objValue.FilterValue.List;
            return item;
          }

          //SELECT
          if (objValue.FilterValue.List && objValue.FilterValue.List.length > 1) {
                angular.forEach(item.SimpleItems, function(value) {
                    angular.forEach(objValue.FilterValue.List, function(code) {
                        if (value.Code === code.Code) {
                            item.currentValues.push(value);
                        }
                    });
                });
                item.isMupltiple = true;
            } else {
                angular.forEach(item.SimpleItems, function (value) {
                    if (objValue.FilterValue && objValue.FilterValue.List && objValue.FilterValue.List[0] && value.Code === objValue.FilterValue.List[0].Code) {
                        item.currentValue = value;
                    }
                });
                item.isMupltiple = false;
            }
            return item;
        }

        function getCurrentOperation(operations) {
            for (var i = 0; i < operations.length; i++) {
                if (operations[i].Name === "is") {
                    return operations[i];
                }
            }
            return {};
        }
    }
})();
