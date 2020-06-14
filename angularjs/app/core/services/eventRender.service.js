(function () {
    "use strict";

    angular
        .module("app")
        .service("eventRenderService", eventRenderService);

    /* @ngInject */
    function eventRenderService(
        $http,
        $state,
        WEB_API_SERVICE_URI,
        setupCenterManagementService,
        $filter
    ) {

        this.renderEventProfile = renderEventProfile;
        this.addClassByDuration = addClassByDuration;
        this.renderEventSetupCenter = renderEventSetupCenter;
        this.renderEventMainCalendar = renderEventMainCalendar;
        this.eventMouseover = eventMouseover;
        this.eventMouseout = eventMouseout;

        function renderEventProfile(event, element) {
            _renderEvent(event, element);
            _addClassByDuration(element, event.start, event.end);
            element.addClass('profile-event');
        }

        function renderEventSetupCenter(event, element) {
            _renderEvent(event, element);
        }

        function renderEventMainCalendar(event, element) {
            _renderEvent(event, element);
        }

        function _renderEvent(event, element) {

            if (event.status || (event.properties && event.properties.AppointmentStatus)) {
                var status = event.status ? event.status : event.properties.AppointmentStatus;
                switch(status.Id) {
                    case 1:
                        element.addClass('confirmed-event');
                        break;
                    case 2:
                        element.addClass('scheduled-event');
                        break;
                    case 3:
                        element.addClass('canceled-event');
                        break;
                    case 4:
                        element.addClass('completed-event');
                        break;
                    case 5:
                        element.addClass('check-in-event');
                        break;
                    case 6:
                        element.addClass('missed-event');
                        break;
                    case 7:
                        element.addClass('check-out-event');
                        break;
                    default:
                        element.addClass('canceled-event');
                        break;
                }
            }

            switch (event.type) {

                case 'setup-center':
                    //Add Setup Center Title
                    element.append('<div class="setup-center-title">' + event.title + '</div>');
                    element[0].style.zIndex = 2;
                    break;

                case 'extra-hours':
                    break;

                case 'event':
                    element.addClass('custom-calendar-event');

                    var eventTemplate = '';
                    var timetitleDay = '';
                    var timetitle = '';
                    var content = '';

                    timetitle = '<span class="bold-time">' + moment.utc(event.start).format("h:mm A") + '</span>';
                    timetitleDay = '<span class="bold-time">' + moment.utc(event.start).format("h:mm A") + ' - ' + moment.utc(event.end).format("h:mm A") + '</span>';

                    content = event.patientName ? event.patientName.FullName : event.title;

                    if (event.order) {
                        content += ' - ' + event.order.OrderType.Text;
                    }

                    eventTemplate =
                        '<div class="custom-event">' +
                        '<div class="custom-event-title day-view">' + timetitleDay + '</div>' +
                        '<div class="custom-event-title week-month-view">' + timetitle + '</div>' +
                        '<div class="custom-event-content">' + content + '</div>' +
                        '</div>';

                    element.append(eventTemplate);
                    break;

                case 'break':
                    //Additional class for well loking small events
                    _addClassByDuration(element, event.start, event.end);

                    //Reformating Title for events
                    var timetitle = '<div class="bold-time">' + moment.utc(event.start).format("h:mm A") + ' - <span class="hide-if-small">' + moment.utc(event.end).format("h:mm A") + '</span></div>';
                    var eventTemplate =
                        '<div class="custom-event">' +
                        '<div class="custom-event-title">' + timetitle + '</div>' +
                        '<div class="custom-event-content">' + event.title + '</div>' +
                        '</div>';
                    element.html();
                    element.append(eventTemplate);
                    break;

                case 'sc-event':
                    element.addClass('custom-calendar-event');
                    _addClassByDuration(element, event.start, event.end);

                    var eventTemplate = '';
                    var timetitle = '';
                    var content = '';

                    timetitle = '<div class="bold-time">' + moment.utc(event.start).format("h:mm A") + ' - <span class="hide-if-small">' + moment.utc(event.end).format("h:mm A") + '</span></div>';

                    content = event.patientName ? event.patientName.FullName : event.title;

                    if (event.order) {
                        content += ' - ' + event.order.OrderType.Text;
                    }

                    eventTemplate =
                        '<div class="custom-event">' +
                        '<div class="custom-event-title">' + timetitle + '</div>' +
                        '<div class="custom-event-content">' + content + '</div>' +
                        '</div>';

                    element.append(eventTemplate);
                    break;

            }

            element.addClass(event.type + '-block');        // Custom class etc "event-block"

            event.isTooltipInitialized = false;

            _addTooltip(element,  event.type, event);
        }

        function addClassByDuration(elem, eventStart, eventEnd) {
            return _addClassByDuration(elem, eventStart, eventEnd);
        }

        function _addClassByDuration(elem, eventStart, eventEnd){
            var a = moment(eventStart);
            var b = moment(eventEnd);
            var diff = b.diff(a, 'minutes');

            if (diff <= 15) {
                elem.addClass('little-block-15');
            } else if ((15 < diff) && (diff <= 30)) {
                elem.addClass('little-block-30');
            } else if ((30 < diff) && (diff <= 45)) {
                elem.addClass('little-block-45');
            } else if ((45 < diff) && (diff <= 60)) {
                elem.addClass('little-block-60');
            }
        }

        function _addTooltip(element, type, event) {

            switch (type) {
                case 'setup-center':

                    element.tooltipster({
                        theme: 'tooltipster-service-center',
                        maxWidth: 270,
                        arrow: false,
                        position: 'left',
                        restoration: 'none',
                        positionTracker: true,
                        debug: false,
                        contentAsHTML: true,
                        content: '' +
                        '<div class="tooltip-title">' +
                        '<div class="circle"></div><div class="tooltip-text">' + event.start.format("h:mm A") + '-' + event.end.format("h:mm A") + '</div>' +
                        '</div>' +
                        '<div class="tooltip-content">' + event.title + "<br/>" + (event.address ? event.address : "") + '</div>' +
                        '',
                        functionBefore: function (instance, helper) {

                            var $origin = $(helper.origin);

                            var parentPos = document.getElementsByClassName('fc-time-grid-container')[0].getBoundingClientRect(),
                                elemPos = element[0].getBoundingClientRect();

                            if (parentPos.top > ((elemPos.height / 2) + elemPos.top - 50)) {
                                $origin.tooltipster("option", "position", "bottom");
                            } else if (parentPos.bottom < -((elemPos.height / 2) - elemPos.bottom - 50)) {
                                $origin.tooltipster("option", "position", "top");
                            } else {
                                if (elemPos.left < 270) {
                                    $origin.tooltipster("option", "position", "bottom");
                                } else {
                                    $origin.tooltipster("option", "position", "left");
                                }
                            }
                        }
                    });
                    break;

                case 'extra-hours':

                    element.tooltipster({
                        theme: 'tooltipster-extra-hours',
                        maxWidth: 130,
                        arrow: false,
                        position: 'right',
                        restoration: 'none',
                        debug: false,
                        positionTracker: true,
                        contentAsHTML: true,
                        content: '' +
                        '<div class="tooltip-title">' +
                        '<div class="circle"></div><div class="tooltip-text">' + moment(event.start).format("h:mm A") + '-' + moment(event.end).format("h:mm A") + '</div>' +
                        '</div>' +
                        '<div class="tooltip-content">On-call</div>' +
                        '',
                        functionBefore: function (instance, helper) {

                            var $origin = $(helper.origin);

                            var parentPos = document.getElementsByClassName('fc-time-grid-container')[0].getBoundingClientRect(),
                                elemPos = element[0].getBoundingClientRect();

                            if (parentPos.top > ((elemPos.height / 2) + elemPos.top - 50)) {
                                $origin.tooltipster("option", "position", "bottom");
                            } else if (parentPos.bottom < -((elemPos.height / 2) - elemPos.bottom - 50)) {
                                $origin.tooltipster("option", "position", "top");
                            } else {
                                $origin.tooltipster("option", "position", "right");
                            }
                        }
                    });

                    break;

                case 'constraint':

                    element.tooltipster({
                        theme: 'tooltipster-constraint-hours',
                        maxWidth: 130,
                        arrow: false,
                        position: 'right',
                        restoration: 'none',
                        debug: false,
                        positionTracker: true,
                        contentAsHTML: true,
                        content: '' +
                        '<div class="tooltip-title">' +
                        '<div class="circle"></div><div class="tooltip-text">' + moment(event.start).format("h:mm A") + '-' + moment(event.end).format("h:mm A") + '</div>' +
                        '</div>' +
                        '<div class="tooltip-content">Working</div>' +
                        '',
                        functionBefore: function (instance, helper) {

                            var $origin = $(helper.origin);

                            var parentPos = document.getElementsByClassName('fc-time-grid-container')[0].getBoundingClientRect(),
                                elemPos = element[0].getBoundingClientRect();

                            if (parentPos.top > ((elemPos.height / 2) + elemPos.top - 50)) {
                                $origin.tooltipster("option", "position", "bottom");
                            } else if (parentPos.bottom < -((elemPos.height / 2) - elemPos.bottom - 50)) {
                                $origin.tooltipster("option", "position", "top");
                            } else {
                                $origin.tooltipster("option", "position", "right");
                            }
                        }
                    });

                    break;
            }
        }

        function eventMouseover(event, jsEvent, view) {

            if (event.type === 'event') {

                var tooltipTemplate = '';
                var loaderTemplate = '<div style="text-align: center">' +
                    '<div style="display: inline-block;">' +
                    '<md-progress-circular md-mode="indeterminate" style="width: 50px; height: 50px;"><div class="md-scale-wrapper md-mode-indeterminate" style="transform: translate(-50%, -50%) scale(0.5);"><div class="md-spinner-wrapper"><div class="md-inner"><div class="md-gap"></div><div class="md-left"><div class="md-half-circle"></div></div><div class="md-right"><div class="md-half-circle"></div></div></div></div></div></md-progress-circular>' +
                    '</div>' +
                    '</div>';

                if (!event.isTooltipInitialized) {

                    $(this).tooltipster({
                        theme: 'calendar-tooltip',
                        maxWidth: 270,
                        minWidth: 270,
                        interactive: true,
                        position: 'right',
                        trigger: 'hover',
                        delay: 20,
                        speed: 0,
                        animationDuration: 0,
                        updateAnimation: false,
                        contentAsHTML: true,
                        restoration: 'none',
                        content: loaderTemplate,
                        debug: false,
                        functionBefore: function(instance, helper) {
                            _getEventDetailsById(event, $(helper.origin));
                        }
                    });
                } else {
                    _getEventDetailsById(event, $(this));
                }

                $(this).tooltipster('show');
            }
        }

        function eventMouseout(event, jsEvent, view) {
            try {
             //   $(this).tooltipster('hide');
            }
            catch(err) {}
        }

        function _getEventDetailsById(event, elem) {
            return $http.get(WEB_API_SERVICE_URI + "v1/patients/events/{0}/details".format(event.id))
                .then(function (response) {
                    var details = _getFormatedEvent(response.data),
                        tmpl = '';

                    for (var i = 0; i < details.length; i++) {
                        tmpl += '<div class="tooltip-row">' +
                            '<span>' + details[i].name + '</span>: ' +
                            '<span class="' + details[i].code + '">' + details[i].value + '</span>' +
                            '</div>';
                    }

                    if (elem.tooltipster) {
                        /**
                         * @description Use try/catch here for cases where tooltipster element -
                         *               elem.data('tooltipster-ns') doesn't initialized in the moment
                         *               of mouseover in some cases
                         */
                        try {
                            elem.tooltipster('content', tmpl);
                        } catch (err) {
                            console.log('You called Tooltipster\'s "content" method on "'+ elem.data('tooltipster-ns') + '" element');
                        }
                    }
                })
                .catch(function() {
                    elem.tooltipster('content', '<div class="tooltip-empty">no details for event</div>');
                })
                .finally(function() {
                    event.isTooltipInitialized = true;
                });
        }

        function _getFormatedEvent(evt) {
            var result = [];
            result.push({
                code: "appointment_id",
                name: "Appointment",
                value: evt.DisplayId
            });
            result.push({
                code: "start",
                name: "Start",
                value: moment.utc(evt.DateRange.From).format("MM/DD/YYYY hh:mm a")
            });
            result.push({
                code: "end",
                name: "End",
                value: moment.utc(evt.DateRange.To).format("MM/DD/YYYY hh:mm a")
            });
            result.push({
                code: "patient_name",
                name: "Patient Name",
                value: evt.Patient.Name.Last + ", " + evt.Patient.Name.First + " " + moment.utc(evt.Patient.DateOfBirthday).format("MM/DD/YYYY")
            });
            result.push({
                code: "address",
                name: "Address",
                value: _concatAddressFromObject(evt.Address)
            });

            if (evt.Patient.HomePhone) {
                result.push({
                    code: "hoem_phone",
                    name: "Home Phone",
                    value: $filter('tel')(evt.Patient.HomePhone)
                });
            }
            if (evt.Patient.Mobile) {
                result.push({
                    code: "mobile",
                    name: "Mobile",
                    value: $filter('tel')(evt.Patient.Mobile)
                });
            }
            if (evt.Patient.WorkPhone) {
                result.push({
                    code: "work_phone",
                    name: "Work Phone",
                    value: $filter('tel')(evt.Patient.WorkPhone)
                });
            }
            if (evt.Personnel) {
                result.push({
                    code: "work_pref_physhone",
                    name: "Team Member",
                    value: evt.Personnel.Name.FullName
                });
            }

            result.push({
                code: "appointment_status",
                name: "Appointment Status",
                value: evt.EventType.Text
            });

            if (evt.Relations) {

                var orders = [];

                for (var i in evt.Relations) {
                    var orderText = evt.Relations[i].DisplayId + " | " + moment.utc(evt.Relations[i].CreatedDate, "YYYY-MM-DD").format("MM/DD/YYYY") + " | ";

                    if (evt.Relations[i].Physician) {
                        orderText += evt.Relations[i].Physician.FullName || evt.Relations[i].Practice;
                    } else {
                        orderText += ' - ';
                    }

                    orders.push(orderText);
                }

                result.push({
                    code: "orders",
                    name: "Order(s)",
                    value: orders.length ? orders : ' - '
                });
            }

            var _operator = evt.CreatedByUser;
            if (evt.LastModifiedByUser) {
                _operator = evt.LastModifiedByUser;
            }
            if (_operator) {
                result.push({
                    code: "operator",
                    name: "Operator",
                    value: _operator.Name.FullName
                });
            }
            if (evt.Notes) {
                result.push({
                    code: "notes",
                    name: "Notes",
                    value: evt.Notes
                });
            }

            return result;
        }

        function _concatAddressFromObject(addressObj) {
            var result = "";
            if (addressObj) {
                var pattern = ['AddressLine', 'AddressLine2', 'State', 'City', 'Zip'];
                var out = [];
                angular.forEach(pattern, function(item){
                    if(addressObj.hasOwnProperty(item) && addressObj[item]) { out.push(addressObj[item]) }
                });
                result = out.join(", ");
            }
            return result;
        }

    }
})();
