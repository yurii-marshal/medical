(function() {
    "use strict";

    angular
        .module("app")
        .service("eventsService", eventsService);

    /* @ngInject */
    function eventsService(
        $http,
        WEB_API_SERVICE_URI,
        $filter,
        $q,
        fileService,
        authService
    ) {
        this.getEvents = getEvents;
        this.getConstraints = getConstraints;
        this.addEvent = addEvent;
        this.deleteEvent = deleteEvent;
        this.editEvent = editEvent;
        this.getConstraintByDay = getConstraintByDay;
        this.getConstraintById = getConstraintById;
        this.saveConstraint = saveConstraint;
        this.deleteConstraint = deleteConstraint;
        this.getEvent = getEvent;
        this.getEventById = getEventById;
        this.getPatientsEvents = getPatientsEvents;
        this.getPatientOrders = getPatientOrders;
        this.getEventAppointmentStatuses = getEventAppointmentStatuses;
        this.changeAppointmentStatus = changeAppointmentStatus;
        this.cancelAppointment = cancelAppointment;
        this.deleteAppointment = deleteAppointment;
        this.openDocument = openDocument;

        var events = [];

        var constraints = [];

        function getRndIcon() {
            var url = window.location.protocol +
                "//" + window.location.host +
                "/" + window.location.pathname +
                '/assets/images/mock/calendar_events/';

            var arrIcons = [
                'all-day.svg', 'check-in.svg', 'colored/complete-green.svg', 'confirmed.svg', 'colored/holiday.svg'
            ];
            var max = arrIcons.length;
            var rnd = Math.floor(Math.random() * (max));
            return url + arrIcons[rnd];
        }

        function getEvents() {
            return $http.get(WEB_API_SERVICE_URI + "v1/rt-mobile/dailydata/patient-events?from=2015-02-09&to=2016-03-12").then(function (response) {
                events = response.data;
                return response;
            });
        }

        function getConstraints() {
            for (var i = -7; i < 7; i++) {
                var date = moment.utc().add(i, "days");
                if (date.day() !== 0 && date.day() !== 6) {
                    constraints.push({
                        id: 100 + constraints.length,
                        start: date.format("YYYY-MM-DD") + "T06:00",
                        end: date.format("YYYY-MM-DD") + "T22:00",
                        rendering: "background"
                    });
                }
            }

            return constraints;
        }

        function addEvent(event, date) {
            date = date === undefined ? moment(event.start, "YYYY-MM-DDThh:mm") : date;
            var newEvent = {
                id: events.length + 1,
                title: event.title || "Time Block",
                constraint: getConstraintByDay(date === undefined ? event.start :date.day()),
                start: date === undefined ? event.start : moment(date.format("MM/DD/YYYY") + " " + event.start, "MM/DD/YYYY HH:mm A").format(),
                end: date === undefined ? event.start : moment(date.format("MM/DD/YYYY") + " " + event.end, "MM/DD/YYYY HH:mm A").format(),
                editable: false,
                color: "#dddbdb",
                icon: getRndIcon(),
                reason: event.reason || "",
                description: event.description || "",
                type: "event"
            };

            events.push(newEvent);
        }

        function editEvent(id, event) {
            angular.forEach(events, function(existingEvent) {
                if (existingEvent.id === event.id) {
                    deleteEvent(existingEvent.id);
                }
            });
            addEvent(event, event.date);
        }

        function deleteEvent(id) {
            angular.forEach(events, function(event) {
                if (event.id == id) {
                    events.splice(events.indexOf(event), 1);
                }
            });
        }

        function getConstraintByDay(day) {
            if(constraints.length > 0) { return constraints; }
            //only if constraints empty return mock data
            for (var i = 0; i < constraints.length; i++) {
                if (moment.utc(constraints[i].start, "YYYY-MM-DDThh:mm").day() === day) {
                    return constraints[i];
                }
            }
            return null;
        }

        function getConstraintById(id) {
            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].id == id) {
                    return constraints[i];
                }
            }
            return null;
        }

        function saveConstraint(constraint) {
            if (constraint.id === "") {
                addConstraint(constraint);
            } else {
                editConstraint(constraint);
            }
        }

        function addConstraint(constraint) {
            constraint.id = constraints.length + 100;
            constraints.push(constraint);
        }

        function editConstraint(constraint) {
            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].id === constraint.id) {
                    constraints.splice(constraints.indexOf(constraints[i]), 1);
                    break;
                }
            }
            addConstraint(constraint);
        }

        function deleteConstraint(id) {
            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].id === id) {
                    constraints.splice(constraints.indexOf(constraints[i]), 1);
                    break;
                }
            }
        }

        function getEvent(id) {
            for (var i = 0; i < events.length; i++) {
                if (events[i].Id == id) {
                    return events[i];
                }
            }
            return undefined;
        }

        function getEventById(id) {
            return $http.get(WEB_API_SERVICE_URI + "v1/patients/events/{0}".format(id));
        }

        function getPatientOrders(id) {
            return $http.get(WEB_API_SERVICE_URI + "v1/patients/" + id + "/orders");
        }

        function getEventAppointmentStatuses(id) {
            return $http.get(WEB_API_SERVICE_URI + "v1/patients/events/{0}/available-statuses/dictionary".format(id), {cache: false});
        }

        function changeAppointmentStatus(id, editModel) {
            return $http.put(WEB_API_SERVICE_URI + "v1/patients/events/{0}/change-status".format(id), editModel);
        }

        function cancelAppointment(id) {
            return $http.put(WEB_API_SERVICE_URI + "v1/patients/events/{0}/cancel".format(id));
        }

        function deleteAppointment(id) {
            return $http.delete(WEB_API_SERVICE_URI + "v1/patients/events/{0}".format(id));
        }

        function getPatientsEvents(parameters, start, end) {

            var personnelIds = [];
            if (parameters["Personnel"] && parameters["Personnel"].length > 0) {
                personnelIds = _.map(parameters["Personnel"], function(person) {
                    return person.Value;
                });
            }

            var params = {
                personnel: personnelIds,
                tags: _.map(parameters["Personnel Tag"], function (tag) {
                    return tag.Value;
                }),
                locations: _.map(parameters["Location"], function (location) {
                    return location.Value;
                })
            };

            if (!params.personnel.length && !params.tags.length && !params.locations.length) {
                //if all params empty don't send any request and return mock object;
                var deferred = $q.defer();
                deferred.resolve({data:{Items:[]}});
                return deferred.promise;
            }

            return $http({
                url: WEB_API_SERVICE_URI + "v1/patients/events",
                method: "GET",
                params: {
                    personnel: params.personnel,
                    tags: params.tags,
                    locations: params.locations,
                    from: start,
                    to: end
                    //from: "2016-03-27T00:00:00Z",
                    //to: "2016-05-07T23:59:59Z"
                }
            });
        }

        function openDocument(accessToken) {
            fileService.download(WEB_API_SERVICE_URI + 'v1/patients/documents/' + accessToken + '?access_token=' + authService.getAccessToken());
        }
    }
})();
