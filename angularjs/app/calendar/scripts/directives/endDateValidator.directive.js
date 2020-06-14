(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("endDateValidator", endDateValidator);

    function endDateValidator($timeout) {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {
                startDate: "="
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

                scope.$watchCollection(function () {
                    return [scope.startDate, ctrl.$modelValue];
                }, function() {
                    var valid = checkDatesValid(scope.startDate, elem.val());
                    $timeout(function () {
                        ctrl.$setValidity("endDate", valid);
                    }, 0);
                });

                ctrl.$parsers.unshift(function (value) {
                    var valid = checkDatesValid(scope.startDate, value);
                    ctrl.$setValidity("endDate", valid);
                    return value;
                });
            }
        };
        return directive;
    }
})();
