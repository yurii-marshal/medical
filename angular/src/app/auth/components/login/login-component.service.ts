import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { ProfileService } from '@shared/services/profile.service';
import { Router } from '@angular/router';
import { UserPermissionsService } from '@shared/services/user-permissions.service';
import { CrossTabNotifierService } from '@shared/services/crosstab-notifier.service';
import { Login } from '../../shared/interfaces/login.interface';

@Injectable()
export class LoginComponentService {

    constructor(
        private localStorageService: LocalStorageService,
        private profileService: ProfileService,
        private router: Router,
        private userPermissionsService: UserPermissionsService,
        private tabNotifier: CrossTabNotifierService,
    ) {}

    public loginSuccess(options: Login): void {

        // Clear filters on Calendar
        if (this.localStorageService.get('filter')) {
            this.localStorageService.remove('filter');
        }

        if (options.isRemember) {
            this.localStorageService.set('rememberLogin', options.username);
        } else {
            this.localStorageService.remove('rememberLogin');
        }

        this.profileService.getProfile()
            .subscribe((response) => {

                if (response.NeedChangePassword) {
                    this.router.navigate(['/changepass', {email: response.Email}] );

                    return;
                } else {

                    this.userPermissionsService.clearPermissions();

                    this.userPermissionsService.initPermissions()
                        .then(() => {
                            this.tabNotifier.setTabLoggedIn();
                            this.redirectToPageAfterGetPermissions();
                        });
                }
            });
    }

    private redirectToPageAfterGetPermissions() {
        const prevUrl = localStorage.getItem('url_before_login');
        if (prevUrl && prevUrl.match(/\#(\S+)/)) {
            const url = prevUrl.match(/\#(\S+)/)[1];

            this.router.navigateByUrl(url);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}
