import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { HttpParams } from '@angular/common/http/src/params';

@Injectable()
export class UserReportsEndpointsService {

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getUserReports(reportId: number, params: any): Observable<object> {
        const options = {params: <HttpParams>params};

        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}reports/user-reports/${reportId}/load`, options);
    }
}
