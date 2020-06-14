import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { GetPatientsParams } from './patient.interfaces';
import { normalizePatientsData } from './patient.normalizers';

@Injectable()
export class PatientEndpointsService {

    constructor(private httpClient: HttpClient) {}

    public getPatients(params: GetPatientsParams = {}): Observable<any> {
        const httpParams = {
            params: <HttpParams>params,
        };

        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/patients`, httpParams)
            .pipe(
                map((response) => normalizePatientsData(response)),
            );
    }

    public getShortInfo(patientId): Observable<any> {
        return this.httpClient.get<any>(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/patients/${patientId}/short-info`);
    }

    public savePatientState(id: string, data: object): Observable<any> {
        return this.httpClient.put(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/patients/${id}/state`, data);
    }

}
