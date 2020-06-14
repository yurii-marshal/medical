import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { Observable } from 'rxjs';
import { LocationsResponseGetParams } from './organization-locations.interface';
import { HttpParams } from '@angular/common/http/src/params';

@Injectable()
export class OrganizationLocationsEndpointsService {

    constructor(private httpClient: HttpClient) {}

    public getLocations(params: LocationsResponseGetParams = {}): Observable<any> {
        const options = {params: <HttpParams>params};

        return this.httpClient.get(`${WEB_API_URLS.WEB_API_ORGANIZATIONS_URI}v1/organization/locations`, options);
          //  .map((response) => normalizeNotificationData(response));
    }
}
