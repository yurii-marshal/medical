import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WEB_API_URLS } from '../../consts/web-api-urls.const';
import {
    NikoBotActionRequest,
    NikoBotState,
} from './nlp.interface';
import { normalizeNikoBotData } from './nlp.normalizers';
import { map } from 'rxjs/operators';

@Injectable()
export class NlpEndpointsService {

    constructor(
        private httpClient: HttpClient,
        @Inject('moment') private moment,
    ) {
    }

    public submitNikoBotAction(payload: NikoBotActionRequest): Observable<object> {
        return this.httpClient.post(`${WEB_API_URLS.WEB_API_NLP_SERVICE_URI}v1.0/action`, payload)
            .pipe(
                map((response: NikoBotState) => normalizeNikoBotData(response)),
            );
    }
}
