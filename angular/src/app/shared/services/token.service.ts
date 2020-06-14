import { Injectable } from '@angular/core';
import { LOGIN } from '@app/auth/shared/consts/login.const';
import { LoginResponse } from '@app/auth/shared/interfaces/auth.interface';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class TokenService {
    public token$: BehaviorSubject<string | null> = new BehaviorSubject(this.getAccessToken());

    constructor(
        public localStorageService: LocalStorageService,
    ) {
    }

    public getAccessToken(): string | null {
        return this.localStorageService.get(LOGIN.accessToken);
    }

    public setMFAToken(token: string): void {
        this.localStorageService.set(
            'mfa_token',
            token,
        );
    }

    public getMFAToken(): string {
        return this.localStorageService.get('mfa_token');
    }

    public updateTokenFromLocalStorage() {
        this.token$.next(this.getAccessToken());
    }

    public setToken(token: LoginResponse, action: string): void {
        switch (action) {
            case 'logout':
                this.localStorageService.remove(LOGIN.accessToken);
                this.localStorageService.remove(LOGIN.refreshToken);
                this.localStorageService.remove(LOGIN.tokenExpireDate);
                this.token$.next(null);
                break;
            case 'login':
                this.localStorageService.set(
                    LOGIN.accessToken,
                    token.access_token,
                );
                this.localStorageService.set(
                    LOGIN.refreshToken,
                    token.refresh_token,
                );
                this.localStorageService.set(
                    LOGIN.tokenExpireDate,
                    (+(new Date()) + token.expires_in * 1000).toString(),
                );
                this.token$.next(token.access_token);
                break;
            default:
        }
    }

    public getTokenExpireDate(): string {
        return this.localStorageService.get(LOGIN.tokenExpireDate);
    }

    public getRefreshToken(): string {
        return this.localStorageService.get(LOGIN.refreshToken);
    }
}
