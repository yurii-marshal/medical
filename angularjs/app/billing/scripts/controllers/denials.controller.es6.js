export default class denialsController {
    constructor(
        $state,
        infinityTableService,
        advancedFiltersService,
        denialsService,
        billingDictionariesService,
        changeInProgressStatusService,
        billingsCommonService
    ) {
        'ngInject';

        this.$state = $state;
        this.stateName = 'denials';
        this.infinityTableService = infinityTableService;
        this.advancedFiltersService = advancedFiltersService;
        this.denialsService = denialsService;
        this.billingDictionariesService = billingDictionariesService;
        this.changeInProgressStatusService = changeInProgressStatusService;
        this.billingsCommonService = billingsCommonService;

        this.toolbarItems = [
            {
                text: 'Change Status',
                icon: {
                    url: 'assets/images/default/setup-rect.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.openStatusModal.bind(this)
            },
            {
                text: 'In Progress',
                icon: {
                    url: 'assets/images/default/sand-clock.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.openInProgressModal.bind(this)
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
            ProcessedByFilters: {
                label: 'Processed by',
                placeholder: '+ Users',
                type: 'autocomplete-chips-filter',
                filterName: 'UserIds',
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
                    filterName: 'InProgressDateRangeFrom',
                    filterValue: ''
                },
                filterEnd: {
                    filterName: 'InProgressDateRangeTo',
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
        this.sortExpr = {};
        this.filtersObj = {};
        this.cacheFiltersKey = 'denials';

        this.getDenials = (pageIndex, pageSize) => {
            return denialsService.getDenials(pageIndex, pageSize, this.sortExpr, angular.merge({}, this.filtersObj, this.filters));
        };

        denialsService.getDenialsStatuses()
            .then((response) => this.statuses = response.data);

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
        return this.billingsCommonService.searchBillingPayers(name)
            .then((response) => response.data.Items);
    }

    getClaims(name, pageIndex) {
        return this.billingsCommonService.getClaims(name, pageIndex)
            .then((response) => response.data);
    }

    getDenialsReasons(Text, PageIndex) {
        const params = { Text, PageIndex, selectCount: true };

        return this.billingDictionariesService.getPayerAdjustmentReasons(params)
            .then((response) => response.data);
    }

    selectedItemsArrCount() {
        let arr = this.infinityTableService.getSelectedItems();

        return arr && arr.length;
    }

    openStatusModal() {
        let patientsIds = this.infinityTableService.getSelectedItems().map((item) => item.Id),
            inProgressStatuses = this.infinityTableService.getSelectedItems().map((item) => item.InProgress);

        this.changeInProgressStatusService.openChangeStatusModal(inProgressStatuses, patientsIds, this.stateName, this.statuses);
    }

    openInProgressModal() {
        let patientsIds = this.infinityTableService.getSelectedItems().map((item) => item.Id),
            inProgressStatuses = this.infinityTableService.getSelectedItems().map((item) => item.InProgress);

        this.changeInProgressStatusService.openChangeInProgressModal(inProgressStatuses, patientsIds, this.stateName);
    }

    goToInvoice(invoiceId, serviceLineId) {
        this.$state.go('root.invoice.details', { invoiceId, serviceLineId });
    }

}
