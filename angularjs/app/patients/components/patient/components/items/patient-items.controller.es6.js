export default class patientItemsController {
    constructor($state, $mdDialog, $q, bsLoadingOverlayService, patientService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientService = patientService;

        this.patientId = $state.params.patientId;
        this.type = $state.params.type;
        this.expandedHistoryList = false;

        this.lastSearchText = '';
        this.filterText = {
            Name: ''
        };
        this.filters = {
            DeliveryDateFrom: '',
            DeliveryDateTo: ''
        };
        this.tabs = [
            { title: 'Inventoried Items', view: 'inventory' },
            { title: 'Non-Inventoried Items', view: 'manual' },
            { title: 'Drop Ship Items', view: 'drop-ship' }
        ];

        this._getPatientItems();
    }

    getPatientItemsByKey(key) {
        if (this.allItems[key].stopLoading) {
            return;
        }

        const params = angular.merge(this.filterText, this.filters, {
            pageSize: this.allItems[key].pageSize,
            pageIndex: this.allItems[key].pageIndex
        });

        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        const itemsPromise = key === 'current' ?
            this.patientService.getPatientCurrentItems(this.patientId, this.type, params) :
            this.patientService.getPatientHistoryItems(this.patientId, params);

        itemsPromise
            .then((response) => {
                this.allItems[key].pageIndex++;
                this.allItems[key].stopLoading = response.data.length < this.allItems[key].pageSize;
                this.allItems[key].totalCount += response.data.length;

                response.data.forEach((item) => {
                    this.allItems[key].items.push(item);
                });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    _resetAllItems() {
        this.allItems = {
            current: {
                pageSize: 10,
                pageIndex: 0,
                stopLoading: false,
                items: [],
                totalCount: 0
            },
            history: {
                pageSize: 10,
                pageIndex: 0,
                stopLoading: false,
                items: [],
                totalCount: 0
            }
        };
    }

    _getPatientItems() {

        const promises = [];

        this._resetAllItems();

        this.lastSearchText = this.filterText.Name;

        let params = angular.merge(this.filterText, this.filters);

        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        let currentItemsPromise = this.patientService.getPatientCurrentItems(this.patientId, this.type, params)
            .then((response) => {
                this.allItems.current.totalCount = response.data.length;
                this.allItems.current.items = response.data;
                this.allItems.current.pageIndex++;
                this.allItems.current.stopLoading = response.data.length < this.allItems.current.pageSize;
            });

        promises.push(currentItemsPromise);

        if (this.type === 'inventory') {
            const historyItemsPromise = this.patientService.getPatientHistoryItems(this.patientId, params)
                .then((response) => {
                    this.allItems.history.totalCount = response.data.length;
                    this.allItems.history.items = response.data;
                    this.allItems.history.pageIndex++;
                    this.allItems.history.stopLoading = response.data.length < this.allItems.history.pageSize;
                    this.expandedHistoryList = (response.data.length > 0) && this._isFilterApplied();
                });

            promises.push(historyItemsPromise);
        }

        this.$q.all(promises)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    searchByText($event) {
        if (!this.filterText.Name) {
            return;
        }
        if (($event.type === 'keydown' && $event.keyCode === 13) || $event.type === 'click') {
            this._getPatientItems();
        }
    }

    searchByFilter() {
        if (this.filtersForm.$valid) {
            this._getPatientItems();
        }
    }

    clearSearchByText() {
        if (!this.filterText.Name || this.lastSearchText !== this.filterText.Name) {
            this._getPatientItems();
        }
    }

    clearFilters() {

        this.filterText.Name = '';
        this.filters = {
            DeliveryDateFrom: '',
            DeliveryDateTo: ''
        };
        this.clearSearchByText();

    }

    _isFilterApplied() {
        return !!(this.filterText.Name || this.filters.DeliveryDateFrom || this.filters.DeliveryDateTo);
    }
}
