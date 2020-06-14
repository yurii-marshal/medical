(function () {
    "use strict";

    angular
        .module("app.reports")
        .directive("onlyDigits", onlyDigits);

    function onlyDigits() {
        var directive = {
            restrict: "EA",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    var spiltArray = String(newValue).split("");
                    if (spiltArray.length === 0) return;

                    if (isNaN(newValue) || newValue.indexOf(".") !== -1) {
                        ngModel.$setViewValue(oldValue);
                        ngModel.$render();
                    }
                });
            }
        };
        return directive;
    }
})();