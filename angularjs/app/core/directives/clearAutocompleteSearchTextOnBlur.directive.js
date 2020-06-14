(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('clearAutocompleteSearchTextOnBlurDirective', clearAutocompleteSearchTextOnBlurDirective);

    /* @ngInject */
    function clearAutocompleteSearchTextOnBlurDirective($timeout) {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                searchText: '='
            },
            link: function(scope, element) {
                var onBlur = function(event) {
                    if (event.target.getAttribute('aria-expanded') !== 'true') {
                        scope.searchText = '';
                        scope.$apply();
                    }
                };

                $timeout(function() {
                    element.find('.md-input').on('blur', onBlur);
                });

                scope.$on('$destroy', function() {
                    element.find('.md-input').off('blur', onBlur);
                });
            }
        };
    }
})();
