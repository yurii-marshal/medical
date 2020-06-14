export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.reports-v2.container', {
            url: '/:reportsType',
            templateUrl: 'reports/reports-container/reports-container.html',
            controller: 'reportsContainerController as reportsContainer'
        })
        .state('root.reports-v2.container.report', {
            url: '/:sourceId',
            templateUrl: 'reports/components/reports-table/reports-table.html',
            controller: 'reportsTableController as reports',
            params: {
                topMenu: 'Reports'
            }
        });
}
