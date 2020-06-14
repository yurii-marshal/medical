(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("copdValidator", copdValidator);

    function copdValidator() {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {
                validated: "=",
                tests: "="
            },
            link: function (scope, elem, attr, ctrl) {
                scope.$watch(function () {
                    return scope.tests;
                }, function () {
                    var valid = !scope.validated || !_.some(scope.tests, function (test) {
                        return test.Value === undefined;
                    });
                    ctrl.$setValidity("copd", valid);
                }, true);

                scope.$watch(function () {
                    return scope.validated;
                }, function () {
                    var valid = !scope.validated || !_.some(scope.tests, function (test) {
                        return test.Value === undefined;
                    });
                    ctrl.$setValidity("copd", valid);
                }, true);
            }
        };
        return directive;
    }
})();