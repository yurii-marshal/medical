import {
    Component,
    NgZone,
    ViewChild,
    ElementRef,
    OnDestroy,
} from '@angular/core';
import { Idle } from '@ng-idle/core';
import {
    DomSanitizer,
    Title,
} from '@angular/platform-browser';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
} from '@angular/router';

import { PubSubService } from '@shared/services/pub-sub.service';
import { appConfig } from '../../../../app-config/app-config';
import { NavigationData } from '@shared/services/navigation-data.service';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { merge } from 'rxjs/observable/merge';

@Component({
    selector: 'app-no-layout',
    templateUrl: './no-layout.component.html',
    styleUrls: ['./no-layout.component.scss'],
})

export class NoLayoutComponent implements OnDestroy {

    @ViewChild('iframe') iframe: ElementRef;

    events = ['mousemove', 'keydown', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'scroll'];
    title: string;
    el: HTMLFrameElement;
    isIframe = false;
    iframeEventsSub: Subscription;

    onload(ev: Event) {
        this.iframeEventsIdle();

        this.el = <HTMLFrameElement>ev.srcElement;
    }

    constructor(private pubsub: PubSubService,
                private route: ActivatedRoute,
                private router: Router,
                private sanitizer: DomSanitizer,
                private titleService: Title,
                private navigationData: NavigationData,
                private zone: NgZone,
                private idle: Idle,
    ) {

        router.events
            .pipe(
                debounceTime(150),
            )
            .forEach((event) => {

            // This event handle routing from app2 and need just for set url to iframe
            if (event instanceof NavigationEnd && this.isIframe) {

                const matchUrl = this.iframe.nativeElement.contentWindow.location.hash.replace('#', '');

                if (matchUrl !== event.url) {
                    this.iframe.nativeElement.contentWindow.location.replace(`${appConfig.app_v1_domain}/#${event.url}`);
                }
            }
        });

        pubsub.$sub('iframe')
            .pipe(debounceTime(10))
            .subscribe((isIframe: boolean) => {

            if (!isIframe) {
                this.iframe.nativeElement.contentWindow.location.replace(`${appConfig.app_v1_domain}/#/empty-iframe`);
            }

            this.changeIframeVisibility(isIframe);
        });

        this.navigationData.actualRouteData$.pipe(
        ).subscribe((data) => {

            const matchUrl = window.location.hash.replace('#', '');

            // This event handle routing from iframe and need just for set url on parent

            if (data.url && matchUrl !== data.url ) {
               this.router.navigateByUrl(data.url, { replaceUrl: true });
            }

            if (data.title) {
                this.titleService.setTitle(data.title);
                this.title = data.title;
            }
        });
    }

    changeIframeVisibility(isVisible: boolean) {
        this.zone.run(() => {
            this.isIframe = isVisible;
        });
    }

    iframeEventsIdle(): void {
        // Add EventListener to Iframe and run idle detection manually
        this.zone.runOutsideAngular(() => {
            const iframeEventsStreams = this.events.map((event) => fromEvent(this.iframe.nativeElement.contentDocument, event));
            const allIframeEvents$ = merge(...iframeEventsStreams);

            this.iframeEventsSub = allIframeEvents$.pipe(
                debounceTime(500),
            ).subscribe(() => {
                this.idle.interrupt();
            });
        });
    }

    ngOnDestroy() {
        if (this.iframeEventsSub) {
            this.iframeEventsSub.unsubscribe();
        }
    }
}
