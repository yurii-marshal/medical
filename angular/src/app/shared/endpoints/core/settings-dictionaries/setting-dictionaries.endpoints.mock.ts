import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { StatesDictionaryState } from './setting-dictionaries.interface';

@Injectable()
export class SettingDictionariesEndpointsMockService {

    constructor() {
    }

    public getStatesDictionary(): Observable<StatesDictionaryState> {
        return of(
            {
                byId: {
                    AA: {id: 'AA', text: 'Armed Forces Americas (except Canada)'},
                    AK: {id: 'AK', text: 'Alaska'},
                    AL: {id: 'AL', text: 'Alabama'},
                    AP: {id: 'AP', text: 'Armed Forces Pacific'},
                    AR: {id: 'AR', text: 'Arkansas'},
                    AS: {id: 'AS', text: 'American Samoa'},
                    AZ: {id: 'AZ', text: 'Arizona'},
                    CA: {id: 'CA', text: 'California'},
                    GA: {id: 'GA', text: 'Georgia'},
                    IA: {id: 'IA', text: 'Iowa'},
                    LA: {id: 'LA', text: 'Louisiana'},
                    MA: {id: 'MA', text: 'Massachusetts'},
                    PA: {id: 'PA', text: 'Pennsylvania'},
                    VA: {id: 'VA', text: 'Virginia'},
                    WA: {id: 'WA', text: 'Washington'},
                },
                allIds: ['AL', 'AK', 'AS', 'AZ', 'AR', 'AA', 'AP', 'CA', 'GA', 'IA', 'LA', 'MA', 'PA', 'VA', 'WA'],
            },
        );
    }
}
