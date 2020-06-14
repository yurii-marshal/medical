(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("startDateValidator", startDateValidator);

    function startDateValidator($timeout) {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {
                endDate: "="
            },
            link: function (scope, elem, attr, ctrl) {

                function checkDatesValid(_start, _end) {
                    if(_start && _end) {
                        var startDate = moment(_start, "MM/DD/YYYY").toDate();
                        var endDate = moment(_end, "MM/DD/YYYY").toDate();
                        return startDate <= endDate;
                    }
                    return true;
                }

                scope.$watch(function() {
                    return scope.endDate;
                }, function() {
                    var valid = checkDatesValid(elem.val(), scope.endDate);
                    $timeout(function () {
                        ctrl.$setValidity("startDate", valid);
                    }, 0);
                });

                ctrl.$parsers.unshift(function (value) {
                    var valid = checkDatesValid(value, scope.endDate);
                    ctrl.$setValidity("startDate", valid);
                    return value;
                });
            }
        };
        return directive;
    }
})();
