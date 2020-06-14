import template from './drowz-tabs.html';

class drowzTabsCtrl {
    constructor($scope, $state) {
        'ngInject';

        // if we need complicated active nested state - do it in main controller
        if (!this.isActive) {
            this.isActive = (view) => {
                return $state.current.name.indexOf(view) !== -1;
            };
        }

        $scope.$watch(() => this.items, (newVal) => {
            this.isLongTabs = newVal&& newVal.length && newVal.length > 7;
        });
    }
}

const drowzTabs = {
    bindings: {
        items: '=',
        isActive: '=?'
    },
    template,
    controller: drowzTabsCtrl
};

export default drowzTabs;
