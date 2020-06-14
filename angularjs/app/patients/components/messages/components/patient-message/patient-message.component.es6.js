import template from './patient-message.html';

class patientMessageItemCtrl {
    constructor() {
        'ngInject';
    }

    toggleMsg() {
        this.toggleItemFn(this.msg, this.Type);
    }
}

const patientMessageItem = {
    bindings: {
        msg: '=',
        toggleItemFn: '='
    },
    template,
    controller: patientMessageItemCtrl
};

export default patientMessageItem;

