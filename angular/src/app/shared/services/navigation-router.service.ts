import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RouterNavigatorService {

    constructor(private router: Router) {}

    public navigate(commands: any[], params?: any) {
        return this.router.navigate(commands, params);
    }
}
