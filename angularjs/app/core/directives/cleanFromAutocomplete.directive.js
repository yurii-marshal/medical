(function () {
    "use strict";

    angular
      .module("app")
      .directive("cleanAutocomplete", cleanFromAutocompleteDirective);


function cleanFromAutocompleteDirective(){
    'use strict';

    return {
        restrict: "A",
        scope: {
            searchedText: "=",
            cleanModel: "=",
            additionalCleanModels: "=",
            additionalCleanText: "="
        },
        link: function(scope, elem) {

            elem.click(function() {
                scope.cleanModel = null;
                scope.searchedText = undefined;
                scope.additionalCleanText = undefined;

                if (scope.additionalCleanModels != undefined) {
                    if (!angular.isArray(scope.additionalCleanModels))
                        throw new Error("[Error] additionalCleanModels must have array type.");

                    for (var i in scope.additionalCleanModels) {
                        scope.additionalCleanModels[i] = null;
                    }
                }
                scope.$apply();
            });
        }
    }
}

})();
