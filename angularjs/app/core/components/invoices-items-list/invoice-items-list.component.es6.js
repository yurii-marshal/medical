import template from './invoice-items-list.html';

class invoiceItemsList {
    constructor() {}
}

export default {
    bindings: {
        invoices: '='
    },
    template,
    controller: invoiceItemsList
};
