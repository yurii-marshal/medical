(function () {
    "use strict";

    angular
        .module("app")
        .service("menuService", menuService);

    /* @ngInject */
    function menuService($rootScope, $compile) {
        this.getMenu = getMenu;
        this.getMenuItems = getMenuItems;
        this.reloadUserInfo = reloadUserInfo;

        var menuItems = [
            {
                name: "Calendar",
                state: "root.calendar",
                imageUrl: "assets/images/default/calendar-v2.svg"
            },
            {
                name: "Patients",
                state: "root.patients.list",
                imageUrl: "assets/images/main-menu/patients.svg"
            },
            {
                name: "Orders",
                state: "root.orders",
                imageUrl: "assets/images/default/custom-document.svg"
            },
            {
                name: "Reports",
                state: "root.reports",
                imageUrl: "assets/images/main-menu/reports.svg"
            },
            {
                name: "Management",
                state: "root.management",
                imageUrl: "assets/images/main-menu/management.svg"
            }
        ];

        function getMenuItems() {
            return menuItems;
        }

        function getMenu() {
            var menu = "<div class='main-menu'><div class='main-links'>";

            angular.forEach(menuItems, function(item) {
                menu += "<div class='main-links-container'"
                    + "simple-tooltip tooltip-position='bottom'"
                    + "simple-tooltip-text='" + item.name + "'"
                    + "simple-tooltip-breakpoint='1550'" + "'>"
                    + "<a href='javascript:void(0);' class='main-link' ui-sref='" + item.state + "'>"
                    + "<md-icon class='main-link-icon' md-svg-src='" + item.imageUrl + "'></md-icon>"
                    + item.name
                    + "</a>"
                    + "</div>";
            });
            menu += "</div><menu-user-info class='main-menu-info'></menu-user-info></div>";

            angular.element("#mmenu").html($compile(menu)($rootScope));
        }

        function clearMenu() {
            angular.element("#mmenu").html('');
        }

        function reloadUserInfo() {
            getMenu();
        }
    }
}());
