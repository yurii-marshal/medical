import template from './service-line-item.component.html';

class SelectServiceLineItemCtrl {
    constructor() {
        'ngInject';
    }
}

export default {
    bindings: {
        serviceLine: '<'
    },
    template,
    controller: SelectServiceLineItemCtrl
};
