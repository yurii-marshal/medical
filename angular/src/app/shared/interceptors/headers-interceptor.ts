import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WEB_API_URLS } from '../consts/web-api-urls.const';
import { ToasterService } from '../services/toaster.service';
import { ErrorMessageHelperService } from '../helpers/services/error-message-helper.service';
import { TokenService } from '../services/token.service';
import { setHeaders, isUrlRequireToken } from './intercept-helper';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private toasterService: ToasterService,
        private errorMessageHelperService: ErrorMessageHelperService,
        private authService: TokenService,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authReq = req;
        // Clone the request to add the new header.

        // if (isActivateTokenRefresh(this.authService.getTokenExpireDate())) {
        //     return next.handle(req);
        // }

        if (req && req.url
            && (
                req.url.indexOf(WEB_API_URLS.WEB_API_SERVICE_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_INVENTORY_SERVICE_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_BILLING_SERVICE_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_NLP_SERVICE_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_TASKS_SERVICE_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_IDENTITY_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_FAX_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_CATALOG_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_TEMPLATES_URI) > -1
                || req.url.indexOf(WEB_API_URLS.WEB_API_ORGANIZATIONS_URI) > -1)
            && isUrlRequireToken(req.url)) {

            // Get the auth token from the service.
            const token = this.authService.getAccessToken();

            if (!token) {
                // Do not redirect if we on the login screen
                if (!window.location.href.match(/\/login\//)) {
                    this.router.navigate(['/login']);
                    next.handle(authReq);
                }
            } else {
                authReq = req.clone(setHeaders(token));
            }

        }

        // Pass on the cloned request instead of the original request.
        return next.handle(authReq).pipe(tap((event: HttpEvent<any>) => {
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    // Do not redirect if we on the login screen
                    if (!window.location.href.match(/\/login\//)) {
                        this.router.navigate(['/login']);
                        next.handle(authReq);
                    }
                } else {
                    if (req &&
                        req.url &&
                        isUrlRequireToken(req.url)) {

                        const error = this.errorMessageHelperService.getErrorMsg(err);

                        try {
                            this.toasterService.showToaster(error, ['danger', 'nikoToast']);
                        } catch (e) {
                            alert(error);
                        }
                    }
                }
            }
        }));
    }
}
