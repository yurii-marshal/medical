export default class calendarEventsController {
    constructor($scope,
                $rootScope,
                $compile,
                $state,
                ngToast,
                $mdDialog,
                $timeout,
                bsLoadingOverlayService,
                $q,
                eventRenderService,
                advancedFiltersService,
                calendarEventsService,
                coreDictionariesService) {
        'ngInject';

        this.$scope = $scope;
        this.$compile = $compile;
        this.$state = $state;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;

        this.advancedFiltersService = advancedFiltersService;
        this.calendarEventsService = calendarEventsService;

        this.selectedFilter = {};
        this.holidays = [];
        this.savedFilters = [];
        this.workingDays = [];

        this.filters = {};
        this.locationTypes = [];

        this.initFilters = {
            PersonnelFilters: {
                label: 'Team',
                placeholder: '+ team',
                type: 'autocomplete-chips-filter',
                filterName: 'PersonnelIds',
                dictionaryKeyName: 'DisplayText',
                dictionarySearchParams: {
                    searchQueryKey: 'fullName',
                    defaultParams: {
                        sortExpression: 'Name.FullName ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => calendarEventsService.getPersonnelList(params).then((res) => res.data.Items),
                isStaticDictionary: false,
                calendarFitlersOptions: {
                    Type: 2,
                    FilterKey: 'PersonnelIds'
                }
            },
            PersonnelTagFilters: {
                label: 'Team Tags',
                chipsLabel: 'Team Tag',
                placeholder: '+ team tag',
                type: 'autocomplete-chips-filter',
                filterName: 'PersonnelTagIds',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {},
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => calendarEventsService.getPersonnelTagsList(params).then((res) => res.data.Items),
                isStaticDictionary: false,
                calendarFitlersOptions: {
                    Type: 1,
                    FilterKey: 'PersonnelTagIds'
                }
            },
            PatientsFilters: {
                label: 'Patients',
                chipsLabel: 'Patient',
                placeholder: '+ patient',
                type: 'autocomplete-chips-filter',
                filterName: 'PatientIds',
                dictionaryKeyName: 'fullName',
                dictionarySearchParams: {
                    searchQueryKey: 'fullName',
                    defaultParams: {
                        sortExpression: 'Name ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => calendarEventsService.getPatientsDictionary(params).then((res) => res.data.Items),
                isStaticDictionary: false,
                calendarFitlersOptions: {
                    Type: 8,
                    FilterKey: 'PatientIds'
                }
            },
            SetupCentersFilters: {
                label: 'Patient Service Centers',
                chipsLabel: 'Patient Service Center',
                placeholder: '+ service center',
                type: 'autocomplete-chips-filter',
                filterName: 'SetupCenters',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {
                        sortExpression: 'Name ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => calendarEventsService.getSetupCentersDictionary(params).then((res) => res.data.Items),
                isStaticDictionary: false,
                calendarFitlersOptions: {
                    Type: 5,
                    FilterKey: 'SetupCenters'
                }
            },
            AppointmentStatusesFilters: {
                label: 'Appointment Status',
                placeholder: '+ status',
                type: 'autocomplete-chips-filter',
                filterName: 'Statuses',
                dictionaryKeyName: 'Text',
                filterValue: [],
                getDictionary: () => calendarEventsService.getEventStatusesDictionary().then((res) => res.data),
                isStaticDictionary: true,
                calendarFitlersOptions: {
                    Type: 3,
                    FilterKey: 'Statuses'
                }
            },
            ZipCodesFilters: {
                label: 'Location (by Zip Code)',
                placeholder: '+ zip code',
                type: 'autocomplete-chips-filter',
                filterName: 'ZipCodes',
                dictionaryKeyName: 'text',
                dictionarySearchParams: {
                    searchQueryKey: 'text',
                    defaultParams: {},
                    additionalParams: {}
                },
                filterPropName: 'text',
                filterValue: [],
                getDictionary: (params) => coreDictionariesService.getZipCodes(params)
                    .then((res) => res.data.Items),
                isStaticDictionary: false,
                calendarFitlersOptions: {
                    Type: 7,
                    FilterKey: 'ZipCodes'
                }
            },
            OrdersFilters: {
                label: 'Order Tags',
                chipsLabel: 'Order Tag',
                placeholder: '+ order tag',
                type: 'autocomplete-chips-filter',
                filterName: 'OrderTagIds',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {},
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => calendarEventsService.getOrderTagsDictionary(params).then((res) => res.data.Items),
                isStaticDictionary: false,
                calendarFitlersOptions: {
                    Type: 6,
                    FilterKey: 'OrderTagIds'
                }
            }
        };

        this.updateFilters = (response) => {

            if (!_.isEqual(response, this.initFilters)) {
                this.initFilters = angular.copy(response);
                advancedFiltersService.mapFilterObject(response);
                this.filters = this.advancedFiltersService.getSearchFilters();
                this._saveFiltersToLocalStorage();

                const selectedFilter = _.find(this.savedFilters, (item) => {
                    if (!this.selectedFilter || !this.selectedFilter.Id) {
                        return false;
                    }
                    return this.selectedFilter.Id.toString() === item.Id.toString();
                });

                if ( selectedFilter && !this.isFilterSelected(selectedFilter, this.filters) ) {
                    this.$state.params.filter = undefined;
                    this.selectedFilter = {};
                    // this.search(false);
                }

                // if (_.isEmpty(this.filters)) {
                //     this.search(false)
                // }

                this.search(false);
                $scope.$broadcast('fullCalendar.reload');
                this._fireResizeEventForCalendar();
            }
        };

        this.selectCreatedFilter = this._selectCreatedFilter.bind(this);

        if (!this.$state.params.filter) {
            if (_.isEmpty(this.filters)) {
                this._getFiltersFromLocalStorage();
                advancedFiltersService.mapFilterObject(this.initFilters);
                // we set filter to null just to make able to watch changing of filter value
                this.$state.params.filter = null;
                this.filters = this.advancedFiltersService.getSearchFilters();
            }
        }

        this.eventSource = this.getEventsByParams.bind(this);

        this.uiConfig = {
            calendar: {
                calendarId: 'calendarObj',
                editable: true,
                header: {
                    left: '',
                    right: ''
                },
                defaultDate: $state.params.date || moment().format('YYYY-MM-DD'),
                defaultView: $state.params.view || 'month',
                eventLimit: true,
                weekNumbers: false,
                // custom extended settings for buttons in title on week view
                weekTitleAdditionalHtml: `<div class="fc-dn-btn right-buttons-container">
                    <md-button class="schedule-btn visible" 
                               ng-class="{'visible':calendarEv.scheduleAvailable('{0}')}" 
                               ng-click="calendarEv.getSchedule('{0}')" 
                               simple-tooltip="Schedule" 
                               aria-label="..." 
                               ng-if="calendarEv.scheduleAvailable('{0}')">
                        <img src="assets/images/blue_user.png">
                    </md-button>
                    <a href="javascript:void(0)" 
                       class="add-new-appointment-btn" 
                       ng-click="calendarEv.newAppointment('{0}')" 
                       simple-tooltip="New appointment" 
                       aria-label="..." 
                    >
                    </a>
                </div>`,
                viewRender: this.viewRender.bind(this),
                eventRender: eventRenderService.renderEventMainCalendar,
                eventMouseover: eventRenderService.eventMouseover,
                eventMouseout: eventRenderService.eventMouseout,
                eventClick: this.eventClick.bind(this),
                height: document.body.clientHeight - 57,
                scrollTime: '06:00:00'
            }
        };

        $rootScope.$on('logout', () => {
            this._resetFiltersAfterLogout();
        });
    }

    _selectCreatedFilter(filterName) {
        this.calendarEventsService.getSavedFilters({ name: filterName })
            .then((response) => {
                response.data.Items.forEach((item) => {
                    if (item.Name === filterName) {
                        return this.getFilterById(item.Id).then((res) => {
                            this.selectFilter(angular.extend(res.data, { Id: item.Id }));
                        });
                    }
                });
            });
    }

    selectFilter(filter) {
        if (filter) {
            this.selectedFilter = angular.copy(filter);
            this._mapSelectedFilterSet();
            this.search(true);
        }
    }

    getFilterById(Id) {
        return this.calendarEventsService.getFilterById(Id)
            .finally(() => this._fireResizeEventForCalendar());
    }

    _fireResizeEventForCalendar() {
        // fire resize event to make calendar fullscreen with no scrollbars.
        this.$timeout(() => window.dispatchEvent(new Event('resize')), 500);
    }

    deleteFilter(filter) {
        this.calendarEventsService.deleteSavedFilter(filter.Id)
            .then(() => {
                _.remove(this.savedFilters, (savedFilter) => savedFilter.Id === filter.Id);
                this.$state.params.filter = undefined;
                this.ngToast.success('Filter deleted.');
                this.search(false);
            });
    }

    isFilterSelected(filter, newFilters) {
        newFilters = newFilters || this.filters;
        if (!filter || !this.selectedFilter || !filter.Id || !this.selectedFilter.Id) {
            return false;
        }
        const isIdEquival = this.selectedFilter.Id.toString() === filter.Id.toString();
        let filtersObj = {};

        for (let prop in this.selectedFilter.Parameters) {
            const param = this.selectedFilter.Parameters[prop];
            let paramName = this._getFilterNameById(param);

            if (!filtersObj[paramName]) {
                filtersObj[paramName] = [];
            }
            filtersObj[paramName].push(param.Value);
        }

        return isIdEquival && _.isEqual(newFilters, filtersObj);
    }

    _getFilterNameById(param) {
        let paramName;

        switch (param.Type.Id) {
            case 1:
                paramName = 'PersonnelTagIds';
                break;
            case 2:
                paramName = 'PersonnelIds';
                break;
            case 3:
                paramName = 'Statuses';
                break;
            case 5:
                paramName = 'SetupCenters';
                break;
            case 6:
                paramName = 'OrderTagIds';
                break;
            case 7:
                paramName = 'ZipCodes';
                break;
            case 8:
                paramName = 'PatientIds';
                break;
        }

        return paramName;
    }

    viewRender(view, element) {
        if (this.$state.params.filter) {
            this.getFilterById(this.$state.params.filter)
                .then((response) => {
                    this._filterByIdPredefinedFilters(response.data)
                        .finally(() => {
                            this.initCalendar(view, element);
                        });
                });
        } else {
            this.initCalendar(view, element);
        }
    }

    initCalendar(view, element) {
        const params = { pageSize: 100 };

        this.calendarEventsService.getSavedFilters(params)
            .then((response) => {

                this.savedFilters = response.data.Items;
            })
            .finally(() => {
                const start = view.start.format('YYYY-MM-DD');
                const end = view.end.format('YYYY-MM-DD');

                this.calendarEventsService.getAvailableWorkingDays(this.filters, start, end)
                    .then((response) => {
                        this.workingDays = response.data;
                    });

                this.calendarEventsService.getHolidays(start, end)
                    .then((response) => {
                        this.holidays = response.data.Items;
                        this.holidays.forEach((item) => {
                            angular.element(`.fc-day[data-date='${moment(item.Date).format('YYYY-MM-DD')}]`).addClass('calendar-holiday');
                            angular.element(`.fc-day-number[data-date='${moment(item.Date).format('YYYY-MM-DD')}T00:00:00+00:00']`).addClass('calendar-holiday-icon');
                        });
                    });

                this.$compile(element)(this.$scope);
            });
    }

    _filterByIdPredefinedFilters(data) {
        const defer = this.$q.defer();

        this.selectedFilter = {
            Id: this.$state.params.filter,
            Name: data.Name,
            Parameters: data.Parameters
        };

        this._mapSelectedFilterSet();

        defer.resolve();
        return defer.promise;
    }

    _mapSelectedFilterSet() {
        this.advancedFiltersService.resetFilters(this.initFilters);

        angular.forEach(this.selectedFilter.Parameters, (param) => {
            const paramName = this._getFilterNameById(param);

            angular.forEach(this.initFilters, (item) => {
                if (item.filterName === paramName) {
                    item.filterValue.push({
                        Id: param.Value,
                        id: param.Value,
                        [item.dictionaryKeyName]: param.Description
                    });
                }
            });
        });

        this.advancedFiltersService.mapFilterObject(this.initFilters);
        this.filters = this.advancedFiltersService.getSearchFilters();
        this._saveFiltersToLocalStorage();
    }

    eventClick(event, jsEvent, view) {
        this.$timeout(() => this.$state.go('root.calendar-appointment', { appointmentId: event.id }), 0);
    }

    search(isWithFilter) {
        this.bsLoadingOverlayService.start({ referenceId: 'calendar-events' });
        let params = {
            view: this.$state.params.view,
            date: this.$state.params.date
        };

        if (isWithFilter) {
            if (this.selectedFilter && this.selectedFilter.Id) {
                params.filter = this.selectedFilter.Id;
            }
        } else {
            params.filter = '';
        }

        this.uiConfig.calendar.defaultDate = this.$state.params.date || moment().format('YYYY-MM-DD');
        this.uiConfig.calendar.defaultView = this.$state.params.view || 'month';
        this.$state.transitionTo('root.calendar', params, { reload: true, inherit: false, notify: true });
    }

    getEventsByParams(start, end, timezone, callback) {
        if (this.$state.params.filter) {
            this.getFilterById(this.$state.params.filter)
                .then((response) => {
                    this._filterByIdPredefinedFilters(response.data)
                        .finally(() => this.getEventFromServer(start, end, timezone, callback));
                });
            return;
        }

        this.getEventFromServer(start, end, timezone, callback);
    }

    getEventFromServer(start, end, timezone, callback) {
        this._fireResizeEventForCalendar();
        this.bsLoadingOverlayService.start({ referenceId: 'calendar-events' });
        let DatePeriod = {
            From: start.format('YYYY-MM-DD'),
            To: end.format('YYYY-MM-DD')
        };

        this.calendarEventsService.getEvents(DatePeriod, this.filters)
            .then((response) => {
                let events = response.data.Items.map((item) => {
                    return {
                        id: item.Id,
                        start: item.DatePeriod.From,
                        end: item.DatePeriod.To,
                        title: `${item.Patient.Name.FirstName} ${item.Patient.Name.LastName}`,
                        status: item.Status,
                        dateRange: item.DatePeriod,
                        className: 'calendar-event',
                        editable: false,
                        color: '#dddbdb',
                        constraint: 'available',
                        type: 'event',
                        stick: true
                    };
                });

                callback(events);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'calendar-events' }));
    }

    scheduleAvailable(date) {
        if (!this.workingDays || !this.workingDays.length) {
            return false;
        }

        return _.some(this.workingDays, (item) => moment(item).isSame(date, 'day'));
    }

    getSchedule(date) {

        if (this.filters.PersonnelIds && this.filters.PersonnelIds.length) {
            this.calendarEventsService.getSchedule(date, this.filters.PersonnelIds, this.filters.PersonnelTagIds);
        } else if (this.filters.PersonnelTagIds) {
            this.calendarEventsService.getSchedule(date, [], this.filters.PersonnelTagIds);
        } else {
            this.$mdDialog.show(
                this.$mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('')
                    .textContent('Personnel is not selected.')
                    .ariaLabel('...')
                    .ok('OK')
            );
        }
    }

    getSavedFilters(name, pageIndex) {
        let params = {
            name,
            pageIndex,
            sortExpression: 'Name ASC'
        };

        return this.calendarEventsService.getSavedFilters(params)
            .then((response) => response.data);
    }

    filterSelected(selectedFilter) {
        if (!selectedFilter) {
            return false;
        }

        this.$state.params.filter = selectedFilter.Id;

        this.bsLoadingOverlayService.start({ referenceId: 'calendar-events' });
        this.$scope.$broadcast('fullCalendar.reload');
    }

    newAppointment(date) {
        let personnelIds = this.filters.PersonnelIds || [];

        if (this.filters.PersonnelTagIds && this.filters.PersonnelTagIds.length) {
            this.calendarEventsService.getPersonnelList({ tags: this.filters.PersonnelTagIds })
                .then((response) => {
                    response.data.Items.forEach((item) => personnelIds.push(item.Id));
                    this.$state.go('root.appointment_wizard.step1', { personnelIds, date });
                });
        } else {
            this.$state.go('root.appointment_wizard.step1', { personnelIds, date });
        }
    }

    _saveFiltersToLocalStorage() {
        const filtersValuesObj = {};

        for (let prop in this.initFilters) {
            filtersValuesObj[prop] = this.initFilters[prop].filterValue;
        }
        localStorage['calendarFiltersValues'] = angular.toJson(filtersValuesObj);
    }

    _getFiltersFromLocalStorage() {
        if (localStorage['calendarFiltersValues']) {
            const filtersValuesObj = angular.fromJson(localStorage['calendarFiltersValues']);

            for (let prop in filtersValuesObj) {
                this.initFilters[prop].filterValue = filtersValuesObj[prop];
            }
        }
    }

    _resetFiltersAfterLogout() {
        if (localStorage['calendarFiltersValues']) {
            localStorage.removeItem('calendarFiltersValues');
        }
    }
}
