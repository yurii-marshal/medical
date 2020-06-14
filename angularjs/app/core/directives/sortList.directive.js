(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("sortList", sortList);

    function sortList() {
        return {
            restrict: 'EA',
            templateUrl: "core/views/templates/sortListTemplate.html",
            scope: {
                columnName: "@",
                isSortByAsc: "=",
                sortFunction: "&"
            }
        };
    }
})();

