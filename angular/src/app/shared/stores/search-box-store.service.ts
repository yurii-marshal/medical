import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
    SearchBoxParams,
    SearchBoxParamsMock,
} from '../modules/nikobot-autocomplete/nikobot-autocomplete.config';

@Injectable()
export class SearchBoxStoreService {
    public searchBox$: BehaviorSubject<SearchBoxParams> = new BehaviorSubject(new SearchBoxParamsMock());

    constructor() {}

    public updateSearchBoxParams(params: SearchBoxParams): void {
        this.searchBox$.next(params);
    }

}
