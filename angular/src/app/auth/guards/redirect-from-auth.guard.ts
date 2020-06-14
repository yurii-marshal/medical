import {
    CanActivate,
    Router,
} from '@angular/router';

import { AuthService } from '../shared/services/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterNavigatorService } from '@shared/services/navigation-router.service';

@Injectable()
export class RedirectFromAuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        private routerNavigatorService: RouterNavigatorService,
    ) {
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.getAccessToken()) {
            return true;
        }

        this.routerNavigatorService.navigate(['/dashboard']);
        return;
    }
}
