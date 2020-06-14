import template from './toolbar.html';

class ToolbarCtrl {
    constructor() {
        'ngInject';

        this.isOpenToolbar = false;
    }
}

const toolbar = {
    bindings: {
        items: '='
    },
    template,
    controller: ToolbarCtrl
};

export default toolbar;

