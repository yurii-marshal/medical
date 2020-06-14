import template from './select-input-range-filter.html';

class selectInputRangeFilterCtrl {
    constructor($scope) {
        'ngInject';

        this.selectedFilter = _.find(this.options.items, item => item.isSelected);

        $scope.$watch(_ => this.options, (newVal, oldVal) =>  {
            this.selectedFilter = _.find(this.options.items, item => item.isSelected);
        }, true);
    }

    setSelection() {
        if (this.selectInputRangeFilterForm.$invalid) {
            touchedErrorFields(this.selectInputRangeFilterForm);
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

const selectInputRangeFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: selectInputRangeFilterCtrl
};

export default selectInputRangeFilter;
