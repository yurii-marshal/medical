(function() {
    "use strict";

    angular
        .module("app")
        .directive("showOnFill", showOnFillDirective);

    function showOnFillDirective() {
        'use strict'

        var findInput = function(elem) {
            if (elem === undefined)
                throw new Error("[Error] elem cannot be undefined.");

            //var parent = $(elem.parent()[0]);
            //var autocomplete = $(parent.children()[0]);
            var autocomplete = $(elem.parent()[0]);
            return autocomplete.find('input')[0];
        };

        return{
            restrict: "A",
            link: function(scope, elem) {
                elem.addClass('ng-hide');

                var inputWatch = scope.$watch(function() {
                    return findInput(elem);
                }, function(newValue) {
                    if (newValue !== undefined && !angular.isArray(newValue) && newValue !== null) {

                        scope.$watch(function() {
                            return newValue.value;
                        }, function(newValue) {
                            if (newValue === undefined)
                                return;

                            if (newValue.length > 0) {
                                elem.removeClass('ng-hide');
                            } else {
                                elem.addClass('ng-hide');
                            }
                        });
                        inputWatch();
                    }
                });
            }
        }
    }

})();