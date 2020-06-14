import {
    permissionsCategoriesConstants,
    managementPermissionsConstants,
    inventoryPermissionsConstants,
    billingPermissionsConstants
} from '../../constants/permissions.constants.es6';

class MainMenuCtrl {
    constructor(
        $scope,
        $rootScope,
        $timeout,
        $state,
        authService,
        currentUser,
        userPermissions,
        CURRENT_DOMAIN
    ) {
        'ngInject';

        this.$scope = $scope;
        this.$state = $state;
        this.authService = authService;
        this.currentUser = currentUser;
        this.CURRENT_DOMAIN = CURRENT_DOMAIN;
        this.userPermissions = userPermissions;

        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.managementPermissionsConstants = managementPermissionsConstants;
        this.billingPermissionsConstants = billingPermissionsConstants;

        this.firstInit = true;
        this.userAvatarPlaceholder = 'assets/images/avatar.jpg';

        $rootScope.$on('$stateChangeSuccess', () => {
            // for prevent conflicts with other code execution
            $timeout(() => {

                if (!this.authService.getAccessToken()) {
                    this.firstInit = true;
                    this.items = [];
                } else {
                    this.updateMenu();
                }

                angular.forEach(this.items, (item) => {
                    if ($state.params && $state.params.topMenu) {
                        item.active = item.name === $state.params.topMenu;
                    } else {
                        item.active = false;
                    }
                });
            }, 0);
        });
    }

    $onInit() {
        this.updateMenu();
    }

    updateMenu() {

        if (!this.firstInit) {
            return ;
        }

        if (this.authService.getAccessToken()) {
            this.firstInit = false;
            this.initTabs();
        }
    }

    initTabs() {

        this.items = [
            {
                name: 'Calendar',
                state: 'root.calendar',
                imageUrl: 'assets/images/main-menu/calendar.svg',
                active: false,
                isHide: false
            },
            {
                name: 'Patients',
                state: 'root.patients.list',
                imageUrl: 'assets/images/main-menu/patients.svg',
                active: false,
                isHide: false
            },
            {
                name: 'Orders',
                state: 'root.orders.list',
                imageUrl: 'assets/images/main-menu/orders.svg',
                active: false,
                isHide: false
            },
            {
                name: 'Reports',
                state: 'root.reports-dashboard',
                imageUrl: 'assets/images/main-menu/reports.svg',
                active: false,
                isHide: false
            },
            {
                name: 'Management',
                state: 'root.management',
                imageUrl: 'assets/images/main-menu/management.svg',
                active: false,
                isHide: !this.userPermissions.isAllow(this.permissionsCategoriesConstants.MANAGEMENT, this.managementPermissionsConstants.VIEW)
            },
            {
                name: 'Billing',
                state: 'root.billing.invoices',
                imageUrl: 'assets/images/main-menu/billing.svg',
                active: false,
                isHide: !this.userPermissions.isAllow(this.permissionsCategoriesConstants.BILLING, this.billingPermissionsConstants.VIEW)
            },
            {
                name: 'Inventory',
                state: 'root.inventory.list',
                imageUrl: 'assets/images/main-menu/inventory.svg',
                active: false,
                isHide: !this.userPermissions.isAllow(this.permissionsCategoriesConstants.INVENTORY, inventoryPermissionsConstants.VIEW)
            },
            {
                name: 'Inbox',
                state: 'root.inbox.list',
                imageUrl: 'assets/images/main-menu/inbox.svg',
                active: false,
                isHide: false
            }
        ];
    }

    goToEditProfileV2() {
        window.location.href = `${ this.CURRENT_DOMAIN }/v2#/edit-profile`;
    }

    logout() {
        // this.userPermissions.clearPermissions();
        // this.authService.logout();
        // localStorage.removeItem('url_before_login');
    }
}

const mainMenu = {
    templateUrl: 'core/components/main-menu/main-menu.html',
    controller: MainMenuCtrl
};

export default mainMenu;
