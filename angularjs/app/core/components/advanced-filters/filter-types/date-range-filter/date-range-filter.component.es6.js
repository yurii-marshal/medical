import template from './date-range-filter.html';

class dateRangeFilterCtrl {
    constructor() {
        'ngInject';

    }

}

const dateRangeFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: dateRangeFilterCtrl
};

export default dateRangeFilter;
