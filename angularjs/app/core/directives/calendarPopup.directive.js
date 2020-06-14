(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('calendarPopup', calendarPopup);

    /* @ngInject */
    function calendarPopup(uiDrowzCalendarConfig, drowzPopupWithoutBackdrop) {
        var directive = {
            link: linkFunc,
            restrict: 'A',
            scope: {
                actionId: "&actionId",
                actionType: "@actionType",
                splitInnerEvents: "=?"      // show separated check-boxes for breaks and extra time
            },
            priority: 0
        };
        return directive;

        function linkFunc(scope, element, attr) {

            element.on('click', function ($event) {

                var actionId = scope.actionId();
                var actionType = scope.actionType;

                switch(attr['calendarPopup'].toLowerCase()) {
                    case 'copy':
                        showCopyPopup($event, actionId, actionType, scope.splitInnerEvents);
                        break;
                    case 'clear':
                        showClearPopup($event, actionId, actionType);
                        break;
                }
            });
        }

        function showCopyPopup($event, idForAction, calendarActionType, splitInnerEvents) {
            var calendarType = uiDrowzCalendarConfig.getCalendarType();
            var path = calendarType === "agendaWeek" ? "core/views/templates/copyWeekModal.html" : "core/views/templates/copyDayModal.html";
            drowzPopupWithoutBackdrop.show($event, path, "copyCalendarScheduleController", idForAction, calendarActionType, splitInnerEvents);
        }

        function showClearPopup($event, idForAction, calendarActionType) {
            var calendarType = uiDrowzCalendarConfig.getCalendarType();
            var path = calendarType === "agendaWeek" ? "core/views/templates/clearWeekModal.html" : "core/views/templates/clearDayModal.html";
            drowzPopupWithoutBackdrop.show($event, path, "clearController", idForAction, calendarActionType, null);
        }
    }




})();



