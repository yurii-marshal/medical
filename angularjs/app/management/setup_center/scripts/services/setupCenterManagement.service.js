(function () {
    "use strict";

    angular
        .module("app.management.service_center")
        .service("setupCenterManagementService", setupCenterManagementService);

    /* @ngInject */
    function setupCenterManagementService($q, $http, ngToast, WEB_API_SERVICE_URI, uiDrowzCalendarConfig) {
        this.setSetupCenter = setSetupCenter;
        this.getCalendarData = getCalendarData;
        this.getSetupCenterListPromise = getSetupCenterListPromise;
        this.getSetupCenterById = getSetupCenterById;
        this.getConstraintById = getConstraintById;
        this.saveConstraint = saveConstraint;
        this.getConstraintByDay = getConstraintByDay;
        this.saveEvent = saveEvent;
        this.deleteEvent = deleteEvent;
        this.deleteWorkingHours = deleteWorkingHours;
        this.getBreakReasons = getBreakReasons;
        this.getBreakById = getBreakById;
        this.getSetupCenterId = getSetupCenterId;
        this.getAllIntersections = getAllIntersections;

        var _cache = {};
        var _setupCenterId;
        var breakReasons = [];
        _cache['constraints'] = [];
        _cache['breaks'] = [];
        _cache['events'] = [];

        function setSetupCenter(id) {
            _setupCenterId = parseInt(id);
        }

        function getSetupCenterId() {
            return _setupCenterId;
        }

        function getBreakReasons() {
            return breakReasons;
        }

        function _getEventsPromise(start, end) {
            return $http({
                'method': 'GET',
                'url': WEB_API_SERVICE_URI + 'v1/setup-centers/' + _setupCenterId + '/events',
                'params': {
                    'StartDate': start,
                    'EndDate': end
                }
            });
        }

        function _getBreaksPromise(start, end) {
            return $http({
                'method': 'GET',
                'url': WEB_API_SERVICE_URI + '/v1/setup-centers/' + _setupCenterId + '/schedules/breaks',
                'params': {
                    'StartDate': start,
                    'EndDate': end
                }
            });
        }

        function _getBreaksReasonsPromise() {
            return $http({
                'method': 'GET',
                'url': WEB_API_SERVICE_URI + 'v1/personnels/schedules/breaks/reasons/dictionary'
            });
        }

        function _getConstraintsPromise(start, end) {
            return $http({
                'method': 'GET',
                'url': WEB_API_SERVICE_URI + '/v1/setup-centers/' + _setupCenterId + '/schedules',
                'params': {
                    'StartDate': start,
                    'EndDate': end
                }
            });
        }

        function _getConstraintValueForBreak(breakItem) {
            var constraint = getConstraintByDay(
                moment.utc(breakItem.start ? breakItem.start : breakItem.StartDate, "YYYY-MM-DDThh:mm").format("YYYY-MM-DD")
            );

            return constraint ? constraint.id : { start: "00:00", end: "00:00" };
        }

        function getSetupCenterListPromise(name) {
            var params = {
                name: name,
                sortExpression: 'Name ASC'
            };
            return $http.get(WEB_API_SERVICE_URI + 'v1/setup-centers/dictionary', { params: params });
        }

        function getSetupCenterById(centerId) {
            return $http.get(WEB_API_SERVICE_URI + 'v1/setup-centers/{0}'.format(centerId), { cache: true });
        }

        function getCalendarData(start, end) {

            var promises = [];
            var urls = [];
            var deferred = $q.defer();

            if (angular.isUndefined(_setupCenterId)) {
                throw new Error('_setupCenterId is empty');
            }

            //convert dates in required format
            var start = start.format('YYYY-MM-DD');
            var end = end.format('YYYY-MM-DD');

            promises.push(_getEventsPromise(start, end));
            promises.push(_getConstraintsPromise(start, end));
            promises.push(_getBreaksPromise(start, end));
            promises.push(_getBreaksReasonsPromise());

            /* wait all requests */
            $q.all(promises).then(function (datasArr) {

                _cache['events'] = datasArr[0].data.Items
                    .map(function (item) {
                        return {
                            id: item.Id,
                            title: item.Personnel.Name.First + ' ' + item.Personnel.Name.Last + ' ' + (item.Description || ""),
                            constraint: 'available',
                            start: item.DateRange.From,
                            end: item.DateRange.To,
                            editable: false,
                            type: "sc-event",
                            color: '#dddbdb',
                            className: 'calendar-event',
                            'properties': item
                        }
                    });

                _cache['constraints'] = datasArr[1].data.Items
                    .map(function (item) {
                        return {
                            start: item.StartDate,
                            end: item.EndDate,
                            id: item.Id,
                            type: "constraint",
                            rendering: 'background',
                            className: 'calendar-working-hours'
                        }
                    });
                _cache['breaks'] = datasArr[2].data.Items
                    .map(function (item) {
                        return {
                            id: item.Id,
                            description: item.Description,
                            start: moment.utc(item.StartDate).format("YYYY-MM-DDTHH:mm:ss"),
                            end: moment.utc(item.EndDate).format("YYYY-MM-DDTHH:mm:ss"),
                            editable: moment.utc(item.EndDate) > moment.utc(),
                            reason: '',
                            title: item.Description || "Time Block",
                            type: "break",
                            className: 'calendar-event',
                            'properties': item
                        }
                    });

                breakReasons = datasArr[3].data;

                for (var j in breakReasons) {
                    if (!breakReasons[j].Description) {
                        breakReasons[j].Description = breakReasons[j].Text;
                    }
                }

                //Breaks
                for (var i = 0; i < _cache['breaks'].length; i++) {
                    var breakItem = _cache['breaks'][i];
                    _cache['breaks'][i].constraint = _getConstraintValueForBreak(breakItem);
                }

                var result = [].concat([],
                    _cache['events'],
                    _cache['constraints'],
                    _cache['breaks']);

                //return merged results for all urls
                deferred.resolve(result);

            }, function (err) {

                /* Catch error in one of requests */
                deferred.reject('[Error] Can\'t get data from server:'
                    + '<br/>Url: ' + err.config.url
                    + '<br/>Status ' + err.status);

            });

            return deferred.promise;

        }

        function getConstraintById(id) {
            var deferred = $q.defer();

            $http({
                'method': 'GET',
                'url': WEB_API_SERVICE_URI + '/v1/setup-centers/schedules/' + id
            })
            .then(function (res) {
                if (res.data && res.data.start && res.data.end) {
                    deferred.resolve(res.data);
                } else {
                    deferred.reject('[Error] Invalid data from server');
                }
            });

            return deferred.promise;
        }

        function saveConstraint(constraint) {
            var deferred = $q.defer();
            var data = {
                "StartDate": constraint.start,
                "EndDate": constraint.end
            };
            if (constraint.repeatTypeValue && parseInt(constraint.repeatTypeValue) > 0) {
                constraint.repeatTypeValue = parseInt(constraint.repeatTypeValue);
                data.RepeatTypeValue = parseInt(constraint.repeatTypeValue);
                if (constraint.repeatTypeValue === 3) {
                    data.SpecificDates = constraint.specificDates;

                    //add current date to specificDates
                    var currDate = moment(constraint.start, "YYYY-MM-DDTHH:mm").format("MM/DD/YYYY");
                    data.SpecificDates.push(currDate);
                }
            }

            if (!constraint.id) {
                $http.post(WEB_API_SERVICE_URI + '/v1/setup-centers/' + _setupCenterId + '/schedules', data)
                    .then(function(res) {
                        deferred.resolve('Working hours are succesfully created');
                    });

            }
            else {
                $http.put(WEB_API_SERVICE_URI + '/v1/setup-centers/schedules/' + constraint.id, data)
                    .then(function (res) {
                        deferred.resolve('Working hours are succesfully updated');
                    });

            }

            return deferred.promise;
        }

        function getConstraintByDay(date) {
            return _.find(_cache['constraints'], function (item) {
                //Constraints doesn't have 'tooltip' property
                return moment.utc(item.start, "YYYY-MM-DDThh:mm").format("YYYY-MM-DD") === date
                    && !item.hasOwnProperty('tooltip');

            });
        }

        function deleteWorkingHours(id) {
            var deferred = $q.defer();
            $http({
                    'url': WEB_API_SERVICE_URI + 'v1/setup-centers/schedules/' + id,
                    'method': "DELETE"
                })
                .then(function(res) {
                    uiDrowzCalendarConfig.delEvent(id);
                    _.remove(_cache['breaks'], ['id', id]);

                    deferred.resolve('Working hours are succesfully deleted');
                })
                .catch(function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        }

        function deleteEvent(id) {
            var deferred = $q.defer();

            $http.delete(WEB_API_SERVICE_URI + 'v1/setup-centers/schedules/breaks/' + id)
                .then(function (res) {
                    uiDrowzCalendarConfig.delEvent(id);
                    _.remove(_cache['breaks'], ['id', id]);

                    deferred.resolve(res.data);
                });
            return deferred.promise;
        }

        function saveEvent(event) {
            //prepare event
            var _eventToSave = {
                "StartDate": moment(event.date + " " + event.start, "MM/DD/YYYY HH:mm A").format('YYYY-MM-DDTHH:mm:ss') + "Z",
                "EndDate": moment(event.date + " " + event.end, "MM/DD/YYYY HH:mm A").format('YYYY-MM-DDTHH:mm:ss') + "Z",
                "Description": event.description || "",
                // "BreakReason": event.reason.Id,
                "Id": event.id ? event.id : ""
            };

            var newEvent = {
                id: event.id ? event.id : "",
                title: event.description || "Time Block",
                start: moment(event.date + " " + event.start, "MM/DD/YYYY HH:mm A").format('YYYY-MM-DDTHH:mm:ss'),
                end: moment(event.date + " " + event.end, "MM/DD/YYYY HH:mm A").format('YYYY-MM-DDTHH:mm:ss'),
                editable: true,
                color: "#FFF176",
                reason: "",
                description: event.description || "",
                departureAddress: event.departureAddress,
                arrivalAddress: event.arrivalAddress,
                type: "break",
                className: 'calendar-event',
                'properties': event
            };

            if (event.id) {
                return _editEvent(newEvent, _eventToSave);
            }

            return _createEvent(newEvent, _eventToSave);
        }

        function _createEvent(newEvent, _eventToSave) {
            var deferred = $q.defer();

            $http.post(WEB_API_SERVICE_URI + 'v1/setup-centers/schedules/breaks/{0}'.format(_setupCenterId), _eventToSave)
                .then(function (res) {
                    var event = res.data;
                    //add constraint
                    newEvent.constraint = _getConstraintValueForBreak(event);

                    //show on the calendar
                    newEvent.id = event.Id;
                    uiDrowzCalendarConfig.addEvent(newEvent);

                    //add to cache array for checking collision
                    _cache['breaks'].push(event);

                    deferred.resolve('Time block is created');
                }, function (err) {
                    deferred.reject(getErrorMsg(err));
                });

            return deferred.promise;
        }

        function _editEvent(event, _eventToSave) {

            var deferred = $q.defer();
            $http.put(WEB_API_SERVICE_URI + 'v1/setup-centers/schedules/breaks/' + event.id, _eventToSave)
                .then(function (res) {
                    //update on the calendar
                    uiDrowzCalendarConfig.updateEvent(event);

                    //find by id and update in cache
                    var index = _.findIndex(_cache['breaks'], ['id', event.id]);
                    _cache['breaks'][index] = event;


                    deferred.resolve('Time block is updated');
                }, function (err) {
                    deferred.reject(getErrorMsg(err));
                });

            return deferred.promise;
        }

        function getBreakById(id) {
            return $http.get(WEB_API_SERVICE_URI + 'v1/setup-centers/schedules/breaks/' + id);
        }

        /**
         * Get all intersaption with items on calendar.
         * @param {moment} dateStart
         * @param {moment} dateEnd
         * @returns {Array} return {id, type}
         */
        function getAllIntersections(dateStart, dateEnd) {
            var d1 = dateStart.unix();
            var d2 = dateEnd.unix();
            var resArr = [];

            for (var type in _cache) {
                angular.forEach(_cache[type], function (item) {
                    var e1 = moment.utc(item.start, 'YYYY-MM-DDThh:mm:ss').unix();
                    var e2 = moment.utc(item.end, 'YYYY-MM-DDThh:mm:ss').unix();

                    if(!(d1 >= e2 || d2 <=e1)){
                        resArr.push(item);
                    }

                });
            }

            return resArr;
        }
    }
})();
