import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { UsersEndpointsService } from '../endpoints/core/users/users.endpoints';
import { TokenService } from './token.service';

@Injectable()
export class UserPermissionsService {

    constructor(
        private localStorageService: LocalStorageService,
        private usersEndpointsService: UsersEndpointsService,
        private tokenService: TokenService,
    ) {}

    public getPermissions() {
        return this.localStorageService.get('Permissions');
    }

    public initPermissions() {
        return new Promise((resolve) => {
            if (!this.getPermissions() && this.tokenService.getAccessToken()) {

                this.usersEndpointsService.getUserPermissions()
                    .subscribe((permissions) => {
                        this.localStorageService.set('Permissions', permissions);
                        resolve(true);
                    });

                return ;
            } else if (!this.tokenService.getAccessToken()) {

                this.clearPermissions();
            }

            resolve(true);
        });
    }

    public isAllow(page: string, action: string) {
        const permissions = this.getPermissions();

        return permissions ? permissions[page] && (permissions[page].Permissions.indexOf(action) > -1) : false;
    }

    public clearPermissions() {
        this.localStorageService.remove('Permissions');
    }
}

export function userPermissionsFactory(provider: UserPermissionsService) {
    return () => provider.initPermissions();
}
