(function() {
    "use strict";

    angular
        .module("app")
        .directive("mdAutocompleteRequired", mdAutocompleteRequired);

    /* @ngInject */
    function mdAutocompleteRequired($timeout) {
        var directive = {
            restrict: "A",
            require: "^form",
            link: function(scope, element, attr, ctrl) {
                // is Infinite Autocomplete
                var subFormName = "";
                if (element[0].tagName.toLowerCase() === 'md-autocomplete-with-infinite-scroll') {
                    subFormName = element.find("md-autocomplete-wrap").attr("ng-form");
                }

                if (subFormName) {
                    $timeout(function() {

                        // I know this solution is not perfect but this directive is very old and I afraid something breaking
                        if (subFormName && !ctrl[subFormName] ||
                            !subFormName && !ctrl[attr.mdInputName]
                        ) {
                            return ;
                        }

                        var realModel = undefined;

                        var elemCtrl = subFormName ? ctrl[subFormName][attr.mdInputName] : ctrl[attr.mdInputName];

                        var required = attr.ngRequired === "true";

                        var realValidation = function(model) {
                            elemCtrl.$setValidity("selected", required ? !!realModel : (realModel ? !!realModel : !model));
                            return model;
                        };

                        scope.$watch(attr.mdSelectedItem, function(obj) {
                            realModel = obj;
                            realValidation();
                        });

                        if (elemCtrl !== undefined) {
                            elemCtrl.$parsers.push(realValidation);
                        }
                   }, 500);
                }
            }
        };
        return directive;
    }
})();
