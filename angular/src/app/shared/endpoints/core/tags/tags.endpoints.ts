import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { normalizeTags } from './tags.normalizers';
import { TagsState } from './tags.interface';
import { TagsType } from './tags.enum';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { map } from 'rxjs/operators';

@Injectable()
export class TagsEndpointsService {

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    public getTags(tagsType: TagsType, query = ''): Observable<TagsState> {
        return this.httpClient.get(`${this.getUrl(tagsType)}?sortExpressign=Name+ASC&name=${query}`)
            .pipe(
                map((response) => normalizeTags(response)),
            );
    }

    public getPatientTags(id: string): Observable<any> {
        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/patients/${id}/tags`);
    }

    public createTag(tagsType: TagsType, tag: string): Observable<any> {
        return this.httpClient.post(this.getUrl(tagsType), {Name: tag});
    }

    private getUrl(tagsType: TagsType) {
        let url = `${WEB_API_URLS.WEB_API_SERVICE_URI}v1/orders/tags`;

        switch (tagsType) {
            case TagsType.patient:
                url = `${WEB_API_URLS.WEB_API_SERVICE_URI}v1/patients/tags`;
                break;
            case TagsType.claim:
                url = `${WEB_API_URLS.WEB_API_BILLING_SERVICE_URI}v1/claims/tags`;
                break;
        }

        return url;
    }
}
