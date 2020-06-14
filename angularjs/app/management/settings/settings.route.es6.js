export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.management.settings', {
            url: '/settings',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.settings')) {
                        $state.go('root.management.settings.orders');
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            }
        })
        .state('root.management.settings.orders', {
            url: '/orders',
            templateUrl: 'management/settings/components/settings-order/settings-order.html',
            controller: 'settingsOrderController as order',
            params: {
                topMenu: 'Management',
                pageTitle: 'Orders'
            }
        })
        .state('root.management.settings.statements', {
            url: '/statements',
            templateUrl: 'management/settings/components/settings-statement/settings-statement.html',
            controller: 'settingsStatementController as statement',
            params: {
                topMenu: 'Management',
                pageTitle: 'Statements'
            }
        });
}
