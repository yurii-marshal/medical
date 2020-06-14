import {
    CanActivate,
    CanActivateChild,
    Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@app/auth/shared/services/auth.service';

@Injectable()
export class RedirectToAuthGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.getAccessToken()) {
            return true;
        }

        this.router.navigate(['/login']);
        return;
    }

    canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate();
    }
}
