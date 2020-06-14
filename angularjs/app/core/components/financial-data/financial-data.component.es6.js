import template from './financial-data.html';

class financialData {
    constructor() {
        'ngInject';
    }
}

export default {
    bindings: {
        amounts: '<'
    },
    template,
    controller: financialData
};
