(function () {
    "use strict";

    angular
        .module("app")
        .component('sidebarMenu', {
            templateUrl: 'core/views/templates/components/sidebarMenu.html',
            controller: sidebarMenuCtrl,
            bindings: {
                items: "=",
                showTooltip: "="
            }
        });

    /* @ngInject */
    function sidebarMenuCtrl($scope, $state, $timeout) {

        var $ctrl = this;

        function activate() {
            categotyActive();
        }

        $ctrl.goTo = function (state) {
            $state.go(state);
        };

        $ctrl.isActive = function (link) {
            var state = link.menu_state || link.state,
                name = link.name;

            if ($state.current.name.indexOf(state) !== -1
                && (($state.current.name.indexOf(state) + state.length === $state.current.name.length)
                || ($state.params.leftMenu && $state.params.leftMenu === name))) {
                link.active = true;
                return true;
            } else {
                link.active = false;
                return false;
            }
        }

        $scope.$on('$stateChangeSuccess', function() {
            categotyActive();
        });

        function categotyActive() {
            $timeout(function () {
                angular.forEach($ctrl.items, function (item) {
                    item.active = false;
                });

                angular.forEach($ctrl.items, function (item) {
                    var hasActive = false;
                    angular.forEach(item.items, function (link) {
                        if (!hasActive && link.active) {
                            hasActive = true;
                            item.active = true;
                        }
                    });
                });

            }, 500);
        }

        activate();
    }

})();
