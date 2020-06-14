import template from './select-invoice-item.html';

class SelectInvoiceItemCtrl {
    constructor() {
        'ngInject';
    }
}

export default {
    bindings: {
        invoice: '<'
    },
    template,
    controller: SelectInvoiceItemCtrl
};
