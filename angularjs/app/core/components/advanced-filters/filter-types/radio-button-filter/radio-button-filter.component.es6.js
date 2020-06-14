import template from './radio-button-filter.html';

class radioBtnFilterCtrl {
    constructor($scope) {
        'ngInject';

        this.selectedFilter = _.find(this.options.items, item => item.isSelected);

        $scope.$watch(_ => this.options, (newVal, oldVal) =>  {
            if (this.options.subfilter && this.options.isDisabled) {
                angular.forEach(this.options.items, item => {
                    item.isSelected = !!item.isDefault;
                });
                this.selectedFilter = _.find(this.options.items, item => item.isDefault);
            } else {
                this.selectedFilter = _.find(this.options.items, item => item.isSelected);
            }
        }, true);
    }

    setSelection() {
        angular.forEach(this.options.items, item => {
            item.isSelected = (item.id === this.selectedFilter.id);
        });
    }
}

const radioBtnFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: radioBtnFilterCtrl
};

export default radioBtnFilter;
