(function () {
    'use strict';

    angular
        .module('app.management.service_center')
        .controller('setupCenterViewController', setupCenterViewController);

    /* @ngInject */
    function setupCenterViewController(ngToast,
                                       $scope,
                                       $state,
                                       setupCenterManagementService,
                                       setupCalendarService,
                                       bsLoadingOverlayService,
                                       $compile,
                                       $mdDialog,
                                       eventRenderService,
                                       drowzPopupWithoutBackdrop,
                                       setupCenterAppointmentService) {

        var setup_center = this;

        //check params in url
        if (isNaN(parseInt($state.params.setupCenterId)) || setup_center.setupCenterId<=0) {
            $state.params.setupCenterId = undefined;
        }

        //Default value
        setup_center.setupCenterId = $state.params.setupCenterId ? $state.params.setupCenterId : -1 ;
        setupCenterManagementService.setSetupCenter(setup_center.setupCenterId);
        setup_center.selectedSetupCenter = null;

        setup_center.canEdit = setup_center.setupCenterId >= 0;

        setup_center.break = {
            start: "",
            end: ""
        };

        setup_center.selectSetupCenter = redirectToSetupCenter;
        setup_center.showAddSchedule = showAddSchedule;
        setup_center.deleteWorkingHours = deleteWorkingHours;
        setup_center.saveWorkingHours = saveWorkingHours;

        function dayClick(date, jsEvent) {
            if (!setup_center.canEdit) return;
            setupCalendarService.dayClick(date, jsEvent, setup_center.showAddSchedule);
        }

        function eventClick(event, jsEvent, view) {
            setupCalendarService.eventClick(event, jsEvent, view, setup_center.canEdit);
        }

        setup_center.uiConfig = {
            calendar: {
                calendarId: "calendarObj",
                editable: true,
                eventLimit: true,
                weekNumbers: true,
                height: document.body.clientHeight - 57,
                defaultDate: ($state.params.date) ? $state.params.date : moment().format('YYYY-MM-DD'),
                defaultView: ($state.params.view) ? $state.params.view : "agendaWeek",
                weekTitleAdditionalHtml: setup_center.canEdit ?
                '<div class="fc-dn-btn-v2"><a href="javascript:void(0);" ' +
                'ng-click="setup_center.showAddSchedule($event, \'{0}\')">' +
                '<i class="fc-icon fc-icon-edit"></i></a></div>' : "",
                viewRender: setupCalendarService.viewRender($scope, $compile),
                dayClick: dayClick.bind(this),
                eventResize: setupCalendarService.eventResize,
                eventDrop: setupCalendarService.eventDrop,
                eventRender: eventRenderService.renderEventSetupCenter,
                eventClick: eventClick,
                scrollTime: '06:00:00'
            }
        };

        setup_center.eventSource = function (start, end, timezone, callback) {
            //setup center id isn't selected
            if (setup_center.setupCenterId === -1) return;

            bsLoadingOverlayService.start({referenceId: 'serviceCenterOverlay'});

            setupCenterManagementService.getCalendarData(
                start.format('YYYY-MM-DD'),
                end.format('YYYY-MM-DD')
            ).then(function (response) {
                return response;
            }, function () {}).then(function (response) {
                callback(response);
                bsLoadingOverlayService.stop({referenceId: 'serviceCenterOverlay'});
            });

        };

        setup_center.showAppointPersonnelModal = function ($event, centerId) {
            setupCenterAppointmentService.showAppointPersonnelModal($event, centerId);
        };

        //Hide dialog if route is changed
        $scope.$on("$destroy", function () {
            $mdDialog.hide();
        });

        setup_center.getSetupCenterList = function (query) {
            return setupCenterManagementService.getSetupCenterListPromise(query)
                .then(function (response) {
                    if (!response || !response.data) { return []; }

                    for (var i = 0; i < response.data.Items.length; i++) {
                        if (Number(response.data.Items[i].Id) === Number(setup_center.setupCenterId)) {
                            setup_center.selectedSetupCenter = response.data.Items[i];
                            break;
                        }
                    }
                    return response.data.Items;
                });
        };

        function redirectToSetupCenter(item) {
            //for problem with autocomplete when select item and change state -  overlay isn't destroyed
            setTimeout(function () {
                var locationParam = (item && item.Id !== -1) ? {setupCenterId: item.Id} : {};
                $state.go("root.management.setup_center", locationParam);
            }, 100);
        };

        function showAddSchedule(event, date) {
            var constraint = date === undefined
                ? undefined
                : setupCenterManagementService.getConstraintByDay(date);
            if (constraint === undefined) {
                constraint = {
                    date: date,
                    start: moment.utc("09:00", "HH:mm"),
                    end: moment.utc("18:00", "HH:mm")
                }
            } else {
                constraint = {
                    id: constraint.id,
                    date: moment(constraint.start).format('YYYY-MM-DD'),
                    start: moment(constraint.start),
                    end: moment(constraint.end)
                }
            }

            drowzPopupWithoutBackdrop.show(event,
                'management/setup_center/views/setup_center.add_schedule.popup.view.html',
                "scheduleModalController",
                null, null, null,
                constraint,
                setup_center.saveWorkingHours,
                setup_center.deleteWorkingHours);
        }

        function saveWorkingHours(constraint) {
            setupCenterManagementService.saveConstraint(constraint)
                .then(function (resolveMsg) {
                    ngToast.success(resolveMsg);
                    $scope.$broadcast('fullCalendar.reload', 'true');
                });
        }

        function deleteWorkingHours(id) {
            bsLoadingOverlayService.start({referenceId: 'serviceCenterOverlay'});

            setupCenterManagementService.deleteWorkingHours(id)
                .then(function (resolveMsg) {
                    ngToast.success(resolveMsg);
                    $scope.$broadcast('fullCalendar.reload', 'true');
                })
                .finally(function () {
                    bsLoadingOverlayService.stop({referenceId: 'serviceCenterOverlay'});
                });
        }

        $scope.$watch(function(){
            return setup_center.selectedSetupCenter;
        }, function (newVal, oldVal) {
            if(!newVal && !!oldVal) {
                redirectToSetupCenter(-1);
            }
        });

        init();

        function init() {
            if ($state.params.setupCenterId && $state.params.setupCenterId >= 0) {
                setupCenterManagementService.getSetupCenterById($state.params.setupCenterId)
                    .then(function (response) {
                        if (response && response.data) { setup_center.selectedSetupCenter = response.data; }
                    });
            }
        }
    }
})();
