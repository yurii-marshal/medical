(function () {
    "use strict";

    angular
        .module("app.calendar")
        .directive("accordeonWizardDirective", accordeonWizardDirective);

    function accordeonWizardDirective() {
        return {
            restrict: 'A',
            scope: {
                clearOnClick: "="
            },
            link: function(scope, elem, attr) {
                $(elem).click(function() {
                    if (scope.clearOnClick !== undefined){
                        scope.clearOnClick = "";
                        scope.$apply();
                    }
                    var input = elem.parent().find('input[type=text]')[0];
                    input.value = '';
                });
            }
        };
    }
})();