import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { normalizeStatesDictionaries } from './setting-dictionaries.normalizers';
import { StatesDictionaryState } from './setting-dictionaries.interface';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { map } from 'rxjs/operators';

@Injectable()
export class SettingDictionariesEndpointsService {

    constructor(
        private httpClient: HttpClient,
    ) {}

    public getStatesDictionary(query): Observable<StatesDictionaryState> {
        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/settings/states/dictionary?abbreviation=${query}`)
            .pipe(
                map((response) => normalizeStatesDictionaries(response)),
            );
    }
}
