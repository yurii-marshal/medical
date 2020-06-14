(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("notifications", notifications)
        .service("notificationsService", notificationsService);

    /* @ngInject */
    function notifications() {

        var directive = {
            restrict: 'AE',
            scope: {},
            templateUrl: "core/views/templates/notifications.html",
            link: function (scope, element, attrs) {
                // link
            },
            controller: notificationsController,
            controllerAs: 'ctrl'
        };
        return directive;
    }

    /* @ngInject */
    function notificationsController($scope, $timeout, bsLoadingOverlayService, notificationsService, authService) {
        var ctrl = this;

        ctrl.haveNotifications = false;
        ctrl.notificationsList = [];
        ctrl.openedNotifications = null;

        function activate() {
            if (!authService.getAccessToken()) { return; }

            notificationsService.getNotifications()
                .then(function (response) {
                    ctrl.haveNotifications = !!response.data.Count;
                    ctrl.notificationsList = response.data.Items.map(function (item) {
                        item.displayText = (item.Type.Id == 2) ? item.Title : item.Text;
                        return item;
                    });
                }, function (err) {});
        }

        ctrl.toggleNotifications = function () {
            ctrl.openedNotifications = !ctrl.openedNotifications;
            if(ctrl.openedNotifications) {
                //reload every time when notifications is opened
                activate();
            }
        };

        ctrl.clearAllNotifications = function () {
            bsLoadingOverlayService.start({ referenceId: "notifications" });
            notificationsService.clearNotifications()
                .then(function (response) {
                    ctrl.haveNotifications = false;
                    ctrl.notificationsList = [];
                    ctrl.openedNotifications = false;
                }, function (err) {})
                .then(function () {
                    bsLoadingOverlayService.stop({ referenceId: "notifications" });
                });
        };

        ctrl.clearNotification = function (notificationId, index) {
            bsLoadingOverlayService.start({ referenceId: "notifications" });
            notificationsService.clearNotification(notificationId)
                .then(function (response) {
                    ctrl.notificationsList.splice(index, 1);
                    if (ctrl.notificationsList.length === 0) {
                        ctrl.haveNotifications = false;
                        ctrl.openedNotifications = false;
                    }
                }, function (err) {})
                .then(function () {
                    bsLoadingOverlayService.stop({ referenceId: "notifications" });
                });
        };

        $scope.$on('$stateChangeStart', function() {
            if (ctrl.openedNotifications) {
                ctrl.openedNotifications = false;
            }
        });

        activate();

        $(window).on('click', hideOnBodyClick);

        function hideOnBodyClick(e) {
            if ($(e.target).closest('.notifications').length !== 1) {
                $timeout(function () {
                    if (ctrl.openedNotifications) {
                        ctrl.openedNotifications = false;
                    }
                }, 0);
            }
        }

        $scope.$on('$destroy', function () {
            $(window).off('click', hideOnBodyClick);
        });
    }

    /* @ngInject */
    function notificationsService($http, WEB_API_SERVICE_URI) {
        this.getNotifications = getNotifications;
        this.clearNotification = clearNotification;
        this.clearNotifications = clearNotifications;

        function getNotifications() {
            return $http.get(WEB_API_SERVICE_URI + 'v1/users/notifications');
        }

        function clearNotification(notificationId) {
            return $http.post(WEB_API_SERVICE_URI + 'v1/users/notifications/{0}/clear'.format(notificationId));
        }

        function clearNotifications() {
            return $http.post(WEB_API_SERVICE_URI + 'v1/users/notifications/clear');
        }
    }

})();
