(function () {
    "use strict";

    angular
        .module("app")
        .service('uiDrowzCalendarConfig', function ($state) {
            return {
                setCalendar: setCalendar,
                addEvent: addEvent,
                updateEvent: updateEvent,
                delEvent: delEvent,
                getCalendarType: getCalendarType,
                saveCurrentParams: saveCurrentParams,
                getCurrentParams: getCurrentParams
            };

            var _calendar;
            var _date = null;
            var _view = null;
            var _parentRoute = "";

            function setCalendar(calendar) {
                _calendar = calendar;
            }

            function addEvent(event) {
                if(!_calendar) throw new Error('_calendar is "undefined"');

                _calendar.fullCalendar('renderEvent', event);
            }

            function updateEvent(event) {
                if(!_calendar) throw new Error('_calendar is "undefined"');
                if(!event.id) throw new Error('event.id is "undefined"');

                var clientEvents = _calendar.fullCalendar('clientEvents', event.id);
                for (var i = 0; i < clientEvents.length; i++) {
                    var clientEvent = clientEvents[i];
                    clientEvent = angular.extend(clientEvent, event);
                    _calendar.fullCalendar('updateEvent', clientEvent);
                }

            }

            function delEvent(id) {
                if(!_calendar) throw new Error('[Error] _calendar is "undefined"');
                if(!id) throw new Error('[Error] id is empty');

                _calendar.fullCalendar('removeEvents', id);
            }

            function getCalendarType() {
                return _calendar.fullCalendar('getView').type;
            }

            function saveCurrentParams(view, date) {
                _view = view;
                _date = date;
            }

            function getCurrentParams() {
                if ($state.current.name !== _parentRoute || _parentRoute === "") {
                    _parentRoute = $state.current.name;
                    _date = null;
                    _view = null;
                }

                return { view: _view, date: _date };
            }

        })
        .directive("drwzCalendarSimple", function (uiDrowzCalendarConfig, $state, $timeout, iframeUtils) {
            return {
                restrict: "E",
                templateUrl: "core/views/drowz_calendar_simple.html",
                link: link,
                transclude: {
                    'left': '?drwzCalendarLeft',
                    'right': '?drwzCalendarRight'
                },
                scope: {
                    drwzNgModel: "=",
                    drwzUiCalendar: "=",
                    drwzCalendarId: "@",
                    drwzOptions: "@",
                    heightElementSelector: "@",
                    isLeftViewBtns: '=?'
                }
            };

            function link(scope, elm, attr, calendar) {

                var defaults = {
                    'dateNow': '',
                    'currentDate': '',
                    'showTitle': false,
                    'btns': {
                        'jumpTo': true,
                        'today': false,
                        'agendaDay': false,
                        'agendaWeek': false,
                        'month': false
                    },
                    fixedWeekCount: false,
                    nowIndicator: true
                };

                // Calendar activate section

                var calendar;
                var _helperJumpToElem;

                calendar = $(elm).find('.fullcalendar_container').html('');

                var updateStateParams = function() {
                    var view = calendar.fullCalendar('getView');
                    scope.calendar.drwzCurrentView = view.type;
                };

                var updateState = function () {
                    var res = {};
                    if(!fullcalendar) { return; }

                    res['view'] = fullcalendar.view.name;
                    res['date'] = fullcalendar.view.calendar.getDate().format('YYYY-MM-DD');

                    scope.calendar.currentDate = fullcalendar.view.calendar.getDate().format('MM/DD/YYYY');

                    if(res && !angular.equals(prevState, res)){

                        //if state is changed over click we need check it and stop state changing by calendar
                        var currentState = $state.current.url;
                        setTimeout(function(){
                            if (currentState === $state.current.url) {
                                $state.go('.', res, {notify: false});
                                iframeUtils.sendDataToParentIframe($state, true);
                            }
                        }, 200);

                        scope.title = fullcalendar.view.title;

                        updateStateParams();
                    }
                };

                // Load previous calendar view params from service cache
                var params = uiDrowzCalendarConfig.getCurrentParams();

                if (params) {
                    if (params.view) {
                        scope.drwzUiCalendar.defaultView = params.view;
                    }
                    if (params.date) {
                        scope.drwzUiCalendar.defaultDate = params.date;
                    }
                }
                // end load;

                calendar.fullCalendar(scope.drwzUiCalendar);

                setTimeout(function() {
                    calendar.fullCalendar('addEventSource', scope.drwzNgModel);
                });
                // calendar.fullCalendar('addEventSource', drwzNgModel);
                var fullcalendar = calendar.fullCalendar('getCalendar');

                // It needs for triggering event when DOM rendered
                var headerHeightWatcher = setInterval(function () {
                    var allHeight = 0;
                    var breadCrumbsHeight = angular.element('.breadcrumbs');
                    var calendarFiltersContainer = angular.element('.calendar-events-header');
                    var calendarHeaderContainer = angular.element('.drwz_calendar_header');

                    if (calendarFiltersContainer && calendarFiltersContainer.length) {
                        allHeight += calendarFiltersContainer.outerHeight(true);
                    }

                    if (calendarHeaderContainer && calendarHeaderContainer.length) {
                        // by default has 19 px
                        allHeight += calendarHeaderContainer.outerHeight(true);
                    }

                    if (breadCrumbsHeight && breadCrumbsHeight.length) {
                        allHeight += breadCrumbsHeight.outerHeight(true);
                    }

                    // calendarHeaderContainer by default has 19 px that's why check from 20
                    if (allHeight > 20) {
                        clearInterval(headerHeightWatcher);
                        setCalendarHeight();
                    }

                }, 50);

                uiDrowzCalendarConfig.setCalendar(calendar);

                //read dwzOptions
                var options = parseOptionsToObject(scope.drwzOptions);

                scope.calendar = angular.merge({}, defaults, options);
                scope.calendar.isLeftViewBtns = !!scope.isLeftViewBtns;

                function setCalendarHeight() {

                    var allHeight = 0;
                    var breadCrumbsHeight = angular.element('.breadcrumbs');
                    var calendarFiltersContainer = angular.element('.calendar-events-header');
                    var calendarHeaderContainer = angular.element('.drwz_calendar_header');

                    if (calendarFiltersContainer && calendarFiltersContainer.length) {
                        allHeight += calendarFiltersContainer.outerHeight(true);
                    }

                    if (calendarHeaderContainer && calendarHeaderContainer.length) {
                        allHeight += calendarHeaderContainer.outerHeight(true);
                    }

                    if (breadCrumbsHeight && breadCrumbsHeight.length) {
                        allHeight += breadCrumbsHeight.outerHeight(true);
                    }

                    var calendarHeaderHeight = allHeight,
                        calendarContainerPadding = calendar.innerHeight() - calendar.height(),
                        height = 0;

                    if (scope.heightElementSelector) {

                        var heightElement = $(scope.heightElementSelector);

                        height = heightElement.height() - calendarHeaderHeight - calendarContainerPadding;
                        calendar.fullCalendar('option', 'height', height);

                    } else {

                        var visibleHeight = document.body.clientHeight,
                            menuHeight = $('main-menu').length ? $('main-menu').outerHeight(true) : 0;

                        height = visibleHeight - menuHeight - calendarHeaderHeight - calendarContainerPadding;
                        calendar.fullCalendar('option', 'height', height);
                        calendar.fullCalendar('option', 'contentHeight', height);
                    }
                };

                window.addEventListener('resize', function () {
                    setCalendarHeight();
                });

                updateStateParams();
                updateState();

                var prevState = {};

                scope.title = "";
                if(scope.calendar.showTitle){
                    scope.$watch( function() {
                        return fullcalendar && fullcalendar.view && fullcalendar.view.title;
                    }, function (val) {
                        if (fullcalendar.view.type === 'month') {
                            var title = fullcalendar.view.title,
                                a = title ? title.substr(0, fullcalendar.view.title.indexOf(' ')) : '',
                                b = title ? title.substr(fullcalendar.view.title.indexOf(' '), title.length) : '';
                            scope.title = a + ',' + b;
                        } else {
                            scope.title = val;
                        }
                    });
                }

                calendar.on('click', function () {
                   updateState();
                });

                scope.calendar.changeView = function (view) {
                    calendar.fullCalendar('changeView', view);
                    updateState();
                };

                scope.calendar.goToNow = function () {
                    calendar.fullCalendar('gotoDate', new Date());
                    updateState();
                };

                scope.calendar.goNext = function () {
                    calendar.fullCalendar('next');
                    updateState();
                };

                scope.calendar.goPrv = function () {
                    calendar.fullCalendar('prev');
                    updateState();
                };

                scope.$watch('calendar.dateNow', function (newVal, oldVal) {
                    if (newVal && newVal.length > 0 && calendar && oldVal) {

                        calendar.fullCalendar('gotoDate', newVal);
                        updateState();
                        scope.calendar.dateNow = '';
                        _helperJumpToElem.style.display = "block";

                    }
                }, true);

                scope.$on('fullCalendar.reload', function () {
                    calendar.fullCalendar('refetchEvents');
                });

                scope.$on('$destroy', function () {

                    calendar.fullCalendar('destroy');

                    var res = {};

                    if (fullcalendar) {
                        res['view'] = fullcalendar.view.name;
                        res['date'] = fullcalendar.view.calendar.getDate().format('YYYY-MM-DD');

                        uiDrowzCalendarConfig.saveCurrentParams(res['view'], res['date']);
                    }

                    calendar.off('click');
                });

                // https://git.gloriumdev.com/niko-health/dme-portal/issues/1780
                // Fix problem with clear value on calendar
                scope.clickHelperJumpTo = function ($event) {
                    _helperJumpToElem = $event.currentTarget;
                    _helperJumpToElem.style.display = 'none';
                    var datetimepickerElem = $(_helperJumpToElem).parent().children('input[datetimepicker=""]');
                    datetimepickerElem.val(calendar.fullCalendar('getView').calendar.getDate().format('MM/DD/YYYY'));
                    datetimepickerElem.trigger('focus').trigger('focus');
                }
            }
        });

    //Parse from string to object "btns-agendaWeek, btns-agendaday" => option.btns.agendaWeek option.btns.agendaday
    function parseOptionsToObject(str) {
        var obj = {btns: {}};
        if (typeof str !== "string" || str.length < 1) {
            return obj;
        }

        var newArr = str.split(',').map(function (i) {
            return i.trim();
        });

        angular.forEach(newArr, function (item) {
            var sl = item.split('-');

            //For items option.btns.agendaWeek option.btns.agendaday
            switch (sl[0]) {
                case "btns":
                    obj.btns[sl[1]] = true;
                    break;
                case "showTitle":
                    obj['showTitle'] = true;
                    break;
            }
        });

        return obj;
    }
})();
