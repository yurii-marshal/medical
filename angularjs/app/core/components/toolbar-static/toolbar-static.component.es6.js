import template from './toolbar-static.html';

class toolbarStaticCtrl {
    constructor() {
        'ngInject';
    }
}

const toolbarStatic = {
    bindings: {
        items: '='
    },
    template,
    controller: toolbarStaticCtrl
};

export default toolbarStatic;