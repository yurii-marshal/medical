import template from './current-item.html';
import { lookupProperties } from '../../../../quick-ship.config.es6';

class currentItemCtrl {
    constructor() {
        'ngInject';

        this.lookupProperties = lookupProperties;
    }
}

const currentItem = {
    bindings: {
        item: '<',
        components: '<',
        lookupProperty: '<',
        pickedItems: '<'
    },
    template,
    controller: currentItemCtrl
};

export default currentItem;
