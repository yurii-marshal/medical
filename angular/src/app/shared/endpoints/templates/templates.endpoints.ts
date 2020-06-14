import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from '@shared/services/token.service';
import { WEB_API_URLS } from '../../consts/web-api-urls.const';
import { PdfTemplate } from './templates.interface';
import { normalizePdfFormInfo } from './templates.normalizers';
import { PdfFormInfo } from '@shared/modules/pdf-form-review/models/pdf-form-review.interfaces';


@Injectable()
export class TemplatesEndpointsService {

    constructor(
        private httpClient: HttpClient,
        private tokenService: TokenService,
    ) {}

    public loadPdfInfo(file: any): Observable<PdfFormInfo> {
        const token = this.tokenService.getAccessToken();
        const formData = new FormData();
        const headers = new HttpHeaders({
            Accept: 'application/json',
            Authorization: `Bearer ${ token }`,
        });

        formData.append(`file`, file, file.name);

        return this.httpClient.post<PdfFormInfo>(
            `${WEB_API_URLS.WEB_API_TEMPLATES_URI}v1/pdf/info`,
            formData,
            { headers },
        ).pipe(
            map((response) => normalizePdfFormInfo(response)),
        );
    }

    public getPdfInfo(id: string, data: any = { Data: {} }): Observable<PdfFormInfo> {
        return this.httpClient.post<PdfFormInfo>(`${WEB_API_URLS.WEB_API_TEMPLATES_URI}v1/pdf/${id}/info`, data)
            .pipe(
                map((response) => normalizePdfFormInfo(response)),
            );
    }

    public getPdfTemplate(id: string): Observable<PdfTemplate> {
        return this.httpClient.get<PdfTemplate>(`${WEB_API_URLS.WEB_API_TEMPLATES_URI}v1/pdf/${id}`);
    }

    public createPdfTemplate(data: PdfTemplate): Observable<any> {
        return this.httpClient.post(`${WEB_API_URLS.WEB_API_TEMPLATES_URI}v1/pdf`, data);
    }

    public updatePdfTemplate(id: string, data: PdfTemplate): Observable<any> {
        return this.httpClient.put(`${WEB_API_URLS.WEB_API_TEMPLATES_URI}v1/pdf/${id}`, data);
    }

    public deletePdfTemplate(id: string): Observable<any> {
        return this.httpClient.delete(`${WEB_API_URLS.WEB_API_TEMPLATES_URI}v1/pdf/${id}`);
    }
}
