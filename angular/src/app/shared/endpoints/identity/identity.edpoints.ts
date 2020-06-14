import { Injectable } from '@angular/core';
import { WEB_API_URLS } from '../../consts/web-api-urls.const';
import {
    HttpClient,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { LOGIN } from '@app/auth/shared/consts/login.const';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { ForgotPassRequest } from '@app/auth/components/forgot-pass/forgot-pass.interface';
import { ChangePassRequest } from '@app/auth/components/change-pass/change-pass.interface';
import { Profile } from '../../interfaces/models/profile.model';
import { PersonnelItems } from '../../interfaces/profile-service.interface';
import { EditProfileRequest } from '@app/edit-profile/edit-profile.interface';

@Injectable()
export class IdentityEndpointsService {

    constructor(private httpClient: HttpClient) {}

    public resendTwoFactorCode(mfaToken): Observable<object> {
        const payload = {
            mfa_token: mfaToken,
        };

        return this.httpClient.post(
            `${ WEB_API_URLS.WEB_API_IDENTITY_URI }connect/mfa/challenge`,
            payload,
        );
    }

    public twoFactorAuth(mfaToken: string, code: string): Observable<object> {
        const payload = `grant_type=mfa-otp`
            + `&scope=${LOGIN.scopeValue}`
            + `&client_id=${LOGIN.clientId}`
            + `&client_secret=${LOGIN.clientSecret}`
            + `&code=${encodeURIComponent(code.trim())}`
            + `&mfa_token=${encodeURIComponent(mfaToken.trim())}`;


        let headers = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this.httpClient.post(
            `${WEB_API_URLS.WEB_API_IDENTITY_URI}connect/token`,
            payload,
            {
                // headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
                headers,
               // withCredentials: true
            });
    }

    public login(username: string, password: string): Observable<object> {
        const payload = `grant_type=${LOGIN.grantType}`
            + `&scope=${LOGIN.scopeValue}`
            + `&client_id=${LOGIN.clientId}`
            + `&client_secret=${LOGIN.clientSecret}`
            + `&username=${encodeURIComponent(username.trim())}`
            + `&password=${encodeURIComponent(password.trim())}`;

        return this.httpClient.post(
            `${WEB_API_URLS.WEB_API_IDENTITY_URI}connect/token`,
            payload,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            });
    }

    public refreshToken(refreshToken: string): Observable<object> {
        const payload = `client_id=${LOGIN.clientId}`
            + `&client_secret=${LOGIN.clientSecret}`
            + `&refresh_token=${ refreshToken }`
            + `&grant_type=${LOGIN.refreshGrantType}`;

        return this.httpClient.post(
            `${WEB_API_URLS.WEB_API_IDENTITY_URI}connect/token`,
            payload,
            {
                headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
            });
    }

    public remindPass(payload: ForgotPassRequest): Observable<object> {
        return this.httpClient.post(`${WEB_API_URLS.WEB_API_IDENTITY_URI}account/ForgotPassword`, payload);
    }

    public changePass(payload: ChangePassRequest): Observable<object> {

        return this.httpClient.post(`${WEB_API_URLS.WEB_API_IDENTITY_URI}Account/ChangePassword`, payload);
    }

    public getProfile(): Observable<Profile> {
       return this.httpClient.get<Profile>(`${WEB_API_URLS.WEB_API_IDENTITY_URI}users/profile`);
    }

    public getPersonnelDictionary(fullName: string): Observable<PersonnelItems> {
        const httpParams = new HttpParams()
            .set('sortExpression', 'Name.FullName ASC')
            .set('fullName', fullName);

        return this.httpClient.get<PersonnelItems>(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/personnel`, {params: httpParams});
    }

    public putProfile(payload: EditProfileRequest): Observable<object> {
        return this.httpClient.put(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/users/profile`, payload);
    }

    public getProfileImage(pictureToken: string): Observable<object> {

        if (!pictureToken) {
            return of((observer) => {
                observer.next({data: {Data: ''} });
            });
        }

        return this.httpClient.get(`${WEB_API_URLS.WEB_API_IDENTITY_URI}users/profile/picture/${ pictureToken }`);
    }

}

