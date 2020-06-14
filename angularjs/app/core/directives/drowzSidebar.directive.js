(function () {
    "use strict";

    angular
        .module("app")
        .directive("drowzSidebar", drowzSidebar);

    /* @ngInject */
    function drowzSidebar($timeout, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                drowzSidebarName: '@?',
                drowzSidebarWatch: '=?',
                drowzSidebarHidden: '=?'
            },
            link: function(scope, element, attr) {

                scope.drowzSidebarHidden = false;
                scope.drowzSidebarName = scope.drowzSidebarName || '';

                function init() {
                    // init directive after all elements ready
                    $timeout(function () {

                        var sc = $(element),                                // Sidebar Container
                            sb = sc.find('.sidebar'),                       // Sidebar
                            sbc = sb.find('.sidebar-content'),              // Sidebar Content
                            btn = sb.find('.toggle-menu-slide'),            // Sidebar Toggle Button
                            mc = sc.find('.main-content');                  // Main Content

                        btn.on('click', toggleFixedMenu);

                        if (localStorage[scope.drowzSidebarName + "_menuOpened"]) {
                            if (localStorage[scope.drowzSidebarName + "_menuOpened"] === "true") {
                                sc.removeClass("menu-close");
                                scope.drowzSidebarHidden = false;
                            } else {
                                sc.addClass("menu-close");
                                scope.drowzSidebarHidden = true;
                            }
                        }

                        function toggleFixedMenu() {
                            if (sc.hasClass('menu-close')) {
                                localStorage[scope.drowzSidebarName + "_menuOpened"] = true;
                                sc.removeClass('menu-close');
                                scope.drowzSidebarHidden = false;
                            } else {
                                localStorage[scope.drowzSidebarName + "_menuOpened"] = false;
                                sc.addClass('menu-close');
                                scope.drowzSidebarHidden = true;
                            }
                            $(window).trigger('resize');
                        }

                    }, 100);
                }

                init();

                //$rootScope.$on('$stateChangeSuccess', function() {
                //    init();
                //});
            }
        };
    }
})();
