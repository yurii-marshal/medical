export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.reports', {
            url: '/reports?reportSourceId&filters',
            templateUrl: 'reports/views/dashboard.html',
            controller: 'reportManagementController',
            controllerAs: 'vm',
            params: {
                pageTitle: 'Reports'
            }
        })
        .state('root.reports-v2', {
            url: '/reports-v2',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.reports-v2')) {
                        $state.go('root.reports-dashboard');
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            },

            controllerAs: 'vm',
            params: {
                pageTitle: 'Reports'
            }
        })
        .state('root.reports-dashboard', {
            url: '/reports-dashboard',
            templateUrl: 'reports/components/reports-dashboard/reports-dashboard.html',
            controller: 'reportsDashboardCtrl',
            controllerAs: 'dashboard',
            params: {
                topMenu: 'Reports',
                pageTitle: 'Reports Dashboard'
            }
        })
        .state('root.reports.index', {
            url: '/',
            sticky: true,
            dsr: true,
            views: {
                'leftMenu': {
                    templateUrl: 'reports/views/reportsLeftMenu.html'
                },
                'overlay': {
                    templateUrl: 'reports/views/reportsSave.index.html'
                },
                'mainContent': {
                    templateUrl: 'reports/views/mainContent.html'
                }
            },
            params: {
                topMenu: 'Reports',
                pageTitle: 'Reports'
            }
        })
        .state('root.reports.index.detail', {
            url: ':reportId',
            sticky: true,
            dsr: true,
            pageTitle: 'Report Details'
        });
}

