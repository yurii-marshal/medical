import template from './content-tabs.html';

class contentTabs {
    constructor($state) {
        'ngInject';

        this.$state = $state;
    }

    isActive(state) {
        return this.$state.is(state);
    }
}

export default {
    bindings: {
        tabs: '<',
        customMsg: '<?'
    },
    template,
    controller: contentTabs
};
