export default class CrosstabNotifierProvider {

    constructor() {
        'ngInject';

        this.heartbeatConf = {
            updateTime: 1000,
            lagTime: 3000,
            delayForCheckLastTab: 500,
            storageKeys: {
                // uniqueTabId: 'uniqueTabId',
                // crossTabData: 'crossTabData',
                // loggedIn: 'loggedIn',
                // lastTabLogout: 'lastTabLogout'
            }
        };

        this.subscribers = new Map();

        this.saveTabIdBeforeInit = sessionStorage.getItem(this.heartbeatConf.storageKeys.uniqueTabId);

        this.watchAuth();
        this.initCrosstab();
        this.startHeartbeat();
        this.watchTabLoad();
    }

    $get() {
        return {
            // setTabLoggedIn: () => this.setTabLoggedIn(),
            // setTabLogout: () => this.setTabLogout(),
            on: (type, callback, context) => this.on(type, callback, context),
            off: (type, callback) => this.off(type, callback)
        };
    }

    initCrosstab() {
        let uniqueTabId = sessionStorage.getItem(this.heartbeatConf.storageKeys.uniqueTabId);

        if (!uniqueTabId) {
            uniqueTabId = guid();
            sessionStorage.setItem(this.heartbeatConf.storageKeys.uniqueTabId, uniqueTabId);
        }

        let crossTabData = JSON.parse(localStorage.getItem(this.heartbeatConf.storageKeys.crossTabData));

        if (!crossTabData) {

            crossTabData = [{
                id: uniqueTabId,
                lastUpdateTime: +new Date()
            }];

            localStorage.setItem(this.heartbeatConf.storageKeys.crossTabData, JSON.stringify(crossTabData));
        } else if (!crossTabData.find((tab) => tab.id === uniqueTabId)) {

            crossTabData.push({
                id: uniqueTabId,
                lastUpdateTime: +new Date()
            });

            localStorage.setItem(this.heartbeatConf.storageKeys.crossTabData, JSON.stringify(crossTabData));
        }

    }

    checkTabsAndUpdateCurrent() {
        const uniqueTabId = sessionStorage.getItem(this.heartbeatConf.storageKeys.uniqueTabId);
        let crossTabData = JSON.parse(localStorage.getItem(this.heartbeatConf.storageKeys.crossTabData));
        const tabItem = crossTabData.find((tab) => tab.id === uniqueTabId);

        if (tabItem) {
            tabItem.lastUpdateTime = +new Date();

            crossTabData = crossTabData.filter((tab) => {
                const timeDiff = ((+new Date()) - tab.lastUpdateTime);

                return timeDiff < this.heartbeatConf.lagTime;
            });

            localStorage.setItem(this.heartbeatConf.storageKeys.crossTabData, JSON.stringify(crossTabData));
        }
    }

    startHeartbeat() {
        this.checkTabsAndUpdateCurrent();

        setInterval(() => {
            this.checkTabsAndUpdateCurrent();
        }, this.heartbeatConf.updateTime);
    }

    setTabLoggedIn() {
        // localStorage.setItem(this.heartbeatConf.storageKeys.loggedIn, true);
    }

    setTabLogout() {
        // localStorage.setItem(this.heartbeatConf.storageKeys.loggedIn, false);
    }

    on(type, callback, context) {
        this.subscribers.has(type) || this.subscribers.set(type, []);
        this.subscribers.get(type).push({ callback, context });
    }

    off(type, callback) {
        let subscribers = this.subscribers.get(type),
            index;

        if (subscribers && subscribers.length) {
            index = subscribers.reduce((acc, s, index) => {
                acc = s === callback ? index : -1;
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

    notifySubscribers(type) {
        let subscribers = this.subscribers.get(type);

        if (subscribers && subscribers.length) {
            subscribers.forEach((s) => s.callback.call(s.context));
        }
    }

    watchAuth() {
        // window.addEventListener('storage', (event) => {
        //
        //     if (event.key === this.heartbeatConf.storageKeys.loggedIn && document.hidden) {
        //         if (event.newValue) {
        //             this.notifySubscribers('loggedIn');
        //         } else {
        //             this.notifySubscribers('logout');
        //         }
        //     }
        //
        // }, false);
    }

    watchTabLoad() {

        window.addEventListener('load', () => {

            setTimeout(() => {
                const openedTabs = JSON.parse(localStorage.getItem(this.heartbeatConf.storageKeys.crossTabData));

                if (openedTabs.length === 1 &&
                    !this.saveTabIdBeforeInit
                ) {
                    this.notifySubscribers('lastTabLogout');
                }

            }, this.heartbeatConf.delayForCheckLastTab);
        });
    }

}
