export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.no_access', {
            url: '/no-access',
            templateUrl: 'utility-pages/no-access/no-access.html',
            controller: 'noAccessController',
            controllerAs: 'noAccessController'
        })
        .state('root.empty-iframe', {
            url: '/empty-iframe',
            templateUrl: 'utility-pages/empty-iframe/empty-iframe.html',
            controller: 'emptyIframeController',
            controllerAs: 'emptyIframeController'
        });
}

