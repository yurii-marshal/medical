import template from './autocomplete-chips-filter.html';

class autocompleteChipsFilterCtrl {
    constructor($timeout, advancedFiltersService) {
        'ngInject';

        this.$timeout = $timeout;
        this.advancedFiltersService = advancedFiltersService;

        if (this.options.isStaticDictionary) {
            this.options.getDictionary().then((response) => {
                this.dictionary = _.sortBy( response, this.options.dictionaryKeyName );
            });
        } else {
            this.getDictionary = (query) => {
                let params = this._getDictionarySearchParams(query);

                return this.options.getDictionary(params).then((response) => {
                    if (response) {
                        let res = response.Items || response;

                        this.dictionary = this._filterResults(res);
                        return this.dictionary;
                    }
                });
            };
        }

        this.autocompleteId = guid(true);
    }

    autocompleteQuerySearch(query) {
        let results = query ? this.dictionary.filter(this.filterSearchQuery(query)) : this.dictionary;

        if (results.length) {
            results = this._filterResults(results);
        }
        return results;
    }

    filterSearchQuery(query) {
        let lowercaseQuery = query.toLowerCase();

        let keyName = this.options.dictionarySearchParams
            ? this.options.dictionarySearchParams.defaultParam
            : this.options.dictionaryKeyName;

        return function filterFn(item) {
            return item[keyName].toLowerCase().indexOf(lowercaseQuery) !== -1;
        };
    }

    _filterResults(results) {
        let filteredArr = [];

        angular.forEach(results, (item) => {
            let itemIndex = _.findIndex(this.options.filterValue, { Id: item.Id });

            if (itemIndex === -1) {
                filteredArr.push(item);
            }
        });
        return filteredArr;
    }

    _getDictionarySearchParams(query) {
        let params = {};

        if (this.options.dictionarySearchParams) {
            params[`${this.options.dictionarySearchParams.searchQueryKey}`] = query;
            let defaultParams = this.options.dictionarySearchParams.defaultParams;

            for (let key in defaultParams) {
                params[`${key}`] = defaultParams[key];
            }

            if (this.options.dictionarySearchParams.additionalParams) {
                params = angular.merge({}, params, this.options.dictionarySearchParams.additionalParams);
            }
        }

        return params;
    }

    toShowOtherText() {
        if (this.options.additionalField) {
            let isOtherReason = _.find(this.options.filterValue, (item) => item.Name === 'Other');

            return isOtherReason;
        }
    }

    closeAutocompleteOnDelete() {
        $('.md-autocomplete-suggestions-container').css('opacity', '0');
        $(`.advanced-filters-modal #${this.autocompleteId} md-autocomplete-wrap`).css('opacity', '0');

        this.$timeout(() => {
            $('.advanced-filters-modal md-autocomplete input').blur();

            $('.md-autocomplete-suggestions-container').css('opacity', '1');
            $(`.advanced-filters-modal #${this.autocompleteId} md-autocomplete-wrap`).css('opacity', '1');
        }, 500);
    }

}

const autocompleteChipsFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: autocompleteChipsFilterCtrl
};

export default autocompleteChipsFilter;
