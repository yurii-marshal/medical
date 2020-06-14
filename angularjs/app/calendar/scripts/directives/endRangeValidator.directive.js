(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("endRangeValidator", endRangeValidator);

    function endRangeValidator() {
        var directive = {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                startRange: '=',
                disableEqual: '<'
            },
            link: function(scope, elem, attr, ctrl) {
                var isEmpty = function(value) {
                    return value === undefined || value === null || value === '';
                };
                var validate = function(value) {
                    var isValid = true;
                    if (!isEmpty(value) && !isEmpty(scope.startRange)) {
                        isValid = scope.disableEqual ?
                            (+value > +scope.startRange) :
                            (+value >= +scope.startRange);
                    }
                    ctrl.$setValidity('endRange', isValid);
                };
                scope.$watch(function() {
                    return scope.startRange;
                }, function() {
                    validate(elem.val());
                });

                ctrl.$parsers.unshift(function(value) {
                    validate(value);

                    return value;
                });
            }
        };
        return directive;
    }
})();