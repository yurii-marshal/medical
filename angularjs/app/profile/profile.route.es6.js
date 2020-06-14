export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.profile', {
            url: '/profile',
            abstract: true,
            template: '<ui-view/>',
            params: {
                pageTitle: 'Profile'
            }
        })
        .state('root.profile.index', {
            url: '/?view&date&filter',
            templateUrl: 'profile/views/profile.html',
            controller: 'profileViewController as profileCtrl',
            resolve: {
                profile: function ($state, profileService) {
                    return profileService.getProfilePromise()
                        .then((response) => {
                            let profile = response.data;
                            // TODO uncomment after DEMO
                            //if (profile.UserType.Id === 1) {
                            $state.go('root.profile.edit');
                            //}
                            return profile;
                        });
                }
            },
            params: {
                pageTitle: 'Profile'
            }
        })
        .state('root.profile.edit', {
            url: '/edit',
            templateUrl: 'profile/views/profile.edit.html',
            controller: 'profileEditController as edit_profile',
            params: {
                pageTitle: 'Edit Profile'
            }
        });
}

