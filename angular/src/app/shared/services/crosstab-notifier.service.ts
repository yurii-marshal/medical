import { Injectable, NgZone } from '@angular/core';
import { guid } from '../helpers/guid';
import { PubSubService } from './pub-sub.service';

declare var window: any;

@Injectable()
export class CrossTabNotifierService {

    public subscribers = new Map();

    public tabexInstance: any;

    public heartbeatConf = {
        delayForCheckLastTab: 10,
        storageKeys: {
            uniqueTabId: 'uniqueTabId', // SessionStorage save data for tab and not divide data for differences domain.
            loggedIn: 'loggedIn',
            lastTabLogout: 'lastTabLogout',
        },
    };

    public saveTabIdBeforeInit: string;

    constructor(
        private zone: NgZone,
        private pubSub: PubSubService,
    ) {
        this.saveTabIdBeforeInit = sessionStorage.getItem(this.heartbeatConf.storageKeys.uniqueTabId);

        this.zone.runOutsideAngular(() => {
            this.tabexInstance = window.tabex.client();
        });

        this.initCrosstab();
        this.watchAuth();
        this.watchTabLoad();
    }

    public initCrosstab() {

        let uniqueTabId = sessionStorage.getItem(this.heartbeatConf.storageKeys.uniqueTabId);

        if (!uniqueTabId) {
            uniqueTabId = guid() + window.location.host;
            sessionStorage.setItem(this.heartbeatConf.storageKeys.uniqueTabId, uniqueTabId);
        }
    }

    public setTabLoggedIn(): void {
        localStorage.setItem(this.heartbeatConf.storageKeys.loggedIn, `true`);
    }

    public setTabLogout(): void {
        localStorage.setItem(this.heartbeatConf.storageKeys.loggedIn, `false`);
    }

    public on(type: string, callback: any, context: any): void {

        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }

        this.subscribers.get(type).push({ callback, context });
    }

    public off(type: string, callback: any): boolean {
        const subscribers = this.subscribers.get(type);
        let index: number;

        if (subscribers && subscribers.length) {
            index = subscribers.reduce((acc, s, i) => {
                acc = s === callback ? i : -1;
                return acc;
            }, -1);

            if (index > -1) {
                subscribers.splice(index, 1);
                this.subscribers.set(type, subscribers);
                return true;
            }
        }
        return false;
    }

    public notifySubscribers(type): void {
        const subscribers = this.subscribers.get(type);

        if (subscribers && subscribers.length) {
            subscribers.forEach((s) => {
                this.zone.run(() => {
                    s.callback.call(s.context);
                });
            });
        }
    }

    public watchAuth(): void {
        this.zone.runOutsideAngular(() => {
            window.addEventListener('storage', (event) => {
                if (JSON.parse(localStorage.getItem('continueWorkingPressed'))) {
                    this.pubSub.$pub('sessionExpiredClosed');
                }

                if (event.key === this.heartbeatConf.storageKeys.loggedIn) {
                    if (event.newValue === 'true') {
                        this.notifySubscribers('loggedIn');
                    } else {
                        this.notifySubscribers('logout');
                    }
                }
            }, false);
        });
    }

    public watchTabLoad() {
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {

                // Found all key with prefix tabex_default_router
                const tabsArr = Object.keys(localStorage).filter((key) => {
                    return key.match(/tabex_default_router_/);
                });

                if (tabsArr.length === 1 &&
                    (!this.saveTabIdBeforeInit || !this.saveTabIdBeforeInit.match(window.location.host))
                ) {

                    sessionStorage.removeItem(this.heartbeatConf.storageKeys.uniqueTabId);

                    this.initCrosstab();

                    this.notifySubscribers('lastTabLogout');
                }
            }, this.heartbeatConf.delayForCheckLastTab);
        });
    }
}
