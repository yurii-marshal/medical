(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("endTimeValidator", endTimeValidator);

    endTimeValidator.$inject = ['$timeout'];

    function endTimeValidator($timeout) {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {
                startTime: "=",
                onTimeChange: "=?"
            },
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(function () {
                    return scope.startTime;
                }, function () {
                    var valid = true;
                    if (scope.startTime !== "" && scope.startTime !== undefined) {
                        var endTime = moment(elem.val(), "HH:mm A").toDate();
                        var startTime = moment(scope.startTime, "HH:mm A").toDate();
                        valid = startTime < endTime;
                    }
                    ctrl.$setValidity("endTime", valid);
                });

                ctrl.$parsers.unshift(function (value) {
                    if(scope.onTimeChange) {
                        scope.onTimeChange(value);
                    }

                    $timeout(function () {
                        _parserFunction(value);
                    }, 0);

                    return value;
                });

                function _parserFunction(value) {
                    var valid = true;
                    if (value !== "" && value !== undefined && scope.startTime !== "" && scope.startTime !== undefined) {
                        var endTime = moment(value, "HH:mm A").toDate();
                        var startTime = moment(scope.startTime, "HH:mm A").toDate();
                        valid = startTime < endTime;
                    }
                    ctrl.$setValidity("endTime", valid);
                }
            }
        };
        return directive;
    }
})();
