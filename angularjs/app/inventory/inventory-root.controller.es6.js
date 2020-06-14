export default class InventoryRootCtrl {
    constructor($scope,
                $rootScope,
                $state
               ) {
        'ngInject';

        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.activeTabName = 'List';

        this.tabs = [
            {
                title: 'Items',
                view: 'root.inventory.list',
                icon: {
                    url: 'assets/images/default/user-circle.svg',
                    w: 18,
                    h: 18
                }
            },
            {
                title: 'Purchase orders',
                view: 'root.inventory.purchase-orders',
                icon: {
                    url: 'assets/images/default/tasks.svg',
                    w: 16,
                    h: 18
                }
            }
        ];

        $scope.$on('$stateChangeSuccess', () => {
            this.checkState();
        });

        this.activate();
    }

    activate() {
        this.checkState();
    }

    checkState() {
        if (this.$state.is('root.inventory')) {
            this.$state.go('root.inventory.list');
        }
        switch (this.$state.current.name) {
            case 'root.inventory.purchase-orders':
                this.activeTabName = 'Purchase Orders';
                break;

            default:
                this.activeTabName = 'List';
                break;
        }
    }

}
