export default class cmnsController {
    constructor(
        $scope,
        $state,
        infinityTableService,
        advancedFiltersService,
        cmnsService,
        changeInProgressStatusService,
        documentUpdateService,
        popupMenuCalendar,
        billingsCommonService
    ) {
        'ngInject';

        this.stateName = 'cmns';
        this.$state = $state;
        this.infinityTableService = infinityTableService;
        this.advancedFiltersService = advancedFiltersService;
        this.changeInProgressStatusService = changeInProgressStatusService;
        this.documentUpdateService = documentUpdateService;
        this.popoverMenu = popupMenuCalendar;
        this.billingsCommonService = billingsCommonService;

        this.defaultFilteredList = {};
        this.isDataLoaded = false;

        this.toolbarItems = [
            {
                text: 'In progress',
                icon: {
                    url: 'assets/images/default/sand-clock.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.openStatusModal.bind(this)
            },
            {
                text: 'Request Update',
                icon: {
                    url: 'assets/images/default/update.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.openCmnsUpdateModal.bind(this)
            }
        ];

        this.initFilters = {
            StatusFilters: {
                label: 'Type',
                type: 'radio-button-filter',
                items: [
                    {
                        id: guid(true),
                        displayName: 'All',
                        filterName: '',
                        isSelected: true,
                        isDefault: true
                    },
                    {
                        id: guid(true),
                        displayName: 'In Progress',
                        filterName: 'InProgress',
                        isSelected: false
                    }
                ]
            },
            ExpirationDateFilters: {
                label: 'Expiration as of',
                type: 'select-date-range-filter',
                items: [
                    {
                        id: guid(true),
                        displayName: 'Today',
                        filterStart: {
                            filterName: 'ExpiryDateEquals',
                            filterValue: moment.utc().format('MM/DD/YYYY')
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Next 7 Days',
                        filterStart: {
                            filterName: 'ExpiryDateFrom',
                            filterValue: moment.utc().format('MM/DD/YYYY')
                        },
                        filterEnd: {
                            filterName: 'ExpiryDateTo',
                            filterValue: moment.utc().add(7, 'days').format('MM/DD/YYYY')
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Next 30 Days',
                        filterStart: {
                            filterName: 'ExpiryDateFrom',
                            filterValue: moment.utc().format('MM/DD/YYYY')
                        },
                        filterEnd: {
                            filterName: 'ExpiryDateTo',
                            filterValue: moment.utc().add(30, 'days').format('MM/DD/YYYY')
                        },
                        isSelected: true
                    },
                    {
                        id: guid(true),
                        displayName: 'Custom',
                        filterStart: {
                            filterName: 'ExpiryDateFrom',
                            filterValue: ''
                        },
                        filterEnd: {
                            filterName: 'ExpiryDateTo',
                            filterValue: ''
                        },
                        isSelected: false,
                        isCustom: true
                    }
                ]
            },
            ProcessedByFilters: {
                label: 'Processed by',
                placeholder: '+ Users',
                type: 'autocomplete-chips-filter',
                filterName: 'inProgressBy',
                filterValue: [],
                dictionaryKeyName: 'userName',
                dictionarySearchParams: {
                    searchQueryKey: 'fullName'
                },
                getDictionary: (params) => this.billingsCommonService.getProcessingPerson(params),
                isSelected: false
            },
            ProcessingPeriodFilters: {
                label: 'Processing period',
                type: 'date-range-filter',
                id: guid(true),
                filterStart: {
                    filterName: 'inProgressStartDateFrom',
                    filterValue: ''
                },
                filterEnd: {
                    filterName: 'inProgressStartDateTo',
                    filterValue: ''
                },
                isSelected: false
            }
        };

        this.updateFilters = (response) => {
            if (!_.isEqual(response, this.initFilters)) {
                this.initFilters = angular.copy(response, {});
                this.advancedFiltersService.mapFilterObject(response);
                this.filters = this.advancedFiltersService.getSearchFilters();
                this.infinityTableService.reload();
            }
        };

        this.documentUpdateActions = [
            {
                'Id': '2',
                'Text': 'Fax'
            },
            {
                'Id': '3',
                'Text': 'Print'
            }
        ];

        this.statuses = [];
        this.filters = {
            'ExpiryDateFrom': moment.utc().format('YYYY-MM-DD'),
            'ExpiryDateTo': moment.utc().add(30, 'days').format('YYYY-MM-DD')
        };
        this.sortExpr = {};
        this.filterObj = {};
        this.cacheFiltersKey = 'cmns';
        this.selectedActions = [];
        this.selectedIds = [];

        this.getCmns = (pageIndex, pageSize) => {
            return cmnsService.getCmns(pageIndex, pageSize, this.sortExpr, angular.merge({}, this.filterObj, this.filters))
                .then((response) => {
                    if (response.data.Items.length) {
                        this.defaultFilteredList.empty = false;
                        if (!this.isDataLoaded) { this.isDataLoaded = true; }
                        return response;
                    } else if (!response.data.Items.length && !this.isDataLoaded){
                        this.filters = {
                            'ExpiryDateFrom': '',
                            'ExpiryDateTo': ''
                        };

                        angular.forEach(this.initFilters.ExpirationDateFilters.items, item => {
                            item.isSelected = false;
                        });
                        this.defaultFilteredList.empty = true;
                        if (!this.isDataLoaded) { this.isDataLoaded = true; }
                        this.infinityTableService.reload();
                    }
                    return response;
                });
        };

        cmnsService.getCmnsStatuses()
            .then((response) => this.statuses = response.data);

        $scope.$watch(() => this.initFilters.ExpirationDateFilters, () => {
            this.resetExpirationDateSearchFilter();
        }, true);

    }

    resetExpiryDateListFilters() {
        return !!this.filterObj.ExpiryDateEquals;
    }

    resetExpirationDateSearchFilter() {
        let isFiltersActive = false;
        angular.forEach(this.initFilters.ExpirationDateFilters.items, item => {
            if (item.isSelected) { isFiltersActive = true; }
        });
        if (isFiltersActive) { delete this.filterObj.ExpiryDateEquals; }
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        this.infinityTableService.toggleItem(item);
    }

    getPatients(name) {
        return this.billingsCommonService.getPatientNames(name)
            .then((response) => response.data.Items);
    }

    getCmnsTypes(cmnType) {
        return this.billingsCommonService.getCmnsTypes(cmnType)
            .then((response) => response.data.Items);
    }

    getInsurancePayers(name) {
        return this.billingsCommonService.getInsurancePayerNames(name)
            .then((response) => response.data.Items);
    }

    selectedItemsArrCount() {
        let arr = this.infinityTableService.getSelectedItems();
        return arr && arr.length;
    }

    openStatusModal() {
        let patientsDocIds = this.infinityTableService.getSelectedItems().map(item => item.Id),
            inProgressStatuses = this.infinityTableService.getSelectedItems().map(item => item.InProgress);
        this.changeInProgressStatusService.openChangeInProgressStatusModal(inProgressStatuses, patientsDocIds, this.stateName);
    }

    openUpdateCmnsMenu(ids, event) {
        event.stopPropagation();
        let cmnIds = Array.isArray(ids) ? ids : [ids],
            menuItems = this._getPopoverMenuItems(this.documentUpdateActions, cmnIds, this.stateName);
        this.popoverMenu.showPopupMenu(menuItems, event);
    }

    _getPopoverMenuItems(actions, ids, stateName) {
        let popoverMenuItems = [];
        angular.forEach(actions, (item) => {
            popoverMenuItems.push({
                'title': item.Text,
                'class': 'no-left-icon',
                'exec': () => {
                    switch(item.Id) {
                        case '1': // electronically - not implemented on back
                            break;
                        case '2': // fax
                            this.openCmnUpdateModal(actions, ids, stateName, 2);
                            break;
                        case '3': // print
                            this.documentUpdateByPrint(stateName, ids);
                            break;
                    }
                }
            })
        });
        return popoverMenuItems;
    }

    documentUpdateByPrint(stateName, ids) {
        this.documentUpdateService.documentUpdateByPrint(stateName, ids);
    }

    openCmnUpdateModal(actions, ids, stateName, actionId) {
        let options = { ids, actions, stateName, actionId };
        return this.documentUpdateService.openDocumentUpdateModal(options);
    }

    openCmnsUpdateModal() {
        this.selectedIds = this.infinityTableService.getSelectedItems().map(item => item.Id);

        let options = {
            ids: this.selectedIds,
            actions: [this.documentUpdateActions],
            stateName: this.stateName
        };

        return this.documentUpdateService.openDocumentUpdateModal(options);
    }

    openPatientDocuments(patientId) {
        this.$state.go('root.patient.documents', { patientId });
    }

}
