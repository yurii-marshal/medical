import {
    permissionsCategoriesConstants,
    managementPermissionsConstants
} from '../core/constants/permissions.constants.es6';

export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.management', {
            url: '/management',
            templateUrl: 'management/management.view.html',
            controller: 'managementController as management',
            params: {
                topMenu: 'Management',
                pageTitle: 'Management'
            },
            resolve: {
                resolveUserPermissions: [
                    'userPermissions',
                    '$state',
                    function(userPermissions, $state) {
                        if (!userPermissions.isAllow(permissionsCategoriesConstants.MANAGEMENT, managementPermissionsConstants.VIEW)) {
                            setTimeout(() => $state.go('root.no_access'));
                        }

                        return true;
                    }
                ]
            }
        });
}
