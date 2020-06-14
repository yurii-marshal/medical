(function () {
    "use strict";

    angular
        .module("app.calendar")
        .directive("switchYesNo", switchYesNo);

    function switchYesNo() {

        var directive = {
            restrict: 'E',
            scope: {
                switchModel: "=",
                additionalClass: "@",
                switchDisabled: "=",
                change: "&"
            },
            templateUrl: "core/views/templates/switchYesNo.html",
            link: function (scope, element) {
                $(element).find('.switch-with-text').addClass(scope.additionalClass);
            }
        };
        return directive;
    }
})();
