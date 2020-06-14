export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.management.organization', {
            url: '/organization',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.organization')) {
                        $state.go('root.management.organization.setup');
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            }
        })
        .state('root.management.organization.setup', {
            url: '/setup',
            templateUrl: 'management/organization/components/organization-setup/organization-setup.html',
            controller: 'organizationSetupController as orgSetup',
            params: {
                topMenu: 'Management',
                pageTitle: 'Organization Setup'
            }
        })
        // LOCATIONS
        .state('root.management.organization.locations', {
            url: '/locations',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.organization.locations')) {
                        $state.go('root.management.organization.locations.list');
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            }
        })
        .state('root.management.organization.locations.list', {
            templateUrl: 'management/organization/views/locations.html',
            controller: 'organizationLocationsController as orgLoc',
            params: {
                topMenu: 'Management',
                leftMenu: 'Locations',
                pageTitle: 'Locations'
            }
        })
        .state('root.management.organization.locations.add', {
            url: '/new-location',
            templateUrl: 'management/organization/components/organization-location/organization-location.html',
            controller: 'organizationLocationViewController as locationView',
            params: {
                topMenu: 'Management',
                leftMenu: 'Locations',
                pageTitle: 'Add Location'
            }
        })
        .state('root.management.organization.locations.view', {
            url: '/:locationId',
            templateUrl: 'management/organization/components/organization-location/organization-location.html',
            controller: 'organizationLocationViewController as locationView',
            params: {
                locationId: undefined,
                topMenu: 'Management',
                leftMenu: 'Locations',
                pageTitle: 'Edit Location'
            }
        })
        // FACILITIES
        .state('root.management.organization.facilities', {
            url: '/facilities',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.organization.facilities')) {
                        $state.go('root.management.organization.facilities.list');
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            }
        })
        .state('root.management.organization.facilities.list', {
            templateUrl: 'management/organization/components/facilities-list/facilities-list.html',
            controller: 'facilitiesListCtrl as facilities',
            params: {
                topMenu: 'Management',
                leftMenu: 'Facilities',
                pageTitle: 'Facilities'
            }
        })
        .state('root.management.organization.facilities.new', {
            url: '/new',
            templateUrl: 'management/organization/components/facility/facility.html',
            controller: 'facilityCtrl as facility',
            params: {
                topMenu: 'Management',
                leftMenu: 'Facilities',
                pageTitle: 'Add new facility'
            }
        })
        .state('root.management.organization.facilities.edit', {
            url: '/:facilityId',
            templateUrl: 'management/organization/components/facility/facility.html',
            controller: 'facilityCtrl as facility',
            params: {
                facilityId: null,
                topMenu: 'Management',
                leftMenu: 'Facilities',
                pageTitle: 'Edit facility'
            }
        })

        // REFFERAL
        .state('root.management.organization.referral', {
            url: '/referrals',
            template: '<div class="has-infinite-table" ui-view></div>',
            controller: function($state, $scope) {
                function checkState() {
                    if ($state.is('root.management.organization.referral')) {
                        $state.go('root.management.organization.referral.list', null, { location: 'replace' });
                    }
                }
                $scope.$on('$stateChangeSuccess', () => checkState());
                checkState();
            }
        })
        .state('root.management.organization.referral.list', {
            url: '/list',
            templateUrl: 'management/organization/views/referrals.html',
            controller: 'referralsController as referrals',
            params: {
                topMenu: 'Management',
                pageTitle: 'Referring Providers',
                leftMenu: 'Referring Providers'
            }
        })
        .state('root.management.organization.referral.add', {
            url: '/add',
            templateUrl: 'management/organization/components/referral/referral.html',
            controller: 'referralController as referral',
            params: {
                topMenu: 'Management',
                pageTitle: 'Add Referring Provider',
                leftMenu: 'Referring Providers'
            }
        })
        .state('root.management.organization.referral.view', {
            url: '/:id',
            templateUrl: 'management/organization/components/referral/referral.html',
            controller: 'referralController as referral',
            params: {
                topMenu: 'Management',
                pageTitle: 'Referring Provider',
                leftMenu: 'Referring Providers'
            }
        });
}
