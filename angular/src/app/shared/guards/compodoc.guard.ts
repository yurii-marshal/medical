import {
    CanActivate,
    Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class CompodocGuard implements CanActivate {

    constructor(private router: Router) {
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (!environment.production) {
            return true;
        }
        this.router.navigate(['/login']);
        return;
    }
}
