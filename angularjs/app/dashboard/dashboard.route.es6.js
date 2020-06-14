export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.dashboard', {
            url: '/dashboard',
            templateUrl: 'dashboard/views/dashboard.html',
            controller: 'dashboardController as dash',
            params: {
                pageTitle: 'Dashboard'
            }
        })
        .state('root.dashboard.index', {
            url: '/',
            sticky: true,
            dsr: true,
            params: {
                pageTitle: 'Dashboard'
            }
        });
}

