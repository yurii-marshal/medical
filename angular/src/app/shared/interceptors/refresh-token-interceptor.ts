import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
} from '@angular/common/http';
import { AuthService } from '@app/auth/shared/services/auth.service';
import { Observable, Subject } from 'rxjs';
import { _throw as throwError } from 'rxjs/observable/throw';
import {
    switchMap,
    finalize,
    filter,
    take,
    catchError,
} from 'rxjs/operators';
import { setHeaders, isActivateTokenRefresh } from './intercept-helper';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    public isRefreshingToken = false;
    public isWaitingForToken = false;
    public refreshToken$: Subject<any> = new Subject<any>();

    constructor(private authService: AuthService) {
    }

    public handleRefreshToken(req: HttpRequest<any>, next: HttpHandler) {

        if (!this.isRefreshingToken) {
            this.isRefreshingToken = true;
            this.refreshToken$.next(null);

            return this.authService.refreshToken()
                .pipe(
                    switchMap((tokenObj: any) => {

                        if (tokenObj && tokenObj.access_token) {
                            this.refreshToken$.next(tokenObj);

                            return next.handle(this.addAuthenticationToken(req));
                        } else {
                            this.authService.logout();
                        }
                    }),
                    finalize(() => {
                        this.isRefreshingToken = false;
                    }),
                    catchError((err) => {
                        this.isRefreshingToken = false;
                        this.authService.logout();

                        return throwError(err);
                    }),
                );
        } else {
            if (!this.isWaitingForToken) {
                const requestHandle = next.handle(req);

                this.isWaitingForToken = true;

                requestHandle.subscribe(() => {
                    this.isWaitingForToken = false;
                });

                return requestHandle;
            } else {
                return this.refreshToken$.pipe(
                    filter((result) => result !== null),
                    take(1),
                    switchMap(() => {
                        return next.handle(this.addAuthenticationToken(req));
                    }),
                );
            }
        }
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isActivateTokenRefresh(this.authService.getTokenExpireDate())) {
            return this.handleRefreshToken(request, next);
        } else {
            return next.handle(request);
        }
    }

    public addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
        const accessToken = this.authService.getAccessToken();

        if (!accessToken) {
            return request;
        }

        return request.clone(setHeaders(accessToken));
    }
}
