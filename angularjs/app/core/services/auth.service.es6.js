export default class authService {
    constructor($state,
                $rootScope,
                ngToast,
                $timeout,
                $q,
                $injector,
                loginConstants,
                $http,
                WEB_API_SERVICE_URI,
                WEB_API_IDENTITY_URI,
                uiDrowzCalendarConfig,
                advancedFiltersService,
                infinityTableService,
                CURRENT_DOMAIN
                ) {
        'ngInject';

        this.$state = $state;
        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.$timeout = $timeout;
        this.$q = $q;
        this.loginConstants = loginConstants;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
        this.CURRENT_DOMAIN = CURRENT_DOMAIN;
        this.advancedFiltersService = advancedFiltersService;
        this.infinityTableService = infinityTableService;
        this.uiDrowzCalendarConfig = uiDrowzCalendarConfig;
        // this.tabNotifier = $injector.get('crosstabNotifierProvider');

        // this.tabNotifier.on('logout', this.goToLogin, this);
        // this.tabNotifier.on('lastTabLogout', () => this.logout());

    }

    goToLogin() {
        if (typeof this._getRefreshToken() !== 'undefined') {
            this.$state.go('login');
        }
    }

    login(loginModel) {
        let data = `grant_type=${this.loginConstants.grantType}` +
            `&scope=${this.loginConstants.scopeValue}` +
            `&client_id=${this.loginConstants.clientId}` +
            `&client_secret=${this.loginConstants.clientSecret}` +
            `&username=${encodeURIComponent(loginModel.username.trim())}` +
            `&password=${encodeURIComponent(loginModel.password.trim())}`;

        return this.$http({
            method: 'POST',
            url: `${this.WEB_API_IDENTITY_URI}connect/token`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        })
            .then((response) => {
                // clear filters on Calendar
                if (localStorage.filter) {
                    localStorage.removeItem('filter');
                }
                this._setToken(response.data, 'login', data);

                return response;
            })
            .catch((err) => {
                this.ngToast.danger(err.data.error_description);
                return this.$q.reject(err);
            });
    }

    logout(action) {
        this.advancedFiltersService.resetSavedFilters();
        this.infinityTableService.resetSavedState();
        this.uiDrowzCalendarConfig.saveCurrentParams(null, null);

        this._setToken({}, action || 'logout');
        this.$rootScope.$broadcast('logout');

        // console.log(`${ this.CURRENT_DOMAIN }/v2#/login`);

        // window.location.replace(`${ this.CURRENT_DOMAIN }/v2#/login`);

        // this.tabNotifier.setTabLogout();
    }

    remindPass(data) {
        return this.$http.post(`${this.WEB_API_IDENTITY_URI}account/ForgotPassword`, data);
    }

    changePass(data) {
        return this.$http.post(`${this.WEB_API_IDENTITY_URI}Account/ChangePassword`, data);
    }

    refreshToken() {
        let data = `client_id=${this.loginConstants.clientId}` +
            `&client_secret=${this.loginConstants.clientSecret}` +
            `&refresh_token=${this._getRefreshToken()}` +
            `&grant_type=${this.loginConstants.refreshGrantType}`;

        return this.$http({
            method: 'POST',
            url: `${this.WEB_API_IDENTITY_URI}connect/token`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: data
        })
            .then((response) => {
                this._setToken(response.data, 'refreshToken');
                return response;
            })
            .catch((err) => this.$q.reject(err));
    }

    getTokenExpireDate() {
        return parseInt(JSON.parse(localStorage.getItem(this.loginConstants.tokenExpireDate)));
    }

    getAccessToken() {
        // return undefined if token is expired
        let expireDateUnixTime = this.getTokenExpireDate();

        if (+(new Date()) > expireDateUnixTime) {
            return undefined;
        }

        return JSON.parse(localStorage.getItem(this.loginConstants.accessToken));
    }

    _setToken(token, action) {
        switch (action) {
            case 'logout':
                localStorage.removeItem(this.loginConstants.accessToken);
                localStorage.removeItem(this.loginConstants.refreshToken);
                localStorage.removeItem(this.loginConstants.tokenExpireDate);
                break;
            case 'logout.userPressButton':
                localStorage.removeItem(this.loginConstants.accessToken);
                localStorage.removeItem(this.loginConstants.refreshToken);
                localStorage.removeItem(this.loginConstants.tokenExpireDate);
                break;

            case 'login':
            case 'refreshToken':
                localStorage.setItem(this.loginConstants.accessToken, JSON.stringify(token.access_token));
                localStorage.setItem(this.loginConstants.refreshToken, JSON.stringify(token.refresh_token));
                localStorage.setItem(this.loginConstants.tokenExpireDate, JSON.stringify(+(new Date()) + token.expires_in * 1000)); // 20 min
                break;
            default:
                // localStorage.setItem(this.loginConstants.accessToken, token.access_token);
                // localStorage.setItem(this.loginConstants.refreshToken, token.refresh_token);
                // localStorage.setItem(this.loginConstants.tokenExpireDate, +(new Date()) + token.expires_in * 1000); // 20 min
                break;
        }
    }

    _getRefreshToken() {
        return JSON.parse(localStorage.getItem(this.loginConstants.refreshToken));
    }
}
