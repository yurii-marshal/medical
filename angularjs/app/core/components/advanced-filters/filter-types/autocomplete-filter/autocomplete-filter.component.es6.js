import template from './autocomplete-filter.html';

class autocompleteFilterCtrl {
    constructor($scope, $timeout, advancedFiltersService) {
        'ngInject';

        this.$timeout = $timeout;
        this.advancedFiltersService = advancedFiltersService;

        if (this.options.isStaticDictionary) {
            this.options.getDictionary().then(response => {
                this.dictionary = response.Items || response;
            });
        } else {
            this.getDictionary = (query) => {
                let params = this._getDictionarySearchParams(query);
                return this.options.getDictionary(params).then(response => {
                    if (response) {
                        let res = response.Items || response;
                        this.dictionary = this._filterResults(res);
                        return this.dictionary;
                    }
                })
            }
        }

        $scope.$watch(_ => this.options, (newVal) =>  {
            if (this.options.subfilter && this.options.isDisabled) {
                this.options.filterValue = '';
            }
        }, true);

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
            return item[keyName].toLowerCase().indexOf(lowercaseQuery) != -1;
        };
    }

    _filterResults(results) {
        let filteredArr = [];
        angular.forEach(results, item => {
            let itemIndex = _.findIndex(this.options.filterValue, {Id: item.Id});

            if (itemIndex == -1) {
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
        }
        if (this.options.dictionarySearchParams.additionalParams) {
            params = angular.merge({}, params, this.options.dictionarySearchParams.additionalParams);
        }
        return params;
    }
}

const autocompleteFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: autocompleteFilterCtrl
};

export default autocompleteFilter;

