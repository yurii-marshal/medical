import template from './detailed-written-order.html';

class detailedWrittenOrderCtrl {
    constructor() {}
}

const detailedWrittenOrder = {
    bindings: {
        details: '=',
        disabled: '=?',
        readonly: '=?'
    },
    template,
    controller: detailedWrittenOrderCtrl,
    controllerAs: '$ctrl'
};

export default detailedWrittenOrder;
