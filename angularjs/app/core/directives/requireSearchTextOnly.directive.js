(function () {
    "use strict";

    angular
        .module("app")
        .directive("requireSearchTextOnly", requireSearchTextOnly);

    /* @ngInject */
    function requireSearchTextOnly($timeout) {
        return {
            restrict: 'A',
            require: '^form',
            link: function (scope, element, attr, ctrl) {
                $timeout(function () {
                    var isValid = false;
                    var possibleSubForm = Object.keys(ctrl).find(function(k){ return ~k.indexOf("infiniteAutoCompleteForm") });
                    var elemCtrl = possibleSubForm ? ctrl[possibleSubForm][attr.mdInputName] : ctrl[attr.mdInputName];
                    var realValidation = function (model) {
                        if (elemCtrl) {
                            elemCtrl.$setValidity('searchTextRequired', isValid);
                        }
                        return model;
                    };

                    scope.$watch(attr.mdSearchText, function (obj) {
                        isValid = !!obj;
                        realValidation();
                    });

                    if (elemCtrl !== undefined) {
                        elemCtrl.$parsers.push(realValidation);
                    }
                });
            }
        };
    }
})();
