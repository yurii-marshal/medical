(function () {
    "use strict";

    angular
        .module("app.core")
        .service("infinityTableService", infinityTableService)
        .service("infinityTableFilterService", infinityTableFilterService)
        .directive('infinityTable', infinityTableDirective);

    /* @ngInject */
    function infinityTableDirective(bsLoadingOverlayService,
                                    $timeout,
                                    $window,
                                    infinityTableService,
                                    $q) {
        return {
            restrict: 'E',
            scope: {
                loadItemsPromise: "=",
                pageIndex: "=?",
                pageSize: "=?",
                ignoreTotalCount: '=?',
                cacheFiltersKey: '=?',
                rewriteCacheFilters: '=?',
                itemAlias: "@?",
                filtersObj: "=?",
                sortObj: "=?",
                defaultSortField: "=?",
                defaultSortValue: "=?",
                parentContainer: "@?"
            },
            transclude: {
                'filters': '?infinityTableFilters',
                'row': 'infinityTableRow',
                'sort': '?infinityTableSort',
                'noEntries': '?infinityTableNoItems'
            },
            templateUrl: 'core/views/templates/infinityTable.html',
            link: function (scope, iElement, iAttrs, ctrl) {
                infinityTableService.reload = reload;
                infinityTableService.deleteRowById = deleteRowById;
                infinityTableService.setDefaultSort = setDefaultSort;
                infinityTableService.getSelectedAllValue = function () { return ctrl.isSelectAll; }
                infinityTableService.getSelectedItemsCount = function () {
                    return ctrl.isSelectAll ? ctrl.totalCount : ctrl.selectedItems.length;
                };
                infinityTableService.getSelectedItems = function () { return ctrl.selectedItems; };
                infinityTableService.getTotalCount = function () { return ctrl.totalCount; };
                infinityTableService.toggleItem = ctrl.toggleItem;
                infinityTableService.selectAllFn = ctrl.selectAllFn;
                infinityTableService.hasConfirmDialogOpened = function () { return $('.drwz-confirm-container').length > 0; };

                var isDestroyed = false;

                function deleteRowById(guid) {
                    iElement.find('#' + guid).remove();
                    ctrl.checkHeight();
                }

                function reload() {
                    if (isDestroyed) return;
                    ctrl.resetParams();
                    iElement.find('infinity-table-row').each(destroyScope).remove();
                    iElement.find('infinity-table-no-items').remove();
                    $timeout(function () {
                        ctrl.pageChanged();
                    }, 0);
                }

                function destroyScope() {
                    if(angular.element(this).scope()){
                        angular.element(this).scope().$destroy();
                    }
                }

                // setting default sorting if not selected by user
                function setDefaultSort() {
                    if (!ctrl.sortObj || !ctrl.defaultSortField) {
                        return;
                    }
                    if (ctrl.defaultSortValue === undefined) {
                        ctrl.defaultSortValue = true;
                    }

                    var hasFilter = false;
                    for (var prop in ctrl.sortObj) {
                        if (ctrl.sortObj.hasOwnProperty(prop) && ctrl.sortObj[prop] !== undefined) {
                            hasFilter = true;
                        }
                    }
                    if (!hasFilter) {
                        ctrl.sortObj[ctrl.defaultSortField] = ctrl.defaultSortValue;
                    }

                }

                scope.$on('$destroy', function () {
                    isDestroyed = true;
                    ctrl.disableLoading = true;
                    bsLoadingOverlayService.stop({referenceId: 'infiniteTable'});
                });
            },
            controllerAs: "$ctrl",
            controller: function ($scope, $element, $attrs, $transclude) {
                var elemTable = $element.find('.infinity-table');
                var elemLoading = $element.find('.loading');

                var itemLoadIndex = 0;

                var ctrl = this;

                ctrl.itemAlias = $scope.itemAlias || 'item';
                ctrl.cacheFiltersKey = $scope.cacheFiltersKey;
                ctrl.pageIndex = $scope.pageIndex || 0;
                ctrl.pageSize = $scope.pageSize || 10;
                ctrl.ignoreTotalCount = !!$scope.ignoreTotalCount;
                if (ctrl.cacheFiltersKey && $scope.rewriteCacheFilters) {
                    infinityTableService.removeSavedState(ctrl.cacheFiltersKey);
                }
                ctrl.sortObj = Object.assign(
                    $scope.sortObj || {},
                    ctrl.cacheFiltersKey ? infinityTableService.getSavedSorting(ctrl.cacheFiltersKey) : {}
                );
                ctrl.filtersObj = Object.assign(
                    $scope.filtersObj || {},
                    ctrl.cacheFiltersKey ? infinityTableService.getSavedFilters(ctrl.cacheFiltersKey) : {}
                );
                ctrl.loadItemsPromise = $scope.loadItemsPromise;
                ctrl.defaultSortField = $scope.defaultSortField;
                ctrl.defaultSortValue = $scope.defaultSortValue === 'false' ? false : true;
                ctrl.parentContainer = $scope.parentContainer || undefined;

                ctrl.items = [];
                ctrl.disableLoading = false;
                ctrl.isLoading = false;
                ctrl.isSelectAll = false;
                ctrl.selectedItems = [];
                ctrl.totalCount = 0;


                //param for stop send requests if server return empty array
                var maxEmptyResponses = 3;
                var countEmptyResponse = 0;

                //when reload table
                ctrl.resetParams = function () {
                    itemLoadIndex = 0;

                    ctrl.pageIndex = 0;
                    ctrl.items = [];
                    ctrl.disableLoading = false;
                    ctrl.isLoading = false;

                    ctrl.isSelectAll = false;
                    ctrl.selectedItems = [];
                    ctrl.totalCount = 0;

                    countEmptyResponse = 0;
                    infinityTableService.setDefaultSort();
                    //stop waiting current $http request if it is exist
                    if (typeof ctrl.resolveCurrentRequest === "function") {
                        ctrl.resolveCurrentRequest();
                    }
                };

                /* start select & selectAll statement */
                ctrl.toggleItem = function (item) {
                    var itemPos = _.findIndex(ctrl.selectedItems, function (o) { return o.guid === item.guid; });
                    if (itemPos === -1) {
                        item.isSelected = true;
                        ctrl.selectedItems.push(item);
                        if (ctrl.selectedItems.length === ctrl.totalCount) {
                            ctrl.isSelectAll = true;
                        }
                    } else {
                        if (ctrl.isSelectAll) {
                            ctrl.isSelectAll = false;
                        }
                        item.isSelected = false;
                        ctrl.selectedItems.splice(itemPos, 1);
                    }
                };

                ctrl.selectAllFn = function () {
                    ctrl.isSelectAll = !ctrl.isSelectAll;
                    //select all items
                    ctrl.items.map(function (item) {
                        if (ctrl.isSelectAll !== item.isSelected) {
                            ctrl.toggleItem(item);
                        }
                    });
                };

                /* end select & selectAll statement */

                infinityTableService.setDefaultSort();
                //compile templates
                var templateSort = $transclude($scope, function () {
                }, function () {
                }, 'sort');
                if (templateSort) {
                    elemTable.append(templateSort);
                }

                //compile templates
                var templateFilter = $transclude($scope, function () {
                }, function () {
                }, 'filters');
                if (templateFilter) {
                    elemTable.append(templateFilter);
                }

                ctrl.checkHeight = function () {
                    if ($window.outerHeight > $element.outerHeight()) {
                        ctrl.pageChanged();
                    }
                };

                ctrl.pageChanged = function () {
                    if (ctrl.disableLoading) {
                        return;
                    }
                    if (ctrl.isLoading) {
                        return;
                    }
                    if (countEmptyResponse >= maxEmptyResponses) {
                        return;
                    }

                    //Case when filters clear reload many times per 1-2 sec and responses duplicates in the table
                    //For prevent this situation let's use promises
                    var getItemsPromise = function () {
                        var defer = $q.defer();

                        ctrl.isLoading = true;
                        ctrl.loadItemsPromise(ctrl.pageIndex, ctrl.pageSize)
                            .then(function (res) {
                                defer.resolve(res);
                            }, function (err) {
                                ctrl.isLoading = false;
                                ctrl.disableLoading = true;

                                //no results
                                $transclude(function (transEl) {
                                    $element.append(transEl);
                                }, elemTable, 'noEntries');

                                defer.reject('');
                            });

                        ctrl.resolveCurrentRequest = function () {
                            defer.reject('');
                        };

                        return defer.promise;
                    };
                    /* end implementation */

                    return getItemsPromise()
                        .then(fetchResultToView)
                        .then(function (items) {
                            ctrl.isLoading = false;

                            //bug when list.height is short than screen.height and infinity-scroll
                            //don't load new data because scroll event isn't triggered
                            //response has Items and it's not empty array
                            if (items && angular.isArray(items) && items.length === ctrl.pageSize) {
                                $timeout(function () {
                                    ctrl.checkHeight();
                                }, 0);
                            }
                        });

                };

                function fetchResultToView(result) {
                    if (!result) throw new Error('Result is empty.');
                    if (!result.data) throw new Error('No property ".data" in result');
                    var items = result.data.Items;
                    // we need this default totalCount = 999999 because of improving orders list
                    // orders list was written on core microservice with MySQL, and was lagging while loading and filtering
                    // the reason of that is long time calculating totalCount. Other lists using server totalCount
                    // in future, when MySQL will be changed with PostgreSQL - it will be useless.
                    ctrl.totalCount = ctrl.ignoreTotalCount ? 999999 : result.data.Count;

                    _.map(items, function (item) {
                        item.guid = guid();
                        if (ctrl.isSelectAll || item.isSelected) {
                            item.isSelected = true;
                            ctrl.selectedItems.push(item);
                        }

                        item.index = ++itemLoadIndex;
                        attachItemToDOM(item);
                        return item;
                    });

                    if (ctrl.totalCount && ctrl.selectedItems.length === ctrl.totalCount) {
                        ctrl.isSelectAll = true;
                    }

                    // all results are displayed
                    if (ctrl.ignoreTotalCount) {
                        if (items.length < ctrl.pageSize) {
                            ctrl.disableLoading = true;
                            bsLoadingOverlayService.stop({ referenceId: 'infiniteTable' });
                        }
                    } else {
                        if ((ctrl.pageIndex + 1) * ctrl.pageSize >= ctrl.totalCount) {
                            ctrl.disableLoading = true;
                            bsLoadingOverlayService.stop({ referenceId: 'infiniteTable' });
                        }
                    }

                    // no results
                    if (!items || items.length < 1) {
                        countEmptyResponse++;

                        // add label 'no entries'
                        if (ctrl.pageIndex === 0) {
                            $transclude(function (transEl) {
                                $element.append(transEl);
                            }, elemTable, 'noEntries');
                        }
                    }

                    ctrl.pageIndex++;

                    function attachItemToDOM(item) {
                        var scope = $scope.$new(true, $scope.$parent);
                        // TODO: find out, why do we copy this elements
                        scope[ctrl.itemAlias] = angular.copy(item);

                        ctrl.items.push(scope[ctrl.itemAlias]);

                        $transclude(scope, function (transEl) {
                            transEl[0].id = item.guid;
                            elemTable.append(transEl);
                        }, elemTable, 'row');

                    }

                    return items;
                }

                $scope.$watch(function() {
                    return ctrl.filtersObj;
                }, function(val) {
                    if (ctrl.cacheFiltersKey) {
                        infinityTableService.saveFilters(ctrl.cacheFiltersKey, val);
                    }
                    if (val) {
                        infinityTableService.reload();
                    }
                }, true);

                $scope.$watch(function() {
                    return ctrl.sortObj;
                }, function(val) {
                    if (ctrl.cacheFiltersKey) {
                        infinityTableService.saveSorting(ctrl.cacheFiltersKey, val);
                    }
                }, true);

                $scope.$watch(function () {
                    return ctrl.isLoading;
                }, function (val) {
                    if (val) {
                        elemLoading.css('display', 'block');
                        bsLoadingOverlayService.start({referenceId: 'infiniteScroll'});
                    } else {
                        elemLoading.css('display', 'none');
                        bsLoadingOverlayService.stop({referenceId: 'infiniteScroll'});
                    }
                });

            }
        }
    }

    function infinityTableService() {
        this.reload = function () {};
        this.deleteRowById = function () {};
        this.setDefaultSort = function () {};
        this.getSelectedItems = function () {};
        this.getSelectedAllValue = function () {};
        this.getTotalCount = function () {};
        this.getSelectedItemsCount = function () {};
        this.toggleItem = function () {};
        this.selectAllFn = function () { };
        this.hasConfirmDialogOpened = function() {};

        this.savedFilters = {};
        this.savedSorting = {};
        this.saveFilters = function(key, filtersObj) {
            this.savedFilters[key] = filtersObj;
        };
        this.removeSavedState = function(key) {
            delete this.savedFilters[key];
            delete this.savedSorting[key];
        };
        this.resetSavedState = function() {
            this.savedFilters = {};
            this.savedSorting = {};
        };
        this.saveSorting = function(key, sortObj) {
            this.savedSorting[key] = sortObj;
        };
        this.getSavedFilters = function(key) {
            return this.savedFilters[key] || {};
        };
        this.getSavedSorting = function(key) {
            return this.savedSorting[key] || {};
        };

        return this;
    };

    function infinityTableFilterService() {
        this.getFilters = getFilters;
        this.getSortExpressions = getSortExpressions;
        return this;

        function getFilters(filters) {
            var filters = filters || {};
            var objToFiler = angular.copy(filters);

            //filter empty values
            angular.forEach(objToFiler, function (value, key) {
                if (value === undefined || value === null || value === '') {
                    delete objToFiler[key];
                }
            });

            return objToFiler;
        }

        function getSortExpressions(obj) {
            for (var name in obj) {
                if (obj[name] !== undefined)
                    return name + (obj[name] ? " ASC" : " DESC");
            }
            return undefined;
        };
    };
})();
