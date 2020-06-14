import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { UserNotificationsEndpointsService } from '@shared/endpoints/core/user-notifications/user-notifications.endpoints';
import { Subscription } from 'rxjs';
import { NavigationStart, Router } from '@angular/router';
import {
    initNotificationState,
    NotificationState,
} from '@shared/endpoints/core/user-notifications/user-notifications.interface';
import { NotificationTypes } from './notification-types.enum';

@Component({
    selector: 'app-user-notifications',
    templateUrl: './user-notifications.component.html',
    styleUrls: ['./user-notifications.component.scss'],
})

export class UserNotificationsComponent implements OnInit, OnDestroy {

    public routeChangeSubscription: Subscription;
    public notificationUpdateSubscription: Subscription;
    public haveNotifications = false;
    public notificationsLoadingStatus = false;
    public isNotificationsOpened = null;
    public notificationsState: NotificationState = initNotificationState();

    public notificationTypes = NotificationTypes;

    constructor(
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private elementRef: ElementRef,
        private router: Router,
        private notificationsService: UserNotificationsEndpointsService,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'notification-bell',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/bell.svg'));
        this.iconRegistry.addSvgIcon(
            'document-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/documents.svg'));
        this.iconRegistry.addSvgIcon(
            'message-icon',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/messages.svg'));
        this.iconRegistry.addSvgIcon(
            'message-bell',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/messages.svg'));

    }

    ngOnInit() {
        this.notificationUpdateSubscription = this.getNotifications();

        this.routeChangeSubscription = this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    if (this.isNotificationsOpened) {
                        this.isNotificationsOpened = false;
                    }
                }
            });
    }

    ngOnDestroy() {
        this.routeChangeSubscription.unsubscribe();
        this.notificationUpdateSubscription.unsubscribe();
    }

    // TODO There is no way to unsubscription, change to Rx.Observable.fromEvent(document, 'click')
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            if (this.isNotificationsOpened) {
                this.isNotificationsOpened = false;
            }
        }
    }

    private getNotifications(): Subscription {
        this.notificationsLoadingStatus = true;
        return this.notificationsService.getNotifications()
            .subscribe((res: NotificationState) => {
                this.notificationsState = res;
                this.haveNotifications = !!this.notificationsState.notifications.count;

                this.notificationsState.notifications.allIds.forEach((notificationId) => {
                    const notification = this.notificationsState.notifications.byId[notificationId];
                    notification.displayText =
                        notification.typeId === this.notificationTypes.Message ?
                            notification.title :
                            notification.text;
                });

                this.notificationsLoadingStatus = false;
            });
    }

    public toggleNotifications(): void {
        this.isNotificationsOpened = !this.isNotificationsOpened;
        if (this.isNotificationsOpened) {
            this.notificationUpdateSubscription.unsubscribe();
            this.notificationUpdateSubscription = this.getNotifications();
        }
    }

    public clearNotificationById(id: string, index: number) {
        this.notificationsLoadingStatus = true;
        return this.notificationsService.clearNotificationById(id)
            .subscribe((res: any) => {

                this.notificationsState.notifications.allIds.splice(index, 1);
                delete this.notificationsState.notifications.byId[id];

                this.notificationsLoadingStatus = false;

                if (this.notificationsState.notifications.allIds.length === 0) {
                    this.haveNotifications = false;
                    this.isNotificationsOpened = false;
                }
            });
    }

    public clearAllNotifications() {
        this.notificationsLoadingStatus = true;
        return this.notificationsService.clearNotifications()
            .subscribe((res: any) => {
                this.haveNotifications = false;
                this.notificationsState = initNotificationState();
                this.notificationsLoadingStatus = false;
                this.isNotificationsOpened = false;
            });
    }

}
