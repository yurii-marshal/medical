import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import {
    ReportExecuteRequest,
    ReportPageState,
    ReportsMenuItem,
} from './reports.interface';
import {
    normalizeReportPageConf,
    normalizeReportsMenu,
} from './reports.normalizers';

import { appConfig } from '../../../../../app-config/app-config';
import { map } from 'rxjs/operators';

@Injectable()
export class ReportsEndpointsService {

    constructor(private httpClient: HttpClient) {
    }

    public getReportsMenu(): Observable<ReportsMenuItem[]> {
        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/reports`)
            .pipe(
                map((response) => normalizeReportsMenu(response)),
            );
    }

    public getReportPageConf(sourceId: string): Observable<ReportPageState> {
        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/reports/${sourceId}`)
            .pipe(
                map((response) => normalizeReportPageConf(response)),
            );
    }

    public getReportsRows(sourceId: string, paramsData: ReportExecuteRequest): Observable<any> {
        return this.httpClient.post(`${WEB_API_URLS.WEB_API_SERVICE_URI}/v1/reports/${ sourceId }/execute`, paramsData);
    }

    public getLocationDictionary(url: string, text: string, paramsField: string): Observable<any> {
        const params = {};
        const requestUrl = `${ appConfig.server_url.replace(/api\/$/, '') }${ url.replace(/^\//, '') }`;

        params[paramsField] = text;

        return this.httpClient.get(requestUrl, {params});
    }
}
