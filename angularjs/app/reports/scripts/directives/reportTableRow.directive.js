(function () {
    'use strict';

    angular
        .module('app.reports')
        .directive('reportTableRow', function ($compile, $filter) {
            return {
                restrict: 'A',
                link: reportTableRowCtrl,
                scope: {
                    items: '=',
                    columns: '=',
                    rowIndex: '@'
                },
                replace: true
            };

            function reportTableRowCtrl($scope, $element, $attrs) {
                var rowItems = [];
                var amUtc = $filter('amUtc');
                var amDateFormat = $filter('amDateFormat');
                var localDateTime = $filter('localDateTime');
                rowItems.push($scope.rowIndex + '.');
                //Check all columns and collect data
                angular.forEach($scope.columns, function (attrName) {
                    var val = ($scope.items[attrName.Code]);
                    var isPhone =
                        val
                        && val.length === 10
                        && (attrName.Code.toLowerCase().indexOf('tel') > -1
                        || attrName.Code.toLowerCase().indexOf('fax') > -1
                        || attrName.Code.toLowerCase().indexOf('mobile') > -1
                        || attrName.Code.toLowerCase().indexOf('phone') > -1);

                    switch (attrName.TypeCode) {
                        case 'DATE':
                            var _val = angular.copy(val);
                            val = amUtc(val);
                            val = amDateFormat(val, 'MM/DD/YYYY');
                            val = attrName.Code === 'ModifiedOn' ? '<nobr>' + val + " " + localDateTime(_val, 'hh:mm A') +  '</nobr>': '<nobr>' + val +  '</nobr>';
                            break;
                        case 'DATETIME':
                            val = localDateTime(val, 'MM/DD/YY hh:mm A');
                            val = '<nobr>' + val + '</nobr>';
                            break;
                        default:
                            //if server response boolean type
                            if (typeof val === 'boolean') {
                                val = val ? 'Yes' : 'No';
                            } else if (isPhone) {
                                val = $filter('tel')(val);
                            } else if (val === null) {
                                val = "";
                            }
                            break;
                    }

                    rowItems.push(val);
                });

                //Wrap data in "td", prepare for draw table-row inner HTML
                var innerHtml = rowItems.map(function (item, index) {
                    return '<td class="' + (index === 0 ? "number-cell" : "") + '">' + item + '</td>';
                }).join('');

                //Add HTML to DOM
                $element.append(innerHtml);
            }
        });
})();
