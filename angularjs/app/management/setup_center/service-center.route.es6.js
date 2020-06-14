export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.management.setup_center', {
            url: '/setup_center/{setupCenterId}?view&date&filter',
            templateUrl: 'management/setup_center/views/setup_center.html',
            controller: 'setupCenterViewController as setup_center',
            params: {
                topMenu: 'Management',
                pageTitle: 'Service Center Schedule'
            }
        })
        .state('root.management.service_centers', {
            url: '/service_centers/',
            templateUrl: 'management/setup_center/views/service_centers.html',
            controller: 'serviceCentersController as serviceCenters',
            params: {
                topMenu: 'Management',
                pageTitle: 'Service Centers'
            }
        });
}


