import template from './reportAddFilter.html';

class reportAddFilterCtrl {
    constructor() {
        'ngInject';
    }

}

const reportAddFilter = {
    bindings: {
        filters: '=',
        selectedFilter: '=?',
        addFilter: '='
    },
    template,
    controller: reportAddFilterCtrl
};

export default reportAddFilter;
