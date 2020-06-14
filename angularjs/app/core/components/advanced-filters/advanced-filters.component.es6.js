import template from './advanced-filters.html';

class advancedFiltersCtrl {
    constructor($scope, $mdDialog, advancedFiltersService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.advancedFiltersService = advancedFiltersService;
        this.selectedFilters = [];

        if (this.cacheFiltersKey) {
            const savedFilters = this.advancedFiltersService.getSavedFilters(this.cacheFiltersKey);

            if (savedFilters && !this.rewriteCacheFilters) {
                this.initFilters = savedFilters;
                this.updateFilters(savedFilters);
            } else {
                this.advancedFiltersService.saveFilters(this.cacheFiltersKey, this.initFilters);
            }
        }
        this.options = angular.copy(this.initFilters, {});

        this.isHiddenChips = this.defaultFilteredList !== undefined;

        this._getSelectedFilters(this.options);

        if (this.selectCreatedFilter) {
            $scope.$watch(() => this.isFilterSet, (newVal, oldVal) =>  {
                if (newVal !== oldVal) {
                    this._getSelectedFilters(angular.copy(this.initFilters, {}));
                    this.options = angular.copy(this.initFilters, {});
                }
            });
        }

        $scope.$watch(() => this.isResetExpirationDate, (newVal, oldVal) =>  {
            if (newVal) {
                let selectedItem = _.find(this.options.ExpirationDateFilters.items, item => item.isSelected);

                if (selectedItem) {
                    this.deleteSelectedFilter({
                        id: selectedItem.id,
                        key: 'ExpirationDateFilters'
                    });
                }

            }
        });

        if (this.defaultFilteredList) {
            $scope.$watch(() => this.defaultFilteredList, (newVal) => {
                if (newVal && newVal.empty === true) {
                    this.isHiddenChips = true;
                    this.resetFilters(this.options);
                } else if (newVal && newVal.empty === false) {
                    this.isHiddenChips = false;
                }
            }, true);
        }

        if (this.options.ProcessedByFilters) {
            $scope.$watch(() => this.options.ProcessedByFilters, () =>  {
                this._setInprogessIfRequired();
            }, true);
        }

        if (this.options.ProcessingPeriodFilters) {
            $scope.$watch(() => this.options.ProcessingPeriodFilters, () =>  {
                this._setInprogessIfRequired();
            }, true);
        }

        if (this.options.OrderResupplyProgramsFilters) {
            $scope.$watch(() => this.options.OrderResupplyProgramsFilters, (newVal) => {
                if (newVal) {
                    let selectedItem = _.find(this.options.OrderResupplyProgramsFilters.items,
                        item => item.isSelected);
                    this._disableSubfilters('OrderResupplyProgramsFilters',
                        selectedItem.displayName === 'Not Available');
                }
            }, true)
        }

        if (this.options.OrderResupplyProgramsFilters) {
            $scope.$watch(() => this.options, (newVal) => {
                this.options.OrderRPReferenceFilters.dictionarySearchParams.additionalParams =
                    this._getOrderRefDictionaryFilters();
            }, true)
        }
    }

    openFilters() {
        let options = this.options,
            resetAllInModal = this.resetAll.bind(this),
            revertAllInModal = this.revertAll.bind(this);

        this.$mdDialog.show({
            templateUrl: 'core/components/advanced-filters/modal/advanced-filters-modal.html',
            controller: 'advancedFiltersModalCtrl',
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { options, resetAllInModal, revertAllInModal, isSaveFilter: this.isSaveFilter }
        }).then((response) => {
            if (response) {
                if (typeof response === 'string') {
                    this.selectCreatedFilter(response);
                } else {
                    this.onFiltersUpdate(response);
                    this._getSelectedFilters(response);
                }
            }
        });
    }

    _disableSubfilters(parentFilter, isDisabled) {
        for (let key in this.options) {
            if (this.options[key].parentFilter === parentFilter) {
                this.options[key].isDisabled = isDisabled;
            }
        }
    }

    _getOrderRefDictionaryFilters() {
        let parentFilter = 'OrderResupplyProgramsFilters';
        let additionalParams = {};
        for(let key in this.options) {
            let selectedFilter = _.find(this.options[key].items, (i) => i.isSelected);
            if (selectedFilter && this.options[key].parentFilter === parentFilter) {
                switch (key) {
                    case 'OrderResupplyProgramsFilters':
                    case 'OrderRPStatusFilters':
                        additionalParams[`${selectedFilter.filterName}`] =
                            selectedFilter.filterValue;
                        break;
                }
            }
        }
        return additionalParams;
    }

    _getSelectedFilters(filtersObj) {
        this.selectedFilters = this.advancedFiltersService.getSelectedFilters(filtersObj);
    }

    _checkInProgressRequiredChips() {
        let isProcessedBySelected = _.findIndex(this.selectedFilters, {key: 'ProcessedByFilters'}) !== -1;
        let isProcessedPeriodSelected = _.findIndex(this.selectedFilters, {key: 'ProcessingPeriodFilters'}) !== -1;

        if (!isProcessedBySelected && !isProcessedPeriodSelected) {
            let inProgressChipsIndex = _.findIndex(this.selectedFilters, {key: 'StatusFilters'});
            if (inProgressChipsIndex !== -1) {
                this.selectedFilters[inProgressChipsIndex].isInProgressRequired = false;
            }
        }
    }

