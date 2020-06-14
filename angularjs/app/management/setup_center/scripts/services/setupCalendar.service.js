(function () {
    "use strict";

    angular.module("app.profile")
        .service("setupCalendarService", setupCalendarService);

    /* @ngInject */
    function setupCalendarService($state,
                                  ngToast,
                                  setupCenterManagementService,
                                  breakService,
                                  popupMenuCalendar,
                                  setupCenterAppointmentService) {

        this.viewRender = viewRender;
        this.eventResize = eventResize;
        this.dayClick = dayClick;
        this.eventDrop = eventDrop;
        this.eventClick = eventClick;

        function viewRender($scope, $compile) {

            return function (view, element) {
                $compile(element)($scope);

                window.drowzCalendarResize = function () {
                    view.calendar.option('height', document.body.clientHeight - 57);
                };

                $(window).off('resize');
                $(window).on('resize', window.drowzCalendarResize);
            };

        }

        function eventResize(event, delta, revertFunc) {
            _updateEventAfterResize(event, revertFunc);
        }

        function dayClick(dateMoment, jsEvent, showAddScheduleFunc) {
            $("body").find('.bootstrap-datetimepicker-widget:last').hide();

            var arrListItems = [];

            var collisionItems = setupCenterManagementService
                .getAllIntersections(dateMoment, angular.copy(dateMoment).add(30,'m'));

            var collisionObjArrId = {
                'constraint':[],
                'break':[],
                'event':[]
            };
            var collision = {
                'constraint':false,
                'break':false,
                'event':false
            };
            angular.forEach(collisionItems, function (item) {
                if(collisionObjArrId[item.type]) {
                    collisionObjArrId[item.type].push(item.id);
                }
                collision[item.type] = true;
            });

            //Generate menu
            if(collision['constraint'] && !collision['break'] && !collision['event']) {
                arrListItems.push(
                    _getMenuItem('create_break', dateMoment, 0, event)
                );
            }

            //Add/Edit constraint
            var wh = setupCenterManagementService.getConstraintByDay(dateMoment.format('YYYY-MM-DD'));
            var menuItemObj = {
                'title': ((wh) ? "Edit" : "Add") + " Working Hours",
                'class': 'add-hours',
                'exec': function () {
                    showAddScheduleFunc(jsEvent, dateMoment.format('YYYY-MM-DD'));
                }
            };
            arrListItems.push( menuItemObj );

            popupMenuCalendar.showPopupMenu(arrListItems, jsEvent);

        }

        function eventDrop(event, delta, revertFunc) {
            _updateEventAfterResize(event, revertFunc);
        }

        function _updateEventAfterResize(event, revertFunc) {
            var appointment = {
                id: event.id,
                reason: event.reason,
                description: event.description || "",
                title: event.title,
                date: event.start.format("MM/DD/YYYY"),
                start: event.start.format("hh:mm A"),
                end: event.end.format("hh:mm A")
            };

            setupCenterManagementService.saveEvent(appointment)
                .then(function (resolveMsg) {
                    ngToast.success(resolveMsg);
                }, function (err) {
                    revertFunc();
                });
        }

        function eventClick(event, jsEvent, view, canEdit) {
            if (canEdit) {
                if (event.type === "break" || event.type === undefined) {
                    breakService.showModal(jsEvent, undefined, event, setupCenterManagementService.saveEvent, setupCenterManagementService.deleteEvent, true);
                } else if (event.type === "sc-event") {
                    setupCenterAppointmentService.showAppointPersonnelModal(jsEvent, setupCenterManagementService.getSetupCenterId(), event.id);
                }
            }
        }

        /**
         *
         * @param {string} type
         * @param {moment} dateMoment
         * @param {int} id
         * @param {$event} jsEvent
         * @returns {{}}
         * @private
         */
        function _getMenuItem(type, dateMoment, id, jsEvent) {
            var menuItemObj = {};

            switch (type) {

                case 'create_break':
                    menuItemObj = {
                        'title': "Create Time block",
                        'class': 'add-oncall',
                        'exec': function () {
                            breakService.showModal(jsEvent,
                                dateMoment,
                                undefined,
                                setupCenterManagementService.saveEvent,
                                setupCenterManagementService.deleteEvent,
                                true);
                        }
                    };
                    break;


            }
            return menuItemObj;
        }

    }

})();
