import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { normalizeNotificationData } from './user-notifications.normalizers';
import { NotificationState } from './user-notifications.interface';
import { WEB_API_URLS } from '../../../consts/web-api-urls.const';
import { map } from 'rxjs/operators';

@Injectable()
export class UserNotificationsEndpointsService {

    constructor(private httpClient: HttpClient) {}

    public getNotifications(): Observable<NotificationState> {
        return this.httpClient.get(`${WEB_API_URLS.WEB_API_SERVICE_URI}v1/users/notifications`)
            .pipe(
                map((response) => normalizeNotificationData(response)),
            );
    }

    public clearNotifications(): Observable<object> {
        return this.httpClient.post(
            `${WEB_API_URLS.WEB_API_SERVICE_URI}v1/users/notifications/clear`,
            null);
    }

    public clearNotificationById(notificationId: string): Observable<object> {
        return this.httpClient.post(
            `${WEB_API_URLS.WEB_API_SERVICE_URI}v1/users/notifications/${notificationId}/clear`,
            null);
    }
}
