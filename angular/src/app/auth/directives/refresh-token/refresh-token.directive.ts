// @ts-ignore
import {
    Directive,
    NgZone,
    OnDestroy,
} from '@angular/core';
import { LOGIN } from '@app/auth/shared/consts/login.const';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/shared/services/auth.service';

@Directive({
    selector: '[appRefreshToken]',
})
export class RefreshTokenDirective implements OnDestroy {

    private timer: number;

    private apiFails = 0;

    constructor(
        private authService: AuthService,
        private router: Router,
        private zone: NgZone,
    ) {
        this.activateTokenRefresh();
    }

    refreshToken(): void {
        if (!this.authService.getAccessToken()) {
            this.router.navigate(['/login']);
            return;
        }

        this.authService.refreshToken()
            .subscribe(
                () => {
                    this.apiFails = 0;
                },
                (err: any) => {

                    const isInvalidToken = err && err.error && err.error.error === 'invalid_grant';
                    const isMaxTriesReached = this.apiFails >= LOGIN.refreshTokenMaxFailRequests;

                    if (this.timer && (isInvalidToken || isMaxTriesReached)) {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }

                    // if no internet connection
                    if (err && err.status === -1) {
                        return;
                    }

                    this.apiFails++;
                },
            );
    }

    activateTokenRefresh(): void {

        this.zone.runOutsideAngular(() => {
            this.timer = setInterval(() => {

                const tokenExpireUnixTime = +this.authService.getTokenExpireDate();
                const deltaTime = LOGIN.refreshTokenBeforeSec;
                const nowUnixTime = new Date().getTime();

                if (nowUnixTime < tokenExpireUnixTime) {
                    if (nowUnixTime >= tokenExpireUnixTime - deltaTime) {
                        this.refreshToken();
                    }
                } else {
                    this.authService.logout();
                }

            }, 1000 * 10); // check every 10 second
        });
    }

    ngOnDestroy(): void {
        clearInterval(this.timer);
    }
}
