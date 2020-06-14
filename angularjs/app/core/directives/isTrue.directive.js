(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("isTrue", isTrueValidator);

    function isTrueValidator() {
        var directive = {
            restrict: "A",
            require: "ngModel",
            scope: {},
            link: function (scope, elem, attr, ctrl) {
                ctrl.$formatters.unshift(function (value) {
                    var valid = value === "true";
                    ctrl.$setValidity("isTrue", valid);

                    return value;
                });
            }
        };
        return directive;
    }
})();