import {
    Component,
    NgZone,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {
    Router,
    NavigationStart,
    NavigationEnd,
} from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { MatDialog, MatDialogRef } from '@angular/material';
import { SessionTimerComponent } from './auth/components/session-timer/session-timer.component';
import { AuthService } from './auth/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { CrossTabNotifierService } from '@shared/services/crosstab-notifier.service';
import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { ToasterService } from '@shared/services/toaster.service';
import { IframeMsgTypes } from '@shared/interfaces/iframe.enum';
import { ProfileService } from '@shared/services/profile.service';
import { TokenService } from '@shared/services/token.service';

@Component({
    selector: 'app-root',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})

export class IndexComponent implements OnInit, OnDestroy {
    public title = 'app';
    public routeChangeSubscription: Subscription;
    public tokenSubscription: Subscription;
    public idleWarningSubscription: Subscription;
    public sessionTimerDialogRefSub: Subscription;

    public sessionTimerDialogRef: MatDialogRef<SessionTimerComponent>;
    public isSessionTimerDialogOpen = false;

    constructor(
        private idle: Idle,
        private keepalive: Keepalive,
        private router: Router,
        private dialog: MatDialog,
        private authService: AuthService,
        private routerNavigatorService: RouterNavigatorService,
        private tabNotifier: CrossTabNotifierService,
        private zone: NgZone,
        private toasterService: ToasterService,
        private profileService: ProfileService,
        private tokenService: TokenService,
    ) {

        this.idle.setIdle(900); // 900 - 15 minutes
        this.idle.setTimeout(60); // 60 seconds
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        /** Toast data from app1 */
        this.zone.runOutsideAngular(() => {
            fromEvent(window, 'message').pipe(
                filter((event: MessageEvent) => event.data),
                map((event: MessageEvent) => event.data),
            ).subscribe((data) => {

                switch (data.msgType) {
                    case IframeMsgTypes.Toast:

                        this.toasterService.showToaster(
                            data.toastData.text,
                            [data.toastData.type, 'nikoToast'],
                        );

                        break;
                    case IframeMsgTypes.RedirectUrl:

                        window.open(data.url, '_self');

                        break;
                    default:
                        break;

                }

            });
        });
    }

    ngOnInit() {

        /**
         * @description adding class to main container for hiding main navigation
         */
        this.routeChangeSubscription = this.router.events
            .subscribe((event) => {
                const authRoutes: string[] = ['login', 'changepass', 'forgotpass'];
                if (event instanceof NavigationEnd ||
                    event instanceof NavigationStart) {

                    const userIsAuthorized = !authRoutes.find((route) => {
                         return !!event.url.match(route);
                    });

                    if (userIsAuthorized && window.location.href.slice(-5) !== 'login') {
                        localStorage.setItem('url_before_login', window.location.href);
                    }
                }
            });

        /**
         * @description subscription on token$ BehaviorSubject to watch LOGIN & LOGOUT
         *  this.authService.token$ inherited from TokenService
         */
        this.tokenSubscription = this.authService.token$
            .subscribe({
                next: (token) => {
                    if (token) {
                        this._startIdleWatch();
                    } else {
                        this._stopIdleWatch();
                    }
                },
            });

        /**
         * @description opening dialog with warning about 15 min idle and expiring session
         */
        this.idleWarningSubscription = this.idle.onTimeoutWarning
            .subscribe(() => {

                if (!this.tokenService.getAccessToken()) {
                    return ;
                }


                console.log('idleWarningSubscription');

                if (!this.isSessionTimerDialogOpen) {
                    this.isSessionTimerDialogOpen = true;
                    this.sessionTimerDialogRef = this.dialog.open(SessionTimerComponent, {
                        panelClass: ['modal-window', 'session-timer-modal'],
                        disableClose: true,
                    });

                    this.sessionTimerDialogRefSub = this.sessionTimerDialogRef
                        .afterClosed()
                        .subscribe(() => {
                            this.isSessionTimerDialogOpen = false;
                        });
                }
            });

        /**
         * @description synchronize all app browser tabs login/logout
         */
        this.tabNotifier.on('loggedIn', () => {
            this.authService.updateTokenFromLocalStorage();
            this.loginInactiveTabs();
        }, this);

        this.tabNotifier.on('logout', () => {

            if (this.sessionTimerDialogRef) {
                this.sessionTimerDialogRef.close();
            }

            this.authService.updateTokenFromLocalStorage();

            this.routerNavigatorService.navigate(['/login']).then(() => {
                // After navigate clear profile data. It is need to make sure navigate component was destroyed.
                this.profileService.clearProfile();
            });

            this._stopIdleWatch();

        }, null);

        this.tabNotifier.on('lastTabLogout', () => {
            this.authService.logout();
        }, null);
    }

    ngOnDestroy() {
        this.routeChangeSubscription.unsubscribe();
        this.tokenSubscription.unsubscribe();
        this.idleWarningSubscription.unsubscribe();
        this.sessionTimerDialogRefSub.unsubscribe();
    }

    /**
     * @description Start watching for inactivity.
     */
    private _startIdleWatch(): void {
        this.idle.watch();
    }

    /**
     * @description Stops watching for inactivity.
     */
    private _stopIdleWatch(): void {
        this.idle.stop();
    }

    private loginInactiveTabs(): void {
        const prevUrl = localStorage.getItem('url_before_login');
        if (prevUrl) {
            const url = prevUrl.match(/\#(\S+)/)[1];

            this.router.navigateByUrl(url);
        } else {
            this.routerNavigatorService.navigate(['/dashboard']);
        }
    }
}
