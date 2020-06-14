export default class calendarEventsService {
    constructor(
        $filter,
        $mdDialog,
        $q,
        $http,
        WEB_API_SERVICE_URI,
        corePatientService
    ) {
        'ngInject';

        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.corePatientService = corePatientService;
    }

    getEvents(DatePeriod, params) {
        if (_.isEmpty(params)) {
            const deferred = this.$q.defer();
            deferred.resolve({ data: { Items: [] } });
            return deferred.promise;
        }

        const model = angular.merge({}, params, { DatePeriod });
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/events/search`, model);
    }

    getSavedFilters(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/calendar/filters`, { params });
    }

    saveFilter(initFilters, filter, filterName, filterId) {
        const model = getFilterPostModel();

        if (filterId) {
            return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/calendar/filters/${filterId}`, model);
        } else {
            return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/calendar/filters`, model);
        }

        function getFilterPostModel() {
            let model = {
                Name: filterName,
                Parameters: []
            };

            angular.forEach(filter, (item, key) => {
                item.forEach((value) => {
                    const paramObj = getFilterType(value, key);
                    if (paramObj) { model.Parameters.push(paramObj); }
                });
            });
            return model;
        }

        function getFilterType(value, filterName) {
            let result;
            angular.forEach(initFilters, (item) => {
                if (_.has(item, 'calendarFitlersOptions.Type')
                    && _.has(item, 'calendarFitlersOptions.FilterKey')
                    && item.calendarFitlersOptions.FilterKey === filterName) {
                    result = {
                        Type: item.calendarFitlersOptions.Type,
                        Value: value
                    };
                }
            });
            return result;
        }
    }

    deleteSavedFilter(id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/calendar/filters/${id}`);
    }

    getFilterById(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/calendar/filters/${id}`);
    }

    getPersonnelList(params) {
        params = angular.merge(params);
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel`, { params })
            .then((response) => {
                response.data.Items.forEach((item) => item.DisplayText = this.$filter('fullname')(item.Name));
                return response;
            })
    }

    getPersonnelTagsList(params) {
        params = angular.merge(params, { sortExpression: 'Name ASC' });
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel/tags`, { params });
    }

    getPatientsDictionary(params) {
        return this.corePatientService.getPatientsDictionary(params)
            .then((response) => {
                response.data.Items.forEach((item) => item.fullName = item.Name.FullName);
                return response;
            });
    }

    getSetupCentersDictionary(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/setup-centers/dictionary`, { params });
    }

    getEventStatusesDictionary(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/statuses/dictionary`, { params });
    }

    getZipCodes(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}dictionaries/zip-codes`, { cache: true, params });
    }

    getOrderTagsDictionary(params) {
        params = angular.merge(params, { sortExpression: 'Name ASC' });
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/tags`, { params });
    }

    getAvailableWorkingDays(filters, from, to) {
        const params = {
            from, to,
            personnel: filters.PersonnelIds,
            tags: filters.PersonnelTagIds,
            centers: filters.SetupCenters
        };

        if ((!params.personnel || !params.personnel.length)
            && (!params.tags || !params.tags.length)
            && (!params.centers || !params.centers.length)
        ) {
            // if personnel and tag params are empty don't send any request and return mock object;
            let deferred = this.$q.defer();

            deferred.resolve({ data: { Items: [] } });
            return deferred.promise;
        }

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/calendar/personnel/available-working-days`, { params });
    }

    getHolidays(startDate, endDate) {
        const params = {
            startDate, endDate,
            alwaysAnnualSelected: false
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/setting/holidays`, { params });
    }

    getSchedule(date, personnel, tags, centers) {
        if ((personnel && personnel.length)
            || (tags && tags.length)
            || (centers && centers.length)
        ) {
            const params = { personnel, tags, centers };
            let schedules = [];

            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/calendar/personnel/schedules/${date}`, { params })
                .then((response) => {
                    schedules = _.map(response.data, (schedule) => {
                        return {
                            fullName: schedule.Personnel.Name.FullName,
                            workingHours: _.map(schedule.WorkingHours, (workingHour) => {
                                return {
                                    from: moment(workingHour.From).format('hh:mm A'),
                                    to: moment(workingHour.To).format('hh:mm A')
                                };
                            }),
                            extraTimes: _.map(schedule.ExtraTimes, (extraTime) => {
                                return {
                                    from: moment(extraTime.From).format('hh:mm A'),
                                    to: moment(extraTime.To).format('hh:mm A')
                                };
                            })
                        };
                    });
                })
                .finally(() => {
                    this.$mdDialog.show({
                        controller: 'appointmentScheduleController as schedule',
                        templateUrl: 'calendar/views/modals/appointmentSchedules.html',
                        parent: angular.element(document.body),
                        clickOutsideToClose: false,
                        locals: { schedules, date }
                    });
                });
        }
    }
}
