(function () {
    "use strict";

    angular
        .module("app.calendar")
        .directive("onlyDigitsWithLength", onlyDigitsWithLength);

    function onlyDigitsWithLength() {

        var directive = {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                maxLength: "=?",
                max: "=?",
                min: "=?"
            },
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return '';

                    if (typeof inputValue === "number") {
                        inputValue = inputValue.toString();
                    }

                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (scope.maxLength && transformedInput.length > scope.maxLength) {
                        transformedInput = transformedInput.slice(0, scope.maxLength);
                    }
                    if (scope.max) {
                        if (parseInt(transformedInput) > scope.max) {
                            transformedInput = scope.max.toString();
                        }
                    }
                    if (scope.min) {
                        if (parseInt(transformedInput) < scope.min) {
                            transformedInput = scope.min.toString();
                        }
                    }
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
        return directive;
    }
})();