    _checkInProgressRequiredInModal() {
        let startDate, endDate, processedUsers;

        if (this.options.ProcessedByFilters) {
            processedUsers = this.options.ProcessedByFilters.filterValue.length;
        }
        if (this.options.ProcessingPeriodFilters) {
            startDate = this.options.ProcessingPeriodFilters.filterStart.filterValue
                && this.options.ProcessingPeriodFilters.filterStart.filterValue.length,
                endDate = this.options.ProcessingPeriodFilters.filterEnd.filterValue
                    && this.options.ProcessingPeriodFilters.filterEnd.filterValue.length;
        }

        return (startDate || endDate || processedUsers);
    }

    _setInprogessIfRequired() {
        if (this._checkInProgressRequiredInModal()) {
            angular.forEach(this.options.StatusFilters.items, (item) => {
                item.isSelected = !item.isDefault;
                item.isInProgressRequired = !item.isDefault;
            });
            this.options.StatusFilters.isDisabled = true;
        } else {
            delete this.options.StatusFilters.isDisabled;
            angular.forEach(this.options.StatusFilters.items, (item) => {
                item.isInProgressRequired = false;
            });
        }
    }

    _removeProcessedByFIlter() {
        let isProcessedBySelected = _.findIndex(this.selectedFilters, {key: 'ProcessedByFilters'}) !== -1;

        if (isProcessedBySelected) {
            let index = _.findIndex(this.selectedFilters, {key: 'ProcessedByFilters'});
            let selectedFilterId = this.selectedFilters[index].id || this.selectedFilters[index].Id;

            this.selectedFilters.splice(index, 1);
            this.advancedFiltersService.deleteFilter(this.options, 'ProcessedByFilters', selectedFilterId);
        } else {
            return;
        }
        this._removeProcessedByFIlter();
    }

    _removeProcessingPeriodFIlter() {
        let isProcessedPeriodSelected = _.findIndex(this.selectedFilters, {key: 'ProcessingPeriodFilters'}) !== -1;

        if (isProcessedPeriodSelected) {
            let index = _.findIndex(this.selectedFilters, {key: 'ProcessingPeriodFilters'});
            let selectedFilterId = this.selectedFilters[index].id || this.selectedFilters[index].Id;

            this.selectedFilters.splice(index, 1);
            this.advancedFiltersService.deleteFilter(this.options, 'ProcessingPeriodFilters', selectedFilterId);
        } else {
            return;
        }
    }

    getInProgressRequiredMsg(filter) {
        let isProcessedBySelected = _.findIndex(this.selectedFilters, {key: 'ProcessedByFilters'}) !== -1;
        let isProcessedPeriodSelected = _.findIndex(this.selectedFilters, {key: 'ProcessingPeriodFilters'}) !== -1;

        let msg = `Removing filtering by In Progress type you will also clear
                  ${isProcessedBySelected ? 'Processed by' : ''} 
                  ${isProcessedPeriodSelected ? '/' : ''}
                  ${isProcessedPeriodSelected ? 'Processed Period' : ''} filter. 
                  Do you want to continue?`;

        return msg;
    }

    deleteSelectedFilter(filter) {
        let selectedFilterId = filter.id || filter.Id,
            indexInArr =  _.findIndex(this.selectedFilters, {
                id: selectedFilterId,
                key: filter.key
            });

        this.selectedFilters.splice(indexInArr, 1);

        this.advancedFiltersService.deleteFilter(this.options, filter.key, selectedFilterId);
        this.onFiltersUpdate(this.options);

        this._checkInProgressRequiredChips();
    }

    deleteInProgressRequiredFilters(filter) {
        let selectedFilterId = filter.id || filter.Id,
            indexInArr =  _.findIndex(this.selectedFilters, {
                id: selectedFilterId,
                key: filter.key
            });

        this.selectedFilters.splice(indexInArr, 1);

        if (filter.isInProgressRequired) {
            this._removeProcessedByFIlter();
            this._removeProcessingPeriodFIlter();
        }

        this.advancedFiltersService.deleteFilter(this.options, filter.key, selectedFilterId);
        this.onFiltersUpdate(this.options);

    }

    resetAll(filtersObj) {
        this.options = this.advancedFiltersService.resetFilters(filtersObj);
    }

    revertAll() {
        this.options = angular.copy(this.initFilters, {});
    }

    resetFilters(filtersObj) {
        this.resetAll(filtersObj);
        this.selectedFilters = [];
        this.onFiltersUpdate(this.options);
    }

    onFiltersUpdate(filters) {
        if (this.cacheFiltersKey) {
            this.advancedFiltersService.saveFilters(this.cacheFiltersKey, filters);
        }
        this.updateFilters(filters);
    }

}

const advancedFilters = {
    bindings: {
        cacheFiltersKey: '=?',
        rewriteCacheFilters: '=?',
        initFilters: '<',
        updateFilters: '=',
        defaultFilteredList: '<?',
        isResetExpirationDate: '<?',
        isSaveFilter: '<?',
        selectCreatedFilter: '=?',
        isFilterSet: '=?'
    },
    template,
    controller: advancedFiltersCtrl
};

export default advancedFilters;
