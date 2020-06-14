export default class advancedFiltersService {
    constructor() {
        'ngInject';

        this.filters = {};
        this.savedFilters = {};
    }

    getSearchFilters() {
        return this.filters;
    }

    mapFilterObject(filtersObj) {
        this.filters = {};

        for (let key in filtersObj) {
            switch (filtersObj[key].type) {
                case 'radio-button-filter':
                    this._mapRadioBtnFilter(filtersObj[key].items);
                    break;
                case 'checkbox-filter':
                    this._mapCheckboxFilter(filtersObj[key]);
                    break;
                case 'select-date-range-filter':
                    this._mapSelectDateRangeFilter(filtersObj[key].items);
                    break;
                case 'select-input-range-filter':
                    this._mapSelectInputRangeFilter(filtersObj[key].items);
                    break;
                case 'autocomplete-chips-filter':
                    this._mapAutocompleteChipsFilter(filtersObj[key], key);
                    break;
                case 'autocomplete-filter':
                    this._mapAutocompleteFilter(filtersObj[key]);
                    break;
                case 'date-range-filter':
                    this._mapDateRangeFilter(filtersObj[key]);
            }
        }
    }

    _mapRadioBtnFilter(items) {
        const selected = items.find((item) => item.isSelected && !!item.filterName);
        const filterNameItem = items.find((item) => !!item.filterName);

        if (selected) {
            this.filters[selected.filterName] = selected.filterValue || true;
        } else if (filterNameItem) {
            this.filters[filterNameItem.filterName] = null;
        }
    }

    _mapCheckboxFilter(filter) {
        if (filter.filterName) {
            this.filters[filter.filterName] = [];
        }

        angular.forEach(filter.items, (item) => {
            if (item.isSelected) {
                let filterSelectedVal = item.filterValue || true;
                if (filter.filterName) {
                    this.filters[filter.filterName].push(filterSelectedVal);
                } else {
                    this.filters[item.filterName] = filterSelectedVal;
                }
            }
        })
    }

    _mapSelectDateRangeFilter(items) {
        angular.forEach(items, (item) => {
            if (item.isSelected) {
                if (item.filterStart) {
                    this.filters[item.filterStart.filterName] = item.filterStart.filterValue;
                }
                if (item.filterEnd) {
                    this.filters[item.filterEnd.filterName] = item.filterEnd.filterValue;
                }
            }
        })
    }

    _mapSelectInputRangeFilter(items) {
        angular.forEach(items, (item) => {
            if (item.isSelected) {
                if (item.filterStart) {
                    this.filters[item.filterStart.filterName] = item.filterStart.filterValue;
                }
                this.filters[item.filterEnd.filterName] = item.filterEnd.filterValue;
            }
        })
    }

    _mapAutocompleteChipsFilter(filter, key) {
        if (filter.filterValue.length) {
            this.filters[filter.filterName] = [];

            angular.forEach(filter.filterValue, (item) => {
                let propName = filter.filterPropName || 'Id';
                this.filters[filter.filterName].push(item[propName]);
            });

            if ( key === 'InvoiceHoldReasonFilters') {
                if (filter.additionalField && filter.additionalField.filterValue.length) {
                    this.filters[filter.additionalField.filterName] = filter.additionalField.filterValue;
                }
            }
        }
    }

    _mapAutocompleteFilter(filter) {
        if (filter.filterValue) {
            this.filters[filter.filterName] = filter.filterValue.Id;
        }
    }

    _mapDateRangeFilter(filter) {
        this.filters[filter.filterStart.filterName] = filter.filterStart.filterValue;
        this.filters[filter.filterEnd.filterName] = filter.filterEnd.filterValue;
    }

    saveFilters(key, filtersObj) {
        this.savedFilters[key] = filtersObj;
    }

    getSavedFilters(key) {
        return this.savedFilters[key];
    }

    resetSavedFilters() {
        this.savedFilters = {};
    }

    deleteFilter(filtersObj, keyName, id) {
        switch (filtersObj[keyName].type) {
            case 'radio-button-filter':
                this._resetRadioBtnFilter(filtersObj[keyName].items);
                break;
            case 'checkbox-filter':
                this._deleteCheckboxFilter(filtersObj[keyName], id);
                break;
            case 'select-date-range-filter':
                this._resetSelectDateRangeFilter(filtersObj[keyName].items);
                break;
            case 'select-input-range-filter':
                this._resetSelectInputRangeFilter(filtersObj[keyName].items);
                break;
            case 'autocomplete-chips-filter':
                this._deleteAutocompleteChipsFilter(filtersObj[keyName], id);
                break;
            case 'autocomplete-filter':
                this._resetAutocompleteFilter(filtersObj[keyName], id);
                break;
            case 'date-range-filter':
                this._resetDateRangeFilter(filtersObj[keyName]);
                break;
        }
        return filtersObj;
    }

    resetFilters(filtersObj) {
        for (let key in filtersObj) {
            switch (filtersObj[key].type) {
                case 'radio-button-filter':
                    this._resetRadioBtnFilter(filtersObj[key].items);
                    break;
                case 'checkbox-filter':
                    this._resetCheckboxFilter(filtersObj[key].items);
                    break;
                case 'select-date-range-filter':
                    this._resetSelectDateRangeFilter(filtersObj[key].items);
                    break;
                case 'select-input-range-filter':
                    this._resetSelectInputRangeFilter(filtersObj[key].items);
                    break;
                case 'autocomplete-chips-filter':
                    this._resetAutocompleteChipsFilter(filtersObj[key]);
                    break;
                case 'autocomplete-filter':
                    this._resetAutocompleteFilter(filtersObj[key]);
                    break;
                case 'date-range-filter':
                    this._resetDateRangeFilter(filtersObj[key]);
                    break;
            }
        }
        return filtersObj;
    }

    _resetRadioBtnFilter(items) {
        angular.forEach(items, (item) => {
            item.isSelected = item.isDefault || false;
            item.isInProgressRequired = false;
        });
    }

    _resetCheckboxFilter(items) {
        angular.forEach(items, (item, index) => {
            items[index].isSelected = false;
        });
    }

    _resetSelectDateRangeFilter(items) {
        angular.forEach(items, (item) => {
            item.isSelected = false;
            if (item.isCustom) {
                item.filterStart.filterValue = '';
                item.filterEnd.filterValue = '';
            }
        });
    }

    _resetSelectInputRangeFilter(items) {
        angular.forEach(items, (item) => {
            item.isSelected = false;
            if (item.isCustom) {
                item.filterStart.filterValue = '';
                item.filterEnd.filterValue = '';
            }
        });
    }

    _resetAutocompleteChipsFilter(filter) {
        filter.filterValue = [];
        if (filter.additionalField) {
            filter.additionalField.filterValue = '';
        }
    }

    _resetAutocompleteFilter(filter) {
        filter.filterValue = '';
    }

    _resetDateRangeFilter(filter) {
        filter.filterStart.filterValue = '';
        filter.filterEnd.filterValue = '';
    }

    _deleteAutocompleteChipsFilter(filter, id) {
        let indexInArr =  _.findIndex(filter.filterValue, {
            id: id
        });
        if (indexInArr != -1) {
            filter.filterValue.splice(indexInArr, 1);
        } else if (filter.additionalField && filter.additionalField.id == id) {
            filter.additionalField.filterValue = '';
        }
    }

    _deleteCheckboxFilter(filter, id) {
        if (filter.filterName) {
            let indexInArr =  _.findIndex(filter.filterName, { id: id });
            if (indexInArr != -1) {
                filter.filterName.splice(indexInArr, 1);
            }
        }

        angular.forEach(filter.items, (item, index) => {
            if (item.id === id) {
                filter.items[index].isSelected = false;
            }
        });
    }

    getSelectedFilters(filtersObj) {
        let selectedFilters = [];
        for (let key in filtersObj) {
            let filterType = filtersObj[key].type;
            if (filterType === 'radio-button-filter') {
                let filterItem = this._getSelectedRadioBtnFilter(filtersObj[key].items, filtersObj[key].label);

                if (filterItem && filterItem.filterName) {
                    selectedFilters.push({
                        filterName: filterItem.chipsName || filterItem.displayName,
                        id: filterItem.id,
                        isInProgressRequired: filterItem.isInProgressRequired,
                        key
                    })
                }
            }
            if (filterType === 'checkbox-filter') {
                let filterItems = this._getSelectedCheckboxFilters(filtersObj[key].items);

                if (filterItems) {
                    angular.forEach(filterItems, (item) => {
                        selectedFilters.push({
                            filterName: item.displayName,
                            id: item.id,
                            key
                        })
                    });
                }
            }
            if (filterType === 'select-date-range-filter') {
                let filterItem = this._getSelectedSelectDateRangeFilter(filtersObj[key].items, filtersObj[key].label);

                if (filterItem) {
                    selectedFilters.push({
                        filterName: filterItem.displayName,
                        id: filterItem.id,
                        key
                    })
                }
            }
            if (filterType === 'select-input-range-filter') {
                let filterItem = this._getSelectedSelectInputRangeFilter(filtersObj[key].items, filtersObj[key].label);

                if (filterItem) {
                    selectedFilters.push({
                        filterName: filterItem.displayName,
                        id: filterItem.id,
                        key
                    })
                }
            }
            if (filterType === 'autocomplete-chips-filter') {
                let chipsLabel = filtersObj[key].chipsLabel || filtersObj[key].label;
                let filterItems = this._getSelectedAutocompleteChipsFilters(filtersObj[key], chipsLabel);

                if (filterItems) {
                    angular.forEach(filterItems, (item) => {
                        selectedFilters.push({
                            filterName: item.displayName,
                            id: item.id,
                            key
                        })
                    });
                }
            }
            if (filterType === 'autocomplete-filter') {
                let filterItem = this._getSelectedAutocompleteFilter(filtersObj[key], filtersObj[key].label);

                if (filterItem) {
                    selectedFilters.push({
                        filterName: filterItem.displayName,
                        id: filterItem.id,
                        key
                    })
                }
            }
            if (filterType === 'date-range-filter') {
                let filterItem = this._getSelectedDateRangeFilter(filtersObj[key], filtersObj[key].label);

                if (filterItem) {
                    selectedFilters.push({
                        filterName: filterItem.displayName,
                        id: filterItem.id,
                        key
                    })
                }
            }
        }

        return selectedFilters;
    }

    _getSelectedRadioBtnFilter(items, label) {
        let selectedFilter = _.find(items, item => item.isSelected);

        if (selectedFilter && selectedFilter.filterName) {
            selectedFilter.chipsName = label
                ? `${label}: ${selectedFilter.displayName}`
                : selectedFilter.displayName;
            return selectedFilter;
        }
    }

    _getSelectedCheckboxFilters(items) {
        let filterValuesArr = [];

        angular.forEach(items, (item) => {
            if (item.isSelected) {
                filterValuesArr.push({
                    displayName: item.displayName,
                    id: item.id
                })
            }
        });

        return filterValuesArr;
    }

    _getSelectedSelectDateRangeFilter(items, label) {
        let selectedItem = _.find(items, item => item.isSelected);
        if (selectedItem && selectedItem.isCustom) {
            let name,
                start = selectedItem.filterStart.filterValue,
                end = selectedItem.filterEnd.filterValue;

            if (start.length) {
                name = `${label}: From ${moment.utc(start).format('MM/DD/YYYY')}`;
            }
            if (end.length) {
                name = name + ` - To ${moment.utc(end).format('MM/DD/YYYY')}`;
            }
            return {
                displayName: name,
                id: selectedItem.id
            };

        } else if (selectedItem) {
            return {
                displayName: `${label}: ${selectedItem.displayName}`,
                id: selectedItem.id
            }
        }
    }

    _getSelectedSelectInputRangeFilter(items, label) {
        let selectedItem = _.find(items, item => item.isSelected);

        if (selectedItem && selectedItem.isCustom) {
            let name,
                start = selectedItem.filterStart.filterValue,
                end = selectedItem.filterEnd.filterValue;

            if (start) {
                name = `${label}: From ${start}`;
            }
            if (end) {
                name = name + ` - To ${end}`;
            }
            return {
                displayName: `${name} days`,
                id: selectedItem.id
            };

        } else if (selectedItem) {
            return {
                displayName: `${label}: ${selectedItem.displayName} days`,
                id: selectedItem.id
            }
        }
    }

    _getSelectedAutocompleteChipsFilters(filter, label) {
        let filterValuesArr = [];

        if (filter.filterValue.length) {
            angular.forEach(filter.filterValue, (item) => {
                item.displayName = label
                    ? `${label}: ${item[filter.dictionaryKeyName]}`
                    : item[filter.dictionaryKeyName];
                item.id = item.id || item.Id;
                filterValuesArr.push(item);
            });
        }

        if (filter.additionalField && filter.additionalField.filterValue.length) {
            let item = {
                    id: filter.additionalField.id,
                    displayName: filter.additionalField.filterValue,
                };
            filterValuesArr.push(item);
        }

        if (filterValuesArr.length) {return filterValuesArr}
    }

    _getSelectedAutocompleteFilter(filter, label) {
        if (filter.filterValue) {
           return {
               displayName: `${label}: ${filter.filterValue[filter.dictionaryKeyName]}`,
               id: filter.filterValue.Id
           }
        }
    }

    _getSelectedDateRangeFilter(filter, label) {
        let name,
            start = filter.filterStart.filterValue,
            end = filter.filterEnd.filterValue;

        if (start.length) {
            name = `${label}: From ${moment.utc(start).format('MM/DD/YYYY')}`;
        }
        if (end.length) {
            name = name + ` - To ${moment.utc(end).format('MM/DD/YYYY')}`;
        }

        if (name) {
            return {
                displayName: name,
                id: filter.id
            };
        }
    }


}
