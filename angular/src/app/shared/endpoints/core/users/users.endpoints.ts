import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http/src/params';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { GetUsersParams, IHelpdescRequest } from './users.interfaces';
import {
    normalizeUserPermissions,
    normalizeUsersData,
} from './user.normalizers';
import { TokenService } from '@shared/services/token.service';
import { map } from 'rxjs/operators';


@Injectable()
export class UsersEndpointsService {

    constructor(
        private httpClient: HttpClient,
        private tokenService: TokenService,
    ) {
    }

    public getUsers(params: GetUsersParams = {}): Observable<any> {
        const httpParams = {
            params: <HttpParams>params,
        };

        return this.httpClient.get(`${WEB_API_URLS.WEB_API_IDENTITY_URI}users/list`, httpParams)
            .pipe(
                map((response) => normalizeUsersData(response)),
            );
    }

    public getUserPermissions() {
        return this.httpClient.get(`${WEB_API_URLS.WEB_API_IDENTITY_URI}users/permissions`)
            .pipe(
                map((response) => normalizeUserPermissions(response)),
            );
    }

    public sendToHelpdesc(data: IHelpdescRequest): Observable<any> {
        const token = this.tokenService.getAccessToken();
        const formData: FormData = new FormData();

        data.files.forEach((file, index) => {
            formData.append(`Files[${ index }]`, file, file.name);
        });

        formData.append('Description', data.description);
        formData.append('Subject', data.subject);

        const headers = new HttpHeaders();

        headers.set('Content-Type', 'multipart/form-data');
        headers.set('Accept', 'application/json');
        headers.set('Authorization', `Bearer${ token }`);

        return this.httpClient.post(
            `${WEB_API_URLS.WEB_API_SERVICE_URI}v1/users/helpdesk`,
            formData,
            {
                headers,
            },
        );
    }
}
