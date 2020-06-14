(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("digestWatcher", digestWatcher);

    /* @ngInject */
    function digestWatcher($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, elem) {
                let count = 0,
                    tmpl = `<div class="digest-counter"></div>`,
                    container;

                if (!elem.find('.digest-counter').length) {
                    elem.append(tmpl);
                    container = document.getElementsByClassName('digest-counter')[0];
                }

                function countDigests() {
                    count++;
                    container.innerHTML = `$digests: <b>${count}</b>`;
                }

                if (document.URL.indexOf('http://localhost') !== -1) {
                    $rootScope.$watch(countDigests);
                }

                $rootScope.$on('$stateChangeSuccess', _ => count = 0);
            }
        };
    }
})();