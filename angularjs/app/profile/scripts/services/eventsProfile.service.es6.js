export default class eventsProfileService {
    constructor($q, $http, WEB_API_SERVICE_URI, uiDrowzCalendarConfig) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.uiDrowzCalendarConfig = uiDrowzCalendarConfig;

        this.isScheduleAble = false;
        this.breakReasons = [];

        this._cache = {
            'constraints': [],
            'breaks': [],
            'events': [],
            'setup-centers': [],
            'extra-times': []
        };
    }

    getIsScheduleAble() {
        return this.isScheduleAble;
    }

    setIsScheduleAble(value) {
        this.isScheduleAble = value;
    }

    // can be private
    getEditableEvents() {
        return angular.merge([], this._cache.breaks);
    }

    getBreakById(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnels/schedules/breaks/${id}`);
    }

    /**
     * Get all intersaption with items on calendar.
     * @param {moment} dateStart
     * @param {moment} dateEnd
     * @returns {Array} return {id, type}
     */
    getAllIntersections(dateStart, dateEnd) {
        const d1 = dateStart.unix();
        const d2 = dateEnd.unix();
        let resArr = [];

        for (let type in this._cache) {
            angular.forEach(this._cache[type], (item) => {
                const e1 = moment.utc(item.start, 'YYYY-MM-DDThh:mm:ss').unix();
                const e2 = moment.utc(item.end, 'YYYY-MM-DDThh:mm:ss').unix();

                if (!(d1 >= e2 || d2 <= e1)) {
                    resArr.push(item);
                }

            });
        }

        return resArr;
    }

    // [#15263] rule: only two extra-times sections per day
    hasExtraTimesCollisions(date) {
        let resArr = [];
        const dayToCheck = date.format('MM/DD/YYYY');

        angular.forEach(this._cache['extra-times'], (item) => {
            if (moment.utc(item.start, 'YYYY-MM-DDThh:mm:ss').format('MM/DD/YYYY') === dayToCheck) {
                resArr.push(item);
            }
        });
        return resArr.length >= 2;
    }

    // [#14722] rule: only view for past working hours
    getIsPastDate(date) {
        const dayToCheck = moment(date).utc().startOf('day').unix();
        const today = moment.utc().startOf('day').unix();

        return dayToCheck < today;
    }

    getCalendarData(start, end, doctorId) {
        let promises = [];
        let urls = [];
        let deferred = this.$q.defer();

        /* config for each url */

        // working hours
        urls.push({
            url: `v1/personnels/${doctorId}/schedules`,
            name: 'constraints',
            params: {
                from: start.format('YYYY-MM-DD'),
                to: end.format('YYYY-MM-DD')
            }
        });

        // // extra working hours
        // urls.push({
        //     'url': 'v1/personnels/' + doctorId + '/schedules/extra-times',
        //     'name': 'extraConstraints',
        //     'params': {
        //         'from': start.format('YYYY-MM-DD'),
        //         'to': end.format('YYYY-MM-DD')
        //     }
        // });

        urls.push({
            url: `v1/personnels/${doctorId}/schedules/breaks`,
            name: 'breaks',
            params: {
                from: start.format('YYYY-MM-DD'),
                to: end.format('YYYY-MM-DD')
            }
        });

        urls.push({
            url: `v1/personnels/${doctorId}/schedules/extra-times/`,
            name: 'extra-times',
            params: {
                from: start.format('YYYY-MM-DD'),
                to: end.format('YYYY-MM-DD')
            }
        });

        urls.push({
            url: 'v1/patients/events/search',
            name: 'events',
            method: 'POST',
            data: {
                DatePeriod: {
                    From: start.format('YYYY-MM-DD'),
                    To: end.format('YYYY-MM-DD')
                },
                PersonnelIds: [doctorId]
            }
        });

        urls.push({
            url: `v1/personnel/${doctorId}/setup-center-events`,
            name: 'setup-centers'
        });

        urls.push({
            url: 'v1/personnels/schedules/breaks/reasons/dictionary',
            name: 'break-reasons'
        });
        /* end config for each url */

        // create asynchronous requests for all urls
        angular.forEach(urls, (item) => {
            let promiseOptions = {
                params: item.params,
                method: item.method ? item.method : 'GET',
                url: `${this.WEB_API_SERVICE_URI}${item.url}`
            };

            if (item.data) {
                promiseOptions.data = item.data;
            }

            promises.push(this.$http(promiseOptions));
        });

        /* wait all requests */
        this.$q.all(promises)
            .then((datas) => {
                let result = [];

                for (let i = 0; i < urls.length; i++) {
                    if (urls[i].name === 'break-reasons') {
                        this.breakReasons = datas[i].data;
                        for (let j in this.breakReasons) {
                            if (!this.breakReasons[j].Description) {
                                this.breakReasons[j].Description = this.breakReasons[j].Text;
                            }
                        }
                    } else {
                        const transformedData = this.transformDataFromCalendar(urls[i].name, datas[i].data);

                        result = result.concat(transformedData);
                        this._cache[urls[i].name] = transformedData;
                    }
                }

                // link contraints to breaks
                for (let i = 0; i < this._cache.breaks.length; i++) {
                    let breakItem = this._cache.breaks[i];

                    this._cache.breaks[i].constraint = this._getConstraintValueForBreak(breakItem);
                }

                // return merged results for all urls
                deferred.resolve(result);

            }, (err) => {
                    /* Catch error in one of requests */
                deferred.reject(`[Error] Can't get data from server:
                                         <br/>Url: ${err.config.url}
                                         <br/>Status ${err.status}`);
            });

        return deferred.promise;
    }

    // use it when move/resize break on calendar;
    resizeEvent(event) {
        const _eventToSave = this._breakMapToBack(event);
        const newEvent = this._breakMapToCalendar(event);

        return this._editEvent(newEvent, _eventToSave, true);
    }

    // use it when edit/create break;
    saveEvent(event, doctorId) {
        // prepare event
        const _eventToSave = this._breakMapToBack(event);
        const newEvent = this._breakMapToCalendar(event);

        if (event.id) {
            return this._editEvent(newEvent, _eventToSave);
        }

        return this._createEvent(doctorId, newEvent, _eventToSave);
    }

    _breakMapToBack(event) {
        return {
            Range: {
                From: `${moment(`${event.date} ${event.start}`, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DDTHH:mm:ss') }Z`,
                To: `${moment(`${event.date} ${event.end}`, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DDTHH:mm:ss') }Z`
            },
            Description: event.description || '',
            ReasonId: event.reason.Id,
            DepartureAddress: event.departureAddress,
            ArrivalAddress: event.arrivalAddress,
            Id: event.id ? event.id : ''
        };
    }

    _breakMapToCalendar(event) {
        return {
            id: event.id ? event.id : '',
            title: (event.reason.Description || event.reason.Text) || 'Time Block',
            start: moment(`${event.date} ${event.start}`, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DDTHH:mm:ss'),
            end: moment(`${event.date} ${event.end}`, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DDTHH:mm:ss'),
            editable: true,
            color: '#fff176',
            className: 'calendar-event',
            reason: event.reason || '',
            description: event.description || '',
            departureAddress: event.departureAddress,
            arrivalAddress: event.arrivalAddress,
            type: 'break'
        };
    }

    _createEvent(doctorId, newEvent, _eventToSave) {
        let deferred = this.$q.defer();

        this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnels/${doctorId}/schedules/breaks`, this.cleanUpPostModel(_eventToSave))
            .then((res) => {
                let event = res.data;
                // add constraint

                newEvent.constraint = this._getConstraintValueForBreak(event);

                // show on the calendar
                newEvent.id = event.Id;
                this.uiDrowzCalendarConfig.addEvent(newEvent);

                // add to cache array for checking collision
                this._cache.breaks.push(event);

                deferred.resolve('Time block is created');
            }, (err) => {
                deferred.reject(getErrorMsg(err));
            });

        return deferred.promise;
    }

    _editEvent(event, _eventToSave, onlyResize) {
        let deferred = this.$q.defer(), requestOptions;

        if (!onlyResize) {
            requestOptions = {
                method: 'PUT',
                url: `${this.WEB_API_SERVICE_URI}v1/personnels/schedules/breaks/${event.id}`,
                data: this.cleanUpPostModel(_eventToSave)
            };
        } else {
            // only move/resize - chenge dates
            requestOptions = {
                method: 'PUT',
                url: `${this.WEB_API_SERVICE_URI}v1/personnels/schedules/breaks/${event.id}/change`,
                data: this.cleanUpPostModel(_eventToSave)
            };
        }

        this.$http(requestOptions)
            .then(() => {
                // update on the calendar
                this.uiDrowzCalendarConfig.updateEvent(event);

                // find by id and update in cache
                let index = _.findIndex(this._cache.breaks, ['id', event.id]);

                this._cache.breaks[index] = event;

                deferred.resolve('Time block is updated');
            }, (err) => {
                deferred.reject(getErrorMsg(err));
            });

        return deferred.promise;
    }

    deleteEvent(id) {
        let deferred = this.$q.defer();

        this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/personnels/schedules/breaks/${id}`)
            .then(() => {
                // delete on the calendar
                this.uiDrowzCalendarConfig.delEvent(id);
                // delete in the cache
                _.remove(this._cache.breaks, ['id', id]);

                deferred.resolve('Time block is deleted');
            }, (err) => {
                deferred.reject(getErrorMsg(err));
            });

        return deferred.promise;
    }

    getConstraintByDay(date) {
        return _.find(this._cache.constraints, (item) => {
            // Constraints doesn't have 'tooltip' property
            return moment.utc(item.start, 'YYYY-MM-DDThh:mm').format('YYYY-MM-DD') === date
                && !item.hasOwnProperty('tooltip');
        });
    }

    getExtraConstraintByDay(date) {
        return _.find(this._cache.extra-times, (item) => {
            // Constraints doesn't have 'tooltip' property
            return moment.utc(item.start, 'YYYY-MM-DDThh:mm').format('YYYY-MM-DD') === date
                && !item.hasOwnProperty('tooltip');
        });
    }

    getConstraintById(id) {
        let deferred = this.$q.defer();

        this.$http({
            method: 'GET',
            url: `${this.WEB_API_SERVICE_URI}v1/personnels/schedules/${id}`
        }).then((res) => {
            if (res.data && res.data.Range && res.data.Range.From && res.data.Range.To) {
                deferred.resolve(res.data);
            } else {
                deferred.reject('[Error] Can\'t get data from server');
            }
        }, (err) => {
            deferred.reject(getErrorMsg(err));
        });

        return deferred.promise;
    }

    getExtraConstraintById(id) {
        let deferred = this.$q.defer();

        this.$http({
            method: 'GET',
            url: `${this.WEB_API_SERVICE_URI}v1/personnels/schedules/extra-times/${id}`
        }).then((res) => {
            if (res.data && res.data.Range && res.data.Range.From && res.data.Range.To) {
                deferred.resolve(res.data);
            } else {
                deferred.reject('[Error] Can\'t get data from server');
            }
        }, (err) => {
            deferred.reject(getErrorMsg(err));
        });

        return deferred.promise;
    }

    _getConstraintValueForBreak(breakItem) {
        const constraint = this.getConstraintByDay(
            moment.utc( (breakItem.start ? breakItem.start : breakItem.Range.From), 'YYYY-MM-DDThh:mm').format('YYYY-MM-DD')
        );

        return constraint ? constraint.id : { start: '00:00', end: '00:00' };
    }

    saveConstraint(constraint, doctorId) {
        let deferred = this.$q.defer();

        if (!constraint.Id) {
            this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnels/${doctorId}/schedules`, this.cleanUpPostModel(constraint))
                .then((res) => deferred.resolve(res.data),
                      (err) => deferred.reject(getErrorMsg(err)));
        } else {
            this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnels/schedules/${constraint.Id}`, this.cleanUpPostModel(constraint))
                .then((res) => deferred.resolve(res.data),
                      (err) => deferred.reject(getErrorMsg(err)));
        }

        return deferred.promise;
    }

    saveExtraConstraint(constraint, doctorId) {
        let deferred = this.$q.defer();

        if (!constraint.Id) {
            this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnels/${doctorId}/schedules/extra-times`, this.cleanUpPostModel(constraint))
                .then((res) => deferred.resolve(res.data),
                      (err) => deferred.reject(getErrorMsg(err)));
        } else {
            this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnels/schedules/extra-times/${constraint.Id}`, this.cleanUpPostModel(constraint))
                .then((res) => deferred.resolve(res.data),
                    (err) => deferred.reject(getErrorMsg(err)));
        }

        return deferred.promise;
    }

    deleteConstraint(id) {
        let deferred = this.$q.defer();

        this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/personnels/schedules/${id}`)
            .then((res) => deferred.resolve(res.data),
                  (err) => deferred.reject(getErrorMsg(err)));

        return deferred.promise;
    }

    deleteExtraConstraint(id) {
        let deferred = this.$q.defer();

        this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/personnels/schedules/extra-times/${id}`)
            .then((res) => deferred.resolve(res.data),
                  (err) => deferred.reject(getErrorMsg(err)));

        return deferred.promise;
    }

    checkDateForBreak(date) {
        let isPassed = false;

        // Check collision with constraints
        angular.forEach(this._cache.constraints, (constraint) => {
            const start = moment.utc(constraint.start, 'YYYY-MM-DDThh:mm');
            const end = moment.utc(constraint.end, 'YYYY-MM-DDThh:mm');

            if (date >= start && date < end) {
                isPassed = true;
            }
        });

        // //Check collision with events
        if (isPassed) {
            angular.forEach(this._cache.events, (event) => {
                // exclude system event(they don't have title) and event with bad dateStart and dateEnd
                if (event.title && event.start && event.end) {
                    const start = moment.utc(event.start, 'YYYY-MM-DDThh:mm:ss');
                    const end = moment.utc(event.end, 'YYYY-MM-DDThh:mm:ss');

                    // check if newEvent somehow started in exist event
                    if (date >= start && date < end) {
                        isPassed = false;
                    }
                }
            });
        }

        return isPassed;
    }

    checkDate(date) {
        let isPassed = [];

        angular.forEach(this._cache.constraints, (constraint) => {
            const start = moment.utc(constraint.start, 'YYYY-MM-DDThh:mm');
            const end = moment.utc(constraint.end, 'YYYY-MM-DDThh:mm');

            if (date.utc() >= start && date < end.utc()) {
                isPassed.push('constraints');
                return;
            }
        });

        angular.forEach(this._cache.setup-centers, (setupCenter) => {
            const start = moment.utc(setupCenter.start, 'YYYY-MM-DDThh:mm');
            const end = moment.utc(setupCenter.end, 'YYYY-MM-DDThh:mm');

            if (date.utc() >= start && date < end.utc()) {
                isPassed.push('setup-centers');
                return;
            }
        });

        angular.forEach(this._cache.extra-times, (extraTime) => {
            const start = moment.utc(extraTime.start, 'YYYY-MM-DDThh:mm');
            const end = moment.utc(extraTime.end, 'YYYY-MM-DDThh:mm');

            if (date.utc() >= start && date < end.utc()) {
                isPassed.push('extra-times');
                return;
            }
        });

        if (isPassed.length === 0) {
            isPassed.push('empty-area');
        }

        return isPassed;
    }

    transformDataFromCalendar(typeOfItem, data) {
        let result = [];

        switch (typeOfItem) {
            case 'constraints': // working hours
                angular.forEach(data.Items, (item) => {
                    result.push({
                        id: item.Id,
                        start: moment.utc(item.Range.From).format('YYYY-MM-DDTHH:mm:ss'),
                        end: moment.utc(item.Range.To).format('YYYY-MM-DDTHH:mm:ss'),
                        rendering: 'background',
                        type: 'constraint',
                        color: '#def6da',
                        className: 'calendar-working-hours'
                    });
                });
                break;

            case 'breaks':
                angular.forEach(data.Items, (item) => {
                    let isEditable = true;

                    // Disable editing for past tens
                    if (+moment(item.Range.From).format('YYYYMD') < +moment().format('YYYYMD')) {
                        isEditable = false;
                    }

                    result.push({
                        id: item.Id,
                        description: item.Description,
                        start: moment.utc(item.Range.From).format('YYYY-MM-DDTHH:mm:ss'),
                        end: moment.utc(item.Range.To).format('YYYY-MM-DDTHH:mm:ss'),
                        reason: item.Reason,
                        title: item.Reason.Description,
                        type: 'break',
                        color: '#fff176',
                        className: 'calendar-event',
                        properties: item,
                        editable: isEditable
                    });
                });
                break;

            case 'events':
                angular.forEach(data.Items, (item) => {
                    result.push({
                        id: item.Id,
                        editable: false,
                        start: moment.utc(item.DatePeriod.From).format('YYYY-MM-DDTHH:mm:ss'),
                        end: moment.utc(item.DatePeriod.To).format('YYYY-MM-DDTHH:mm:ss'),
                        title: `${item.Patient.Name.FirstName} ${item.Patient.Name.LastName}`, // + (item.Orders.length > 0 ? " - " + item.Orders[0].OrderType.Text : ""),
                        type: 'event',
                        color: '#DDDBD1',
                        className: 'calendar-event',
                        properties: item
                    });
                });
                break;

            case 'setup-centers':
                angular.forEach(data, (item) => {
                    result.push({
                        id: item.Id,
                        start: moment.utc(item.DateRange.From).format('YYYY-MM-DDTHH:mm:ss'),
                        end: moment.utc(item.DateRange.To).format('YYYY-MM-DDTHH:mm:ss'),
                        title: item.SetupCenter.Name,
                        address: item.SetupCenter.Address.FullAddress,
                        rendering: 'background',
                        type: 'setup-center',
                        color: '#b4e5fc'
                    });
                });
                break;

            case 'extra-times':
                angular.forEach(data.Items, (item) => {
                    result.push({
                        title: item.Description,
                        id: item.Id,
                        start: moment.utc(item.Range.From).format('YYYY-MM-DDTHH:mm:ss'),
                        end: moment.utc(item.Range.To).format('YYYY-MM-DDTHH:mm:ss'),
                        rendering: 'background',
                        type: 'extra-hours'
                    });
                });
                break;

            default:
                break;

        }

        return result;
    }

    getBreakReasons() {
        return this.breakReasons;
    }

    cleanUpPostModel(constraint) {
        let model = {
            Range: {
                From: constraint.Range.From,
                To: constraint.Range.To
            },
            Description: constraint.Description || '',
            Id: constraint.Id || ''
        };

        // if breaks should send reason
        if (constraint.hasOwnProperty('ReasonId')) {
            model.ReasonId = constraint.ReasonId;
        }

        if (this.isScheduleAble) {
            // DepartureAddress, ArrivalAddress is not required
            // set property only if any of properties is set in other case model not include in request
            angular.extend(model,
                getAddressFromSource('DepartureAddress', constraint),
                getAddressFromSource('ArrivalAddress', constraint)
            );

        }

        // prepare address
        function getAddressFromSource(addressType, source) {
            let item = source[addressType],
                res = {};

            if (!item) {
                return res;
            }

            for (let key in item) {
                // no value move next
                if (!item[key]) {
                    continue;
                }

                res[addressType] = {
                    AddressLine: item.AddressLine,
                    AddressLine2: item.AddressLine2,
                    City: item.City,
                    // if view return in wrong format, not object only value
                    Zip: item.Zip.id || item.Zip || '',
                    State: item.State.Id || item.State || ''
                };

                return res;
            }
        }

        return model;
    }

}
