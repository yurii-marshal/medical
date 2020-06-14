(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("startTimeValidator", startTimeValidator);

    startTimeValidator.$inject = ['$timeout'];

    function startTimeValidator($timeout) {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {
                endTime: "=",
                onTimeChange: "="
            },
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(function () {
                    return scope.endTime;
                }, function () {
                    var valid = true;
                    if (scope.endTime !== "" && scope.endTime !== undefined) {
                        var startTime = moment(elem.val(), "HH:mm A").toDate();
                        var endTime = moment(scope.endTime, "HH:mm A").toDate();
                        valid = startTime < endTime;
                    }
                    ctrl.$setValidity("startTime", valid);
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
                    if (value !== "" && value !== undefined && scope.endTime !== "" && scope.endTime !== undefined) {
                        var startTime = moment(value, "HH:mm A").toDate();
                        var endTime = moment(scope.endTime, "HH:mm A").toDate();
                        valid = startTime < endTime;
                    }
                    ctrl.$setValidity("startTime", valid);
                }
            }
        };
        return directive;
    }
})();
