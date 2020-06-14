import template from './checkbox-filter.html';

class checkboxFilterCtrl {
    constructor() {
        'ngInject';
    }
}

const checkboxFilter = {
    bindings: {
        options: '='
    },
    template,
    controller: checkboxFilterCtrl
};

export default checkboxFilter;
