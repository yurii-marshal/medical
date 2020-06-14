import template from './save-filter-as.html';

class saveFilterAsCtrl {
    constructor() {
        'ngInject';
    }
}

const saveFilterAs = {
    bindings: {
        options: '=',
        needToSave: '=',
        newFilterName: '='
    },
    template,
    controller: saveFilterAsCtrl
};

export default saveFilterAs;
