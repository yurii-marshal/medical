import template from './select-date-range-filter.html';

class selectDateRangeFilterCtrl {
    constructor($scope) {
        'ngInject';

        this.selectedFilter = _.find(this.options.items, item => item.isSelected);

        //to reset this.selectedFilter
        $scope.$watch(_ => this.options, (newVal, oldVal) =>  {
            if (this.options.subfilter && this.options.isDisabled) {
                angular.forEach(this.options.items, item => {
                    item.isSelected = false;
                    if (item.isCustom) {
                        item.filterStart.filterValue = '';
                        item.filterEnd.filterValue = '';
                    }
                });
            }
            this.selectedFilter = _.find(this.options.items, item => item.isSelected);
        }, true);
    }

    setSelection() {
        if (this.selectDateRangeFilterForm.$invalid) {
            touchedErrorFields(this.selectDateRangeFilterForm);
        }

        angular.forEach(this.options.items, item => {
            item.isSelected = this.selectedFilter ? (item.id === this.selectedFilter.id) : null;
        });

        if (this.selectedFilter && !this.selectedFilter.isCustom) {
            let customFilter = _.find(this.options.items, item => item.isCustom);
            customFilter.filterStart.filterValue = '';
            customFilter.filterEnd.filterValue = '';
        }
    }

}

const selectDateRangeFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: selectDateRangeFilterCtrl
};

export default selectDateRangeFilter;
