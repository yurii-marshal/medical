import {
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

import {
    AppNavigationItem,
    getNavigationItemsConfig,
} from './navigation.config';

import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { Profile, ProfileMock } from '@shared/interfaces/models/profile.model';
import { Subscription } from 'rxjs';
import { ProfileService } from '@shared/services/profile.service';
import { UserPermissionsService } from '@shared/services/user-permissions.service';
import {
    BillingPermissions,
    InventoryPermission,
    ManagementPermissions,
    PermissionsCategories,
} from '@shared/interfaces/permissions.enum';
import { NavigationData } from '@app/shared/services/navigation-data.service';
import { AuthService } from '@app/auth/shared/services/auth.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})

export class NavigationComponent implements OnInit, OnDestroy {

    items: AppNavigationItem[] = getNavigationItemsConfig();

    profileSubscription: Subscription;

    profileInfo: Profile;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private router: Router,
        private authService: AuthService,
        private profileService: ProfileService,
        private routerNavigatorService: RouterNavigatorService,
        private userPermissions: UserPermissionsService,
        private activatedRoute: ActivatedRoute,
        private navigationData: NavigationData,
    ) {

        /**
         * @description - registration icons url for using in html attr
         */
        this.registerIcon('main-logo', 'assets/images/logo-nh.svg');
        this.registerIcon('logout', 'assets/images/main-menu/logout.svg');

        this.items.forEach((item) => {
            if (item.name === 'Inventory') {
                item.isHide = !this.userPermissions.isAllow(PermissionsCategories.Inventory, InventoryPermission.View);
            }

            if (item.name === 'Management') {
                item.isHide = !this.userPermissions.isAllow(PermissionsCategories.Management, ManagementPermissions.View);
            }

            if (item.name === 'Billing') {
                item.isHide = !this.userPermissions.isAllow(PermissionsCategories.Billing, BillingPermissions.View);
            }

            this.registerIcon(item.name, item.imageUrl);
        });

        /** Get actual route data and set 'active' for navigation */
        this.navigationData.actualRouteData$
            .subscribe((data) => {
                if (data && !data.silent) {
                    this.items.forEach((item) => {
                        item.active = item.topMenu === data.topMenu;
                    });
                }
            });
    }

    /**
     * @method for registration multiple icons
     * @param {string} name
     * @param {string} url
     * @private
     */
    private registerIcon(name: string, url: string): void {
        this.iconRegistry.addSvgIcon(
            name,
            this.sanitizer.bypassSecurityTrustResourceUrl(url));
    }

    ngOnInit() {

        /**
         * @description subscription on profile$ BehaviorSubject to watch User Info
         * @type {Subscription}
         */
        this.profileSubscription = this.profileService.profile$
            .subscribe({
                next: (profile: Profile) => {
                    if (profile instanceof ProfileMock) {
                        this.profileService.getProfile()
                            .subscribe((profileData: Profile) => {
                                if (profileData.NeedChangePassword) {
                                    this.authService.logout();
                                }
                            });
                    } else {
                        this.profileInfo = profile;
                    }
                },
            });
    }

    ngOnDestroy() {
        this.profileSubscription.unsubscribe();
    }

    public goToMainPage(): void {
        this.routerNavigatorService.navigate(['/dashboard']);
    }

    public logout(): void {
        this.authService.logout();
        localStorage.removeItem('url_before_login');
    }
}
