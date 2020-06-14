import template from './price-option.html';

class PriceOptionCtrl {
    constructor() {
        'ngInject';


    }

}

const priceOption = {
    bindings: {
        item: '<'
    },
    template,
    controller: PriceOptionCtrl
};

export default priceOption;
