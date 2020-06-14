import { Injectable, NgZone } from '@angular/core';
import {
    Router,
    NavigationEnd,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Observable } from 'rxjs';
import { merge } from 'rxjs/observable/merge';
import { IframeMsgTypes } from '@shared/interfaces/iframe.enum';
import isEmpty from 'lodash-es/isEmpty';

interface RouteData {
    url?: string;
    title?: string;
    topMenu?: string;
    silent?: boolean;
}

@Injectable()
export class NavigationData {
    public actualRouteData$: Observable<RouteData> = new Observable<RouteData>();
    public routerData$: Observable<RouteData> = new Observable<RouteData>();
    private postMessage$: Observable<RouteData> = new Observable<RouteData>();

    constructor(
        private router: Router,
        private zone: NgZone,
    ) {
        /** Route data from app2 routing */
        this.routerData$ = router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map((event: NavigationEnd) => this.getRouteData(router.routerState.root.children)),
        );

        /** Route data from app1 routing */
        this.zone.runOutsideAngular(() => {
            this.postMessage$ = fromEvent(window, 'message').pipe(
                filter((event: MessageEvent) => event.data && event.data.msgType === IframeMsgTypes.Route && event.data.url),
                map((event) => {
                    return event.data;
                }),
            );
        });

        this.actualRouteData$ = merge(this.routerData$, this.postMessage$).pipe(
            filter((data) => !isEmpty(data)),
        );
    }

    private getRouteData(activeRoute) {
        let data;

        for (const child of activeRoute) {
            if (!isEmpty(child.data._value)) {
                data = child.data._value;
                break;
            }

            data = this.getRouteData(child.children);
        }

        return data;
    }

}
