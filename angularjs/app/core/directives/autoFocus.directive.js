(function() {
    "use strict";

    angular
        .module("app.core")
        .directive("autoFocus", autoFocusDirective);

    /* @ngInject */
    function autoFocusDirective($timeout) {
        return {
            restrict: 'A',
            link: function($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                });
            }
        }
    }
})();