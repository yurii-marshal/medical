(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("startRangeValidator", startRangeValidator);

    function startRangeValidator() {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {
                endRange: "="
            },
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(function() {
                    return scope.endRange;
                }, function() {
                    var valid = true;
                    if (scope.endRange !== "" && scope.endRange !== undefined) {
                        valid = +elem.val() <= +scope.endRange;
                    }
                    ctrl.$setValidity("startRange", valid);
                });

                ctrl.$parsers.unshift(function (value) {
                    var valid = true;
                    if (value !== "" && value !== undefined && scope.endRange !== "" && scope.endRange !== undefined) {
                        valid = +value <= +scope.endRange;
                    }
                    ctrl.$setValidity("startRange", valid);

                    return value;
                });
            }
        };
        return directive;
    }
})();