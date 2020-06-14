import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Idle } from '@ng-idle/core';
import { Login } from '../interfaces/login.interface';
import { LoginResponse } from '../interfaces/auth.interface';
import { ChangePassRequest } from '../../components/change-pass/change-pass.interface';
import { ForgotPassRequest } from '../../components/forgot-pass/forgot-pass.interface';
import { ToasterService } from '@shared/services/toaster.service';
import { TokenService } from '@shared/services/token.service';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';
import { IdentityEndpointsService } from '@shared/endpoints/identity/identity.edpoints';
import { LocalStorageService } from 'angular-2-local-storage';
import { CrossTabNotifierService } from '@shared/services/crosstab-notifier.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService extends TokenService {
    constructor(private toasterService: ToasterService,
                private router: Router,
                private idle: Idle,
                private routerNavigator: RouterNavigatorService,
                private identityEndpointsService: IdentityEndpointsService,
                public localStorageService: LocalStorageService,
                private tabNotifier: CrossTabNotifierService,
    ) {
        super(localStorageService);
    }

    public refreshToken(): Observable<object> {
        return this.identityEndpointsService.refreshToken(
            this.getRefreshToken(),
        ).pipe(
            tap((response: LoginResponse) => {
                this.setToken(response, 'login');
            }),
        );
    }

    public logout(action?: string) {
        const emptyToken = {
            access_token: null,
            expires_in: null,
            refresh_token: null,
            token_type: null,
        };

        this.setToken(emptyToken, action || 'logout');

        this.routerNavigator.navigate(['/login']);

        this.tabNotifier.setTabLogout();
    }

    public sendTwoFactorCode(code) {
        return this.identityEndpointsService.twoFactorAuth(this.getMFAToken(), code)
            .pipe(
                tap((response: LoginResponse) => {
                        this.setToken(response, 'login');
                        return response;
                    },
                    (error) => {
                        if (error.error.mfa_token) {
                            this.setMFAToken(error.error.mfa_token);
                        } else {
                            this.toasterService.showToaster(
                                error.error.error_description,
                                ['danger', 'nikoToast', 'top-20'],
                                'toast-container-for-login',
                            );
                        }
                    }),
            );
    }

    public login(loginModel: Login): Observable<object> {

        return this.identityEndpointsService.login(loginModel.username, loginModel.password)
            .pipe(
                tap(
                    (response: LoginResponse) => {
                        this.setToken(response, 'login');
                        return response;
                    },
                    (error) => {
                        if (error.error.mfa_token) {
                            this.setMFAToken(error.error.mfa_token);
                        } else {
                            this.toasterService.showToaster(
                                error.error.error_description,
                                ['danger', 'nikoToast', 'top-20'],
                                'toast-container-for-login',
                            );
                        }
                    },
                ),
            );
    }

    public remindPass(payload: ForgotPassRequest): Observable<object> {
        return this.identityEndpointsService.remindPass(payload);
    }

    public changePass(payload: ChangePassRequest): Observable<object> {

        return this.identityEndpointsService.changePass(payload)
            .pipe(
                tap((response: any) => response),
            );
    }
}
