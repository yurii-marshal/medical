(function() {
    "use strict";

    angular
        .module("app.calendar")
        .directive("notLessCurrDate", notLessCurrentDateValidator);

    function notLessCurrentDateValidator() {
        var directive = {
            restrict: "A",
            require: "ngModel",
            link: function(scope, elem, attr, ctrl) {
                ctrl.$parsers.unshift(function(value) {
                    var valid = true;
                    if (value !== "" && value !== undefined) {
                        var currentDate = new Date().setHours(0, 0, 0, 0);
                        var date = new Date(value).setHours(0, 0, 0, 0);
                        valid = currentDate <= date;
                    }
                    ctrl.$setValidity("notLessCurrentDate", valid);

                    return value;
                });
            }
        };
        return directive;
    }
})();