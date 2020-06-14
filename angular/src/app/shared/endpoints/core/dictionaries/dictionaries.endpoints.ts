import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import {
    HttpGetZipCodesParams,
    ZipDictionaryState,
} from './zip-codes.interface';
import { HttpParams } from '@angular/common/http/src/params';
import { normalizeZipDictionaries } from './zip-codes.normalizers';
import { normalizeContactTypesDictionary } from './contact-types.normalizers';
import { map } from 'rxjs/operators';
import { ContactType } from './contact-types.interface';
import { ClientFormValue } from '@shared/endpoints/core/dictionaries/client-form-values.interface';
import { normalizeClientFormValues } from '@shared/endpoints/core/dictionaries/client-form-values.normalizers';

@Injectable()
export class DictionariesEndpointsService {

    constructor(private httpClient: HttpClient) {
    }

    public getZipDictionary(params: HttpGetZipCodesParams): Observable<ZipDictionaryState> {
        return this.httpClient.get(`${ WEB_API_URLS.WEB_API_SERVICE_URI }dictionaries/zip-codes`, {params: <HttpParams>params})
            .pipe(
                map((response) => normalizeZipDictionaries(response)),
            );
    }

    public getPatientContactTypes(): Observable<ContactType[]> {

        return this.httpClient.get(`${ WEB_API_URLS.WEB_API_SERVICE_URI }patients/phone-types/dictionary`)
            .pipe(
                map((response) => normalizeContactTypesDictionary(response)),
            );
    }

    public getPatientStatusesTypes(): Observable<any> {
        return this.httpClient.get(`${ WEB_API_URLS.WEB_API_SERVICE_URI }patients/patient-status/dictionary`);
    }

    public getPatientAppointmentStatuses(): Observable<any> {
        return this.httpClient.get(`${ WEB_API_URLS.WEB_API_SERVICE_URI }v1/patients/events/appointment-types/dictionary`);
    }

    public getPatientInactivityReasons(): Observable<any> {
        return this.httpClient.get(`${ WEB_API_URLS.WEB_API_SERVICE_URI }patients/patient-inactive-status/dictionary`);
    }

    public getOrganizationContactTypes(): Observable<ContactType[]> {

        return this.httpClient.get(`${ WEB_API_URLS.WEB_API_SERVICE_URI }v1/organization/contact-types/dictionary`)
            .pipe(
                map((response) => normalizeContactTypesDictionary(response)),
            );
    }

    public getMappingDictionary(): Observable<ClientFormValue[]> {

        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/patients/forms/mapping/dictionary`)
            .pipe(
                map((response) => normalizeClientFormValues(response)),
            );
    }

    public getPatientOrderTypes(patientId: string): Observable<any> {
        return this.httpClient.get(
            `${WEB_API_URLS.WEB_API_SERVICE_URI}v1/orders/dictionary?pageIndex=0&pageSize=100&patientId=`
            + patientId
            + `&status=2&status=3`,
        );
    }

}
