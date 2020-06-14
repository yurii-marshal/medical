import deleteAuthItemsTemplate from './modals/delete-auth-items/delete-auth-items.html';
import DeleteAuthItemsCtrl from './modals/delete-auth-items/delete-auth-items.controller.es6';

export default class authorizationsController {
    constructor(
        $scope,
        $state,
        infinityTableService,
        advancedFiltersService,
        authorizationsService,
        changeInProgressStatusService,
        billingsCommonService,
        patientPayerService,
        $mdDialog,
        bsLoadingOverlayService
    ) {
        'ngInject';

        this.$state = $state;
        this.stateName = 'authorizations';
        this.infinityTableService = infinityTableService;
        this.advancedFiltersService = advancedFiltersService;
        this.authorizationsService = authorizationsService;
        this.changeInProgressStatusService = changeInProgressStatusService;
        this.billingsCommonService = billingsCommonService;
        this.patientPayerService = patientPayerService;
        this.$mdDialog = $mdDialog;

        this.bsLoadingOverlayService = bsLoadingOverlayService;

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
                text: 'Delete',
                icon: {
                    url: 'assets/images/default/trash.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.deleteSelectedItems.bind(this)
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

        this.statuses = [];
        this.filters = {
            'ExpiryDateFrom': moment.utc().format('YYYY-MM-DD'),
            'ExpiryDateTo': moment.utc().add(30, 'days').format('YYYY-MM-DD')
        };
        this.sortExpr = {};
        this.filterObj = {};
        this.cacheFiltersKey = 'authorizations';

        this.getAuthorizations = this._getAuthorizations.bind(this);

        authorizationsService.getAuthorizationsStatuses()
            .then((response) => this.statuses = response.data);

        $scope.$watch(() => this.initFilters.ExpirationDateFilters, () => {
            this.resetExpirationDateSearchFilter();
        }, true);
    }

    _getAuthorizations(pageIndex, pageSize) {
        return this.authorizationsService.getAuthorizations(pageIndex, pageSize, this.sortExpr, angular.merge({}, this.filterObj, this.filters))
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

                    angular.forEach(this.initFilters.ExpirationDateFilters.items, (item) => item.isSelected = false);
                    this.defaultFilteredList.empty = true;
                    if (!this.isDataLoaded) {
                        this.isDataLoaded = true;
                    }
                    this.infinityTableService.reload();
                }
                return response;
            });
    }

    resetExpiryDateListFilters() {
        return !!this.filterObj.ExpiryDateEquals;
    }

    resetExpirationDateSearchFilter() {
        let isFiltersActive = false;

        angular.forEach(this.initFilters.ExpirationDateFilters.items, (item) => {
            if (item.isSelected) {
                isFiltersActive = true;
            }
        });
        if (isFiltersActive) {
            delete this.filterObj.ExpiryDateEquals;
        }
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        this.infinityTableService.toggleItem(item);
    }

    getPatients(name) {
        return this.billingsCommonService.getPatientNames(name)
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

    deleteSelectedItems() {

        this.$mdDialog.show({
            template: deleteAuthItemsTemplate,
            controller: DeleteAuthItemsCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {}
        }).then(() => {
            const selectedIds = this.infinityTableService.getSelectedItems().map((item) => item.Id);

            this.bsLoadingOverlayService.start({ referenceId: 'authorizationsItems' });

            this.patientPayerService.deletePayerAuthorizations(selectedIds).then(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'authorizationsItems' });
                this.infinityTableService.reload();
            });
        });
    }

    openStatusModal() {
        let patientsIds = this.infinityTableService.getSelectedItems().map((item) => item.Id),
            inProgressStatuses = this.infinityTableService.getSelectedItems().map((item) => item.InProgress);

        this.changeInProgressStatusService.openChangeInProgressStatusModal(inProgressStatuses, patientsIds, this.stateName);
    }

    openPatient(patientId) {
        this.$state.go('root.patient.insurances.authorizations-list', { patientId });
    }

}
