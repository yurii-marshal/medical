(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("summaryEdit", summaryEditDirective);

    function summaryEditDirective() {
        var directive = {
            restrict: "E",
            scope: {
                sref: "@"
            },
            templateUrl: "calendar/views/templates/summaryEdit.html"
        };
        return directive;
    }
})();